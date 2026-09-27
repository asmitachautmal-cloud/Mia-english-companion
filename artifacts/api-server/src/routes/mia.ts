import { and, asc, count, desc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  ChatResponse,
  CreateConversationBody,
  CreateConversationResponse,
  DeleteConversationParams,
  GetConversationParams,
  GetConversationResponse,
  GetMyProfileResponse,
  GetProgressResponse,
  ListConversationsResponse,
  ListVocabularyResponse,
  SaveVocabularyBody,
  SaveVocabularyResponse,
  SendMessageBody,
  SendMessageParams,
  SendMessageResponse,
  UpdateMyProfileBody,
  UpdateMyProfileResponse,
} from "@workspace/api-zod";
import {
  conversationsTable,
  db,
  messagesTable,
  profilesTable,
  vocabularyTable,
  type Message,
  type Profile,
} from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { askMia } from "../lib/gemini";

const router: IRouter = Router();
router.use(requireAuth);

function userId(req: Express.Request): string {
  if (!req.userId) throw new Error("Missing authenticated user");
  return req.userId;
}

async function ensureProfile(currentUserId: string): Promise<Profile> {
  const [profile] = await db
    .insert(profilesTable)
    .values({ userId: currentUserId })
    .onConflictDoUpdate({
      target: profilesTable.userId,
      set: { updatedAt: new Date() },
    })
    .returning();
  return profile;
}

function toMessageResponse(message: Message) {
  return {
    id: message.id,
    role: message.role === "assistant" ? "assistant" : "user",
    content: message.content,
    correction: message.correction,
    vocabulary: message.vocabulary ?? [],
    createdAt: message.createdAt,
  };
}

router.get("/me/profile", async (req, res): Promise<void> => {
  const profile = await ensureProfile(userId(req));
  res.json(GetMyProfileResponse.parse(profile));
});

router.patch("/me/profile", async (req, res): Promise<void> => {
  const parsed = UpdateMyProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const currentUserId = userId(req);
  await ensureProfile(currentUserId);
  const [profile] = await db
    .update(profilesTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(profilesTable.userId, currentUserId))
    .returning();
  res.json(UpdateMyProfileResponse.parse(profile));
});

router.get("/conversations", async (req, res): Promise<void> => {
  const conversations = await db
    .select({
      id: conversationsTable.id,
      title: conversationsTable.title,
      mode: conversationsTable.mode,
      createdAt: conversationsTable.createdAt,
      updatedAt: conversationsTable.updatedAt,
    })
    .from(conversationsTable)
    .where(eq(conversationsTable.userId, userId(req)))
    .orderBy(desc(conversationsTable.updatedAt));
  res.json(ListConversationsResponse.parse(conversations));
});

router.post("/conversations", async (req, res): Promise<void> => {
  const parsed = CreateConversationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [conversation] = await db
    .insert(conversationsTable)
    .values({ ...parsed.data, userId: userId(req) })
    .returning();
  res.status(201).json(CreateConversationResponse.parse(conversation));
});

router.get("/conversations/:id", async (req, res): Promise<void> => {
  const params = GetConversationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [conversation] = await db
    .select()
    .from(conversationsTable)
    .where(and(eq(conversationsTable.id, params.data.id), eq(conversationsTable.userId, userId(req))));
  if (!conversation) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }
  const messages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, conversation.id))
    .orderBy(asc(messagesTable.createdAt));
  res.json(GetConversationResponse.parse({ ...conversation, messages: messages.map(toMessageResponse) }));
});

router.delete("/conversations/:id", async (req, res): Promise<void> => {
  const params = DeleteConversationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [conversation] = await db
    .select({ id: conversationsTable.id })
    .from(conversationsTable)
    .where(and(eq(conversationsTable.id, params.data.id), eq(conversationsTable.userId, userId(req))));
  if (!conversation) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }
  await db.delete(messagesTable).where(eq(messagesTable.conversationId, conversation.id));
  await db
    .delete(conversationsTable)
    .where(and(eq(conversationsTable.id, conversation.id), eq(conversationsTable.userId, userId(req))));
  res.sendStatus(204);
});

