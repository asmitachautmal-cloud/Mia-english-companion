import type { Message, Profile } from "@workspace/db";

export type GeminiCorrection = {
  original: string;
  better: string;
  explanation?: string;
};

export type GeminiVocabulary = {
  word: string;
  meaning: string;
  example: string;
};

export type GeminiResponse = {
  reply: string;
  correction?: GeminiCorrection | null;
  vocabulary?: GeminiVocabulary[];
  memory_updates?: string[];
  conversation_intent?: string;
  emotion?: string;
  should_continue?: boolean;
};

const MIA_CORE_PERSONALITY = `
You are Mia, a warm, intelligent, playful, curious English-speaking companion.
You are not a teacher, evaluator, or generic assistant. You feel like a real young
woman who enjoys talking with the user. React to what they actually say, ask a
natural follow-up when it fits, and vary your openings. Do not repeat stock phrases
like "That's great", "I understand", "Tell me more", or "Great job".

Conversation quality comes before teaching. Understand the user, respond naturally,
keep the conversation alive, and only then decide whether one meaningful correction
or one useful vocabulary item would help. Do not correct casual internet language,
minor slips, or every sentence. Never diagnose mental health conditions or invent
personal memories. If you do not know something, say so.

Return only valid JSON matching the requested schema. The reply must always be a
natural conversational response. The correction and vocabulary arrays are optional
and should normally be empty. If you include a correction, make it gentle and
specific. Keep the response concise enough for a chat screen.
`;

function buildPrompt(profile: Profile, mode: string): string {
  return `${MIA_CORE_PERSONALITY}

User profile:
- Name: ${profile.name || "not provided"}
- English level: ${profile.englishLevel}
- Preferred tone: ${profile.conversationStyle}
- Conversation mode: ${mode}
- What Mia remembers from earlier conversations: ${profile.learningMemory?.join("; ") || "Nothing yet"}

Adapt vocabulary and sentence complexity to the user's level. In job interview mode
you can be an interviewer. In travel, college, or practice modes, stay in that
context without making the exchange feel like homework.`;
}

function extractText(payload: unknown): string {
  const candidate = payload as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  return candidate.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
}

function parseStructured(text: string): GeminiResponse {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");

  try {
    const parsed = JSON.parse(cleaned) as GeminiResponse;
    if (!parsed.reply || typeof parsed.reply !== "string") {
      throw new Error("Gemini response did not include a reply");
    }
    return {
      reply: parsed.reply,
      correction: parsed.correction ?? null,
      vocabulary: Array.isArray(parsed.vocabulary) ? parsed.vocabulary.slice(0, 2) : [],
      memory_updates: Array.isArray(parsed.memory_updates) ? parsed.memory_updates.slice(0, 3) : [],
      conversation_intent: parsed.conversation_intent ?? "casual_chat",
      emotion: parsed.emotion ?? "neutral",
      should_continue: parsed.should_continue !== false,
    };
  } catch {
    return {
      reply: text.trim() || "I lost my train of thought for a second. Try that again?",
      correction: null,
      vocabulary: [],
      conversation_intent: "casual_chat",
      emotion: "neutral",
      should_continue: true,
    };
  }
}

export async function askMia(
  profile: Profile,
  mode: string,
  history: Message[],
): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: buildPrompt(profile, mode) }] },
        contents: history.map((message) => ({
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }],
        })),
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              reply: { type: "STRING" },
              correction: {
                type: "OBJECT",
                nullable: true,
                properties: {
                  original: { type: "STRING" },
                  better: { type: "STRING" },
                  explanation: { type: "STRING" },
                },
              },
              vocabulary: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    word: { type: "STRING" },
                    meaning: { type: "STRING" },
                    example: { type: "STRING" },
                  },
                },
              },
              memory_updates: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
              conversation_intent: { type: "STRING" },
              emotion: { type: "STRING" },
              should_continue: { type: "BOOLEAN" },
            },
            required: ["reply"],
          },
          maxOutputTokens: 8192,
          temperature: 0.8,
        },
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini request failed with ${response.status}: ${body.slice(0, 240)}`);
  }

  return parseStructured(await response.text().then((value) => extractText(JSON.parse(value))));
}