router.post("/conversations/:id/messages", async (req, res): Promise<void> => {
  const params = SendMessageParams.safeParse(req.params);
  const body = SendMessageBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const currentUserId = userId(req);
  const [conversation] = await db
    .select()
    .from(conversationsTable)
    .where(and(eq(conversationsTable.id, params.data.id), eq(conversationsTable.userId, currentUserId)));
  if (!conversation) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }
  const profile = await ensureProfile(currentUserId);
  const recentMessages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, conversation.id))
    .orderBy(desc(messagesTable.createdAt))
    .limit(12);

  const [userMessage] = await db
    .insert(messagesTable)
    .values({ conversationId: conversation.id, role: "user", content: body.data.content })
    .returning();

  let mia;
  try {
    mia = await askMia(profile, conversation.mode, [...recentMessages.reverse(), userMessage]);
  } catch (error) {
    req.log.error({ err: error }, "Gemini request failed");
    res.status(503).json({ error: "Hmm, I lost my train of thought for a second. Try that again?" });
    return;
  }

  const [assistantMessage] = await db
    .insert(messagesTable)
    .values({
      conversationId: conversation.id,
      role: "assistant",
      content: mia.reply,
      correction: mia.correction ?? null,
      vocabulary: mia.vocabulary ?? [],
    })
    .returning();
  const currentMemory = profile.learningMemory ?? [];
  const memoryUpdates = (mia.memory_updates ?? [])
    .map((item) => item.trim())
    .filter(Boolean);
  if (memoryUpdates.length) {
    const nextMemory = [...new Set([...currentMemory, ...memoryUpdates])].slice(-20);
    await db
      .update(profilesTable)
      .set({ learningMemory: nextMemory, updatedAt: new Date() })
      .where(eq(profilesTable.userId, currentUserId));
  }
  await db
    .update(conversationsTable)
    .set({ updatedAt: new Date() })
    .where(eq(conversationsTable.id, conversation.id));

  const response = {
    message: toMessageResponse(assistantMessage),
    correction: mia.correction ?? null,
    vocabulary: mia.vocabulary ?? [],
    conversationIntent: mia.conversation_intent ?? "casual_chat",
    emotion: mia.emotion ?? "neutral",
    shouldContinue: mia.should_continue !== false,
  };
  res.json(SendMessageResponse.parse(response));
});

router.get("/vocabulary", async (req, res): Promise<void> => {
  const vocabulary = await db
    .select({
      id: vocabularyTable.id,
      word: vocabularyTable.word,
      meaning: vocabularyTable.meaning,
      example: vocabularyTable.example,
      createdAt: vocabularyTable.createdAt,
    })
    .from(vocabularyTable)
    .where(eq(vocabularyTable.userId, userId(req)))
    .orderBy(desc(vocabularyTable.createdAt));
  res.json(ListVocabularyResponse.parse(vocabulary));
});

router.post("/vocabulary", async (req, res): Promise<void> => {
  const parsed = SaveVocabularyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const currentUserId = userId(req);
  const [item] = await db
    .insert(vocabularyTable)
    .values({ ...parsed.data, userId: currentUserId })
    .onConflictDoUpdate({
      target: [vocabularyTable.userId, vocabularyTable.word],
      set: { meaning: parsed.data.meaning, example: parsed.data.example },
    })
    .returning({
      id: vocabularyTable.id,
      word: vocabularyTable.word,
      meaning: vocabularyTable.meaning,
      example: vocabularyTable.example,
      createdAt: vocabularyTable.createdAt,
    });
  res.status(201).json(SaveVocabularyResponse.parse(item));
});

router.get("/progress", async (req, res): Promise<void> => {
  const currentUserId = userId(req);
  const profile = await ensureProfile(currentUserId);
  const conversations = await db
    .select({ id: conversationsTable.id })
    .from(conversationsTable)
    .where(eq(conversationsTable.userId, currentUserId));
  const allMessages = conversations.length
    ? await db
        .select({ createdAt: messagesTable.createdAt, role: messagesTable.role, correction: messagesTable.correction })
        .from(messagesTable)
        .innerJoin(conversationsTable, eq(messagesTable.conversationId, conversationsTable.id))
        .where(eq(conversationsTable.userId, currentUserId))
    : [];
  const vocabulary = await db
    .select({ id: vocabularyTable.id })
    .from(vocabularyTable)
    .where(eq(vocabularyTable.userId, currentUserId));
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const practiceDays = new Set(
    allMessages.map((message) => message.createdAt.toISOString().slice(0, 10)),
  ).size;
  const minutesToday = Math.min(
    profile.dailyGoal,
    allMessages.filter((message) => message.createdAt.toISOString().slice(0, 10) === today).length,
  );
  res.json(
    GetProgressResponse.parse({
      conversationsCompleted: conversations.length,
      messagesExchanged: allMessages.length,
      vocabularySaved: vocabulary.length,
      correctionsMade: allMessages.filter((message) => message.correction !== null).length,
      practiceDays,
      speakingSessions: 0,
      minutesToday,
      dailyGoal: profile.dailyGoal,
    }),
  );
});

export default router;