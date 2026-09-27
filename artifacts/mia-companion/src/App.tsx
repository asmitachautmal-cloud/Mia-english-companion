import { type ReactNode, useEffect, useRef, useState } from "react";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import {
  type Message,
  type VocabularySuggestion,
  getGetConversationQueryKey,
  getGetProgressQueryKey,
  getListConversationsQueryKey,
  getListVocabularyQueryKey,
  useCreateConversation,
  useGetConversation,
  useGetMyProfile,
  useGetProgress,
  useListConversations,
  useListVocabulary,
  useSaveVocabulary,
  useSendMessage,
  useUpdateMyProfile,
} from "@workspace/api-client-react";
import { ClerkProvider, Show, SignIn, SignUp, useAuth, useClerk, useUser } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import {
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  Clock3,
  Headphones,
  Home as HomeIcon,
  Lightbulb,
  Menu,
  MessageCircle,
  Mic,
  MoreHorizontal,
  Pause,
  Play,
  Send,
  Settings2,
  Volume2,
  X,
} from "lucide-react";
import {
  Link,
  Redirect,
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from "wouter";

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#b76f69",
    colorForeground: "#493632",
    colorMutedForeground: "#806d64",
    colorDanger: "#a54e4e",
    colorBackground: "#f8f0e7",
    colorInput: "#fffaf5",
    colorInputForeground: "#493632",
    colorNeutral: "#dfcec1",
    fontFamily: "DM Sans",
    borderRadius: "1rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-[#f8f0e7] rounded-2xl w-[440px] max-w-full overflow-hidden",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-[#493632]",
    headerSubtitle: "text-[#806d64]",
    socialButtonsBlockButtonText: "text-[#493632]",
    formFieldLabel: "text-[#493632]",
    footerActionLink: "text-[#b76f69]",
    footerActionText: "text-[#806d64]",
    dividerText: "text-[#806d64]",
    identityPreviewEditButton: "text-[#b76f69]",
    formFieldSuccessText: "text-[#66836d]",
    alertText: "text-[#8b4f4b]",
    logoBox: "mb-2",
    logoImage: "max-h-10",
    socialButtonsBlockButton: "border-[#dfcec1] bg-[#fffaf5] hover:bg-[#f3e5dc]",
    formButtonPrimary: "bg-[#b76f69] hover:bg-[#a8605a] text-[#fff9f1]",
    formFieldInput: "border-[#dfcec1] bg-[#fffaf5] text-[#493632]",
    footerAction: "bg-transparent",
    dividerLine: "bg-[#dfcec1]",
    alert: "border-[#e5b9b3] bg-[#f9e4de]",
    otpCodeFieldInput: "border-[#dfcec1] bg-[#fffaf5] text-[#493632]",
    formFieldRow: "mb-4",
    main: "px-2",
  },
};

function Home() {
  const [, setLocation] = useLocation();
  return <div className="min-h-[100dvh] overflow-hidden bg-[#f6f0e7] grain">
    <SiteNav />
    <main>
      <section className="relative mx-auto flex min-h-[calc(100dvh-76px)] max-w-[1380px] items-center px-6 pb-20 pt-12 lg:px-16 lg:pt-0">
        <div className="pointer-events-none absolute -right-32 top-12 h-[560px] w-[560px] rounded-full bg-[#ead4cc]/65 blur-3xl" />
        <div className="relative z-10 w-full lg:w-[58%]">
          <div className="mb-8 flex items-center gap-3 animate-rise-in"><span className="editorial-line" /><span className="eyebrow">A more human way to practise</span></div>
          <h1 className="max-w-4xl text-[clamp(4rem,9.2vw,9.4rem)] leading-[.84] tracking-[-.065em] text-[#3b2b28] animate-rise-in delay-1">Speak English.<br /><span className="serif italic text-[#b76f69]">Without</span> the fear<br />of making mistakes.</h1>
          <p className="mt-9 max-w-md text-[1.1rem] leading-relaxed text-[#79675f] animate-rise-in delay-2">A private conversation with someone who listens, remembers, and makes room for your voice.</p>
          <div className="mt-10 flex flex-wrap items-center gap-4 animate-rise-in delay-3">
            <button data-testid="button-talk-to-mia" onClick={() => setLocation('/talk')} className="press-button flex items-center gap-4 rounded-full bg-[#b76f69] px-7 py-4 text-[.92rem] font-semibold text-[#fff9f1] shadow-[0_12px_24px_rgba(157,91,86,.18)]">Talk to Mia <ArrowUpRight size={17} /></button>
            <a data-testid="link-how-it-works" href="#how-it-works" className="flex items-center gap-2 text-sm font-medium text-[#66534e] underline decoration-[#cba59e] underline-offset-8">See how it feels <ChevronDown size={15} /></a>
          </div>
        </div>
        <div className="relative mt-16 flex h-[430px] w-full items-end justify-center lg:absolute lg:bottom-0 lg:right-[4%] lg:mt-0 lg:h-[700px] lg:w-[48%]">
          <div className="absolute bottom-10 h-[370px] w-[370px] rounded-[48%_52%_50%_50%] bg-[#e8c8bf] animate-float-slow" />
          <div className="absolute bottom-16 right-[7%] hidden rotate-[-8deg] border-l border-t border-[#bb8077]/45 px-7 py-4 text-[#a76762] lg:block"><span className="eyebrow text-[#a76762]">Mia / 01</span><p className="serif mt-1 text-2xl italic">You can take your time.</p></div>
          <MiaIllustration />
          <div className="absolute bottom-3 left-[11%] flex items-center gap-2 text-xs text-[#876b62]"><span className="h-2 w-2 rounded-full bg-[#82a286] animate-pulse-soft" />Mia is online</div>
        </div>
      </section>
      <section id="how-it-works" className="bg-[#eee3d7] px-6 py-24 lg:px-16 lg:py-36">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><span className="eyebrow">Not a lesson</span><h2 className="mt-5 text-5xl leading-[.95] tracking-[-.05em] text-[#463530] md:text-7xl">A conversation<br /><span className="serif italic text-[#b76f69]">that goes somewhere.</span></h2></div><p className="max-w-sm text-lg leading-relaxed text-[#806e65]">Mia meets you where you are. Talk about the tiny thing that happened today, the place you want to go, or absolutely nothing at all.</p></div>
          <div className="mt-20 grid gap-px overflow-hidden rounded-[2rem] bg-[#d8c6b9] md:grid-cols-3">
            {[['01','Show up as you are','No prep, no red pen. Just open the door.'],['02','Find your natural rhythm','Mia gently keeps the conversation moving.'],['03','Leave with more confidence','Small moments add up to a voice that feels like yours.']].map(([n,t,d]) => <div key={n} className="bg-[#f3e9dd] p-8 md:min-h-[280px] md:p-10"><span className="eyebrow text-[#b76f69]">{n}</span><div className="mt-20"><h3 className="text-xl font-medium tracking-[-.02em] text-[#463530]">{t}</h3><p className="mt-3 max-w-[220px] text-sm leading-relaxed text-[#806e65]">{d}</p></div></div>)}
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden bg-[#b97870] px-6 py-28 text-[#fff7ef] lg:px-16 lg:py-40">
        <div className="absolute -right-20 top-20 h-72 w-72 rounded-full border border-[#e7b9ae]/40" /><div className="absolute -right-4 top-36 h-72 w-72 rounded-full border border-[#e7b9ae]/25" />
        <div className="mx-auto max-w-[1200px]"><span className="eyebrow text-[#f2d3cb]">The promise</span><h2 className="mt-7 max-w-3xl text-[clamp(3.5rem,7vw,7.5rem)] leading-[.86] tracking-[-.065em]">No classrooms.<br /><span className="serif italic text-[#f6d2c7]">No pressure.</span><br />Just conversation.</h2><button data-testid="button-start-talking" onClick={() => setLocation('/talk')} className="press-button mt-12 flex items-center gap-4 rounded-full bg-[#f8e9df] px-7 py-4 font-semibold text-[#8f504d]">Start talking <ArrowUpRight size={17} /></button></div>
      </section>
      <footer className="flex flex-col justify-between gap-8 bg-[#f6f0e7] px-6 py-10 text-[#79675f] md:flex-row md:items-end lg:px-16"><div><div className="serif text-4xl text-[#3b2b28]">mia<span className="text-[#b76f69]">.</span></div><p className="mt-2 text-sm">Your English, becoming yours.</p></div><div className="flex gap-6 text-xs"><span>Made for real conversations</span><span>© 2026 Mia</span></div></footer>
    </main>
  </div>;
}

function MiaIllustration() {
  return <div className="mia-silhouette relative z-10 h-[390px] w-[270px] animate-float-slow">
    <div className="absolute left-[67px] top-[36px] h-[166px] w-[140px] rounded-[48%_52%_48%_52%] bg-[#ad796d] shadow-[inset_-12px_-14px_0_rgba(107,65,58,.11)]">
      <div className="absolute -left-3 top-8 h-36 w-9 rounded-full bg-[#99675f]" /><div className="absolute -right-6 top-10 h-40 w-12 rounded-full bg-[#98675f]" />
      <div className="absolute left-[28px] top-[74px] h-[5px] w-[6px] rounded-full bg-[#493330]" /><div className="absolute right-[27px] top-[74px] h-[5px] w-[6px] rounded-full bg-[#493330]" />
      <div className="absolute left-[42px] top-[102px] h-6 w-14 rounded-[50%] border-b-2 border-[#754c48]/60" />
    </div>
    <div className="absolute left-[49px] top-[175px] h-[200px] w-[180px] rounded-t-[5rem] bg-[#ddd0c1]"><div className="absolute left-[74px] top-0 h-[72px] w-[34px] bg-[#c3afa0]" /><div className="absolute -left-[22px] top-[36px] h-[128px] w-[36px] rotate-[14deg] rounded-full bg-[#c7aa9a]" /><div className="absolute -right-[22px] top-[36px] h-[128px] w-[36px] rotate-[-14deg] rounded-full bg-[#c7aa9a]" /></div>
    <div className="absolute bottom-0 left-[13px] h-32 w-28 rounded-t-[3.5rem] bg-[#a96b66]" /><div className="absolute bottom-0 right-[8px] h-32 w-28 rounded-t-[3.5rem] bg-[#a96b66]" />
    <div className="absolute left-[106px] top-[215px] h-12 w-14 rounded-full bg-[#f5e9dc] opacity-80" />
  </div>;
}

function SiteNav() {
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  return <header className="relative z-40 flex items-center justify-between px-6 py-6 lg:px-16">
    <Link href="/" data-testid="link-home-logo" className="serif text-[2rem] leading-none tracking-[-.04em] text-[#3b2b28]">mia<span className="text-[#b76f69]">.</span></Link>
    <nav className={`${open ? 'flex' : 'hidden'} absolute left-6 right-6 top-[74px] flex-col gap-4 rounded-2xl bg-[#f8f0e7] p-5 shadow-[0_20px_40px_rgba(72,46,39,.1)] md:static md:flex md:flex-row md:items-center md:gap-8 md:bg-transparent md:p-0 md:shadow-none`}>
      {isSignedIn && <><Link data-testid="link-talk-nav" href="/talk" onClick={() => setOpen(false)} className={`text-sm ${location === '/talk' ? 'font-semibold text-[#b76f69]' : 'text-[#79675f]'}`}>Talk</Link><Link data-testid="link-progress-nav" href="/progress" onClick={() => setOpen(false)} className={`text-sm ${location === '/progress' ? 'font-semibold text-[#b76f69]' : 'text-[#79675f]'}`}>Progress</Link></>}
      {isSignedIn ? <><button data-testid="button-nav-mia" onClick={() => setLocation('/talk')} className="press-button rounded-full bg-[#3b2b28] px-5 py-2.5 text-xs font-semibold text-[#fff8f0]">Talk to Mia</button><button onClick={() => signOut({ redirectUrl: basePath || "/" })} className="text-xs text-[#806d64]">Sign out</button></> : <><Link href="/sign-in" className="text-sm text-[#79675f]">Sign in</Link><Link href="/sign-up" className="press-button rounded-full bg-[#3b2b28] px-5 py-2.5 text-xs font-semibold text-[#fff8f0]">Create account</Link></>}
    </nav>
    <button data-testid="button-mobile-menu" onClick={() => setOpen(!open)} className="rounded-full p-2 text-[#5b4842] md:hidden">{open ? <X size={21} /> : <Menu size={21} />}</button>
  </header>;
}

function AuthLoading() {
  return <div className="flex min-h-[100dvh] items-center justify-center bg-[#f7f0e7] text-sm text-[#806d64]">Opening your private space…</div>;
}

function Protected({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <AuthLoading />;
  if (!isSignedIn) return <Redirect to="/sign-in" />;
  return <>{children}</>;
}

function HomeRedirect() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <AuthLoading />;
  return isSignedIn ? <Redirect to="/talk" /> : <Home />;
}

function SignInPage() {
  return <div className="flex min-h-[100dvh] items-center justify-center bg-[#f6f0e7] px-4 grain"><SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} /></div>;
}

function SignUpPage() {
  return <div className="flex min-h-[100dvh] items-center justify-center bg-[#f6f0e7] px-4 grain"><SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} /></div>;
}

function Talk() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { data: conversations, isLoading: conversationsLoading } = useListConversations();
  const { data: profile } = useGetMyProfile();
  const updateProfile = useUpdateMyProfile();
  const createConversation = useCreateConversation();
  const sendMessage = useSendMessage();
  const saveVocabulary = useSaveVocabulary();
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const [topic, setTopic] = useState("Everyday life");
  const [showTopics, setShowTopics] = useState(false);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const creatingRef = useRef(false);
  const createdFirstConversationRef = useRef(false);
  const conversationKey = getGetConversationQueryKey(activeConversationId ?? 0);
  const { data: detail } = useGetConversation(activeConversationId ?? 0, { query: { enabled: activeConversationId !== null, queryKey: conversationKey } });

  useEffect(() => {
    if (detail?.id === activeConversationId && !sendMessage.isPending) setMessages(detail.messages);
  }, [detail, activeConversationId, sendMessage.isPending]);

  useEffect(() => {
    if (conversationsLoading || creatingRef.current) return;
    if (conversations?.length) {
      setActiveConversationId((current) => current ?? conversations[0].id);
      return;
    }
    if (createdFirstConversationRef.current) return;
    creatingRef.current = true;
    createConversation.mutate({ data: { title: "Everyday conversation", mode: "casual_chat" } }, {
      onSuccess: (conversation) => {
        createdFirstConversationRef.current = true;
        setActiveConversationId(conversation.id);
        void queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey() });
      },
      onSettled: () => { creatingRef.current = false; },
    });
  }, [conversations, conversationsLoading, createConversation]);

  const speak = (message: Message) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.onstart = () => setSpeakingId(message.id);
    utterance.onend = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
  };

  const send = () => {
    const text = draft.trim();
    if (!text || activeConversationId === null || sendMessage.isPending) return;
    setDraft("");
    setMessages((current) => [...current, { id: Date.now(), role: "user", content: text, vocabulary: [], createdAt: new Date().toISOString() }]);
    sendMessage.mutate({ id: activeConversationId, data: { content: text } }, {
      onSuccess: (response) => {
        setMessages((current) => [...current, response.message]);
        void queryClient.invalidateQueries({ queryKey: getGetConversationQueryKey(activeConversationId) });
        void queryClient.invalidateQueries({ queryKey: getGetProgressQueryKey() });
      },
    });
  };

  const toggleListening = () => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setDraft((value) => value || "I would like to practise speaking about ");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event) => {
      let transcript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) transcript += event.results[index][0].transcript;
      setDraft((value) => `${value.replace(/\s+$/, "")}${value ? " " : ""}${transcript}`.trim());
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const firstName = user?.firstName || "there";
  return <div className="min-h-[100dvh] bg-[#f7f0e7] grain"><AppShell><div className="mx-auto max-w-[1180px] px-5 pb-10 pt-6 md:px-10">
    <div className="flex flex-col justify-between gap-5 border-b border-[#decec1] pb-7 md:flex-row md:items-end"><div><span className="eyebrow">Private conversation</span><h1 className="mt-3 text-4xl tracking-[-.05em] text-[#3b2b28] md:text-6xl">Good to see you, {firstName}<span className="serif italic text-[#b76f69]">.</span></h1></div><div className="flex items-center gap-2 text-sm text-[#79675f]"><span className="h-2 w-2 rounded-full bg-[#82a286] animate-pulse-soft" /> Mia is online</div></div>
    {profile && !profile.name && <ProfileSetup onSave={(data) => updateProfile.mutate({ data })} saving={updateProfile.isPending} />}
    <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_310px]">
      <section className="min-h-[620px] rounded-[2rem] bg-[#f1e5d9] px-5 py-7 md:px-10"><div className="mb-10 flex items-center justify-between"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c58c82] text-sm font-semibold text-[#fff7ef]">M</div><div><p className="font-medium text-[#493632]">Mia</p><p className="eyebrow mt-1 text-[#9b7e73]">{sendMessage.isPending ? "Thinking" : "Listening"}</p></div></div><button data-testid="button-more-options" className="rounded-full p-2 text-[#856c63] hover:bg-[#e8d8cc]"><MoreHorizontal size={19} /></button></div>
        <div className="space-y-7">{messages.length === 0 && <p className="border-l-2 border-[#c48b82] pl-5 text-[1.05rem] leading-relaxed text-[#493632]">Hey. I’m glad you’re here. What kind of day did you have?</p>}{messages.map(message => <MessageBubble key={message.id} message={message} speaking={speakingId === message.id} onSpeak={() => speak(message)} onSaveVocabulary={(item) => saveVocabulary.mutate({ data: item }, { onSuccess: () => void queryClient.invalidateQueries({ queryKey: getListVocabularyQueryKey() }) })} />)}{sendMessage.isPending && <div className="flex justify-start"><div className="border-l-2 border-[#c48b82] pl-5 text-sm text-[#9b7e73]">Mia is finding the right words…</div></div>}</div>
        <div className="mt-20"><div className="relative flex items-center gap-3 rounded-2xl bg-[#f8f1e9] p-2 pl-5 shadow-[0_8px_24px_rgba(100,70,60,.06)]"><input data-testid="input-message" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(); }} placeholder="Say whatever is on your mind..." className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#493632] outline-none placeholder:text-[#ae988c]" /><button data-testid="button-send-message" onClick={send} disabled={!activeConversationId || sendMessage.isPending} className="press-button flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#b76f69] text-[#fff8f0] disabled:cursor-not-allowed disabled:opacity-50"><Send size={16} /></button></div><div className="mt-3 flex justify-center"><button data-testid="button-microphone" onClick={toggleListening} className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs ${listening ? 'bg-[#b76f69] text-[#fff8f0]' : 'text-[#92766c]'}`}>{listening ? <><span className="flex gap-0.5">{[1,2,3,4].map(i => <span key={i} className="h-3 w-0.5 origin-bottom animate-[wave_1s_ease-in-out_infinite] bg-current" style={{animationDelay: `${i * .12}s`}} />)}</span> Listening...</> : <><Mic size={14} /> Speak instead</>}</button></div></div>
      </section>
      <aside className="space-y-4"><div className="relative rounded-[1.5rem] bg-[#e7d3c7] p-6"><span className="eyebrow text-[#a16c65]">A little direction</span><h2 className="serif mt-3 text-3xl italic leading-tight text-[#573e39]">What’s on your mind?</h2><button data-testid="button-topic-selector" onClick={() => setShowTopics(!showTopics)} className="mt-5 flex w-full items-center justify-between border-b border-[#cba79b] pb-3 text-left text-sm text-[#70554d]">{topic}<ChevronDown size={15} /></button>{showTopics && <div className="absolute left-6 right-6 top-[147px] z-10 rounded-xl bg-[#fbf5ee] p-2 shadow-lg">{['Everyday life','A place you love','Something you learned'].map(t => <button data-testid={`button-topic-${t.replaceAll(' ', '-').toLowerCase()}`} key={t} onClick={() => { setTopic(t); setShowTopics(false); }} className="block w-full rounded-lg px-3 py-2 text-left text-xs text-[#70554d] hover:bg-[#efe1d5]">{t}</button>)}</div>}</div>
        <div className="rounded-[1.5rem] bg-[#3b2b28] p-6 text-[#f9eee4]"><span className="eyebrow text-[#c79c91]">Your gentle nudge</span><p className="mt-4 text-sm leading-relaxed text-[#ead5c9]">Try using a detail that begins with <span className="font-semibold text-[#f8cfc2]">“I remember...”</span></p><button data-testid="button-new-prompt" onClick={() => setDraft('I remember...')} className="mt-5 flex items-center gap-2 text-xs text-[#f8cfc2]">Use this prompt <ArrowUpRight size={14} /></button></div>
        <div className="flex items-center gap-3 rounded-[1.5rem] border border-[#decec1] p-5"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ead8cb] text-[#b76f69]"><Clock3 size={16} /></div><div><p className="text-sm font-medium text-[#5c4640]">A quiet practice</p><p className="mt-1 text-xs text-[#9a8177]">{conversations?.length ?? 0} saved conversation{conversations?.length === 1 ? "" : "s"}</p></div></div>
      </aside>
    </div>
  </div></AppShell></div>;
}

function ProfileSetup({ onSave, saving }: { onSave: (data: { name: string; englishLevel: "beginner" | "intermediate" | "advanced"; conversationStyle: "friendly" | "casual" | "motivating" | "professional"; dailyGoal: 5 | 10 | 15 }) => void; saving: boolean }) {
  const [name, setName] = useState("");
  const [englishLevel, setEnglishLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [conversationStyle, setConversationStyle] = useState<"friendly" | "casual" | "motivating" | "professional">("friendly");
  const [dailyGoal, setDailyGoal] = useState<5 | 10 | 15>(10);
  return <form onSubmit={(event) => { event.preventDefault(); if (name.trim()) onSave({ name: name.trim(), englishLevel, conversationStyle, dailyGoal }); }} className="mt-7 rounded-[1.8rem] bg-[#3b2b28] p-6 text-[#f9eee4] md:p-8"><div className="max-w-xl"><span className="eyebrow text-[#cda198]">A small beginning</span><h2 className="mt-3 text-3xl tracking-[-.04em]">Make this space yours.</h2><p className="mt-3 text-sm leading-relaxed text-[#ddc6ba]">Tell Mia a little about how you want to practise. You can change this whenever you like.</p></div><div className="mt-7 grid gap-4 md:grid-cols-2"><label className="text-xs text-[#e6cfc3]">What should Mia call you?<input required autoComplete="given-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your first name" className="mt-2 w-full rounded-xl border border-[#80625b] bg-[#513b37] px-4 py-3 text-sm text-[#fff8f0] outline-none placeholder:text-[#b9968d]" /></label><label className="text-xs text-[#e6cfc3]">Your current English level<select value={englishLevel} onChange={(event) => setEnglishLevel(event.target.value as typeof englishLevel)} className="mt-2 w-full rounded-xl border border-[#80625b] bg-[#513b37] px-4 py-3 text-sm text-[#fff8f0] outline-none"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label><label className="text-xs text-[#e6cfc3]">How should Mia feel?<select value={conversationStyle} onChange={(event) => setConversationStyle(event.target.value as typeof conversationStyle)} className="mt-2 w-full rounded-xl border border-[#80625b] bg-[#513b37] px-4 py-3 text-sm text-[#fff8f0] outline-none"><option value="friendly">Friendly</option><option value="casual">Casual</option><option value="motivating">Motivating</option><option value="professional">Professional</option></select></label><label className="text-xs text-[#e6cfc3]">Daily goal<select value={dailyGoal} onChange={(event) => setDailyGoal(Number(event.target.value) as typeof dailyGoal)} className="mt-2 w-full rounded-xl border border-[#80625b] bg-[#513b37] px-4 py-3 text-sm text-[#fff8f0] outline-none"><option value={5}>5 minutes</option><option value={10}>10 minutes</option><option value={15}>15 minutes</option></select></label></div><button disabled={saving || !name.trim()} className="press-button mt-6 flex items-center gap-3 rounded-full bg-[#f8e9df] px-6 py-3 text-sm font-semibold text-[#8f504d] disabled:opacity-50">{saving ? "Saving…" : "Start talking with Mia"} <ArrowUpRight size={16} /></button></form>;
}

function MessageBubble({ message, speaking, onSpeak, onSaveVocabulary }: { message: Message; speaking: boolean; onSpeak: () => void; onSaveVocabulary: (item: VocabularySuggestion) => void }) {
  return <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[88%] ${message.role === 'user' ? 'rounded-[1.3rem] rounded-br-sm bg-[#c48b82] text-[#fff8f0]' : 'text-[#493632]'}`}><div className="flex items-start gap-2"><p className={`${message.role === 'user' ? 'px-5 py-3.5' : 'border-l-2 border-[#c48b82] pl-5'} text-[1.05rem] leading-relaxed`}>{message.content}</p>{message.role === "assistant" && <button onClick={onSpeak} aria-label="Read Mia's message aloud" className={`mt-1 rounded-full p-2 text-[#a16c65] ${speaking ? "bg-[#e6c9c0]" : "hover:bg-[#ead9cf]"}`}><Volume2 size={14} /></button>}</div><span className={`mt-2 block text-[.65rem] text-[#9b7e73] ${message.role === 'user' ? 'text-right' : ''}`}>{message.role === 'user' ? 'You · just now' : 'Mia · now'}</span>{message.correction && <div className="mt-3 rounded-xl bg-[#fff7ef] p-4 text-xs text-[#70554d]"><p className="eyebrow text-[#a16c65]">A gentle correction</p><p className="mt-2 line-through opacity-60">{message.correction.original}</p><p className="mt-1 font-semibold text-[#8f504d]">{message.correction.better}</p>{message.correction.explanation && <p className="mt-2 leading-relaxed text-[#92766c]">{message.correction.explanation}</p>}</div>}{message.role === "assistant" && message.vocabulary?.length > 0 && <div className="mt-3 grid gap-2 sm:grid-cols-2">{message.vocabulary.map(item => <button key={item.word} onClick={() => onSaveVocabulary(item)} className="rounded-xl border border-[#dfc9bd] bg-[#fbf3eb] p-3 text-left text-xs hover:bg-[#f7e8df]"><span className="font-semibold text-[#8f504d]">{item.word}</span><span className="mt-1 block text-[#806d64]">{item.meaning}</span><span className="mt-2 block italic text-[#a1887e]">“{item.example}”</span><span className="mt-2 block text-[#b76f69]">Save word</span></button>)}</div>}</div></div>;
}

function Voice() {
  const { data: conversations } = useListConversations();
  const createConversation = useCreateConversation();
  const sendMessage = useSendMessage();
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const conversationId = conversations?.[0]?.id;

  const stopListening = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setActive(false);
  };
  const begin = () => {
    if (active) { stopListening(); return; }
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) { setActive(true); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.onstart = () => setActive(true);
    recognition.onend = () => setActive(false);
    recognition.onresult = event => {
      let text = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) text += event.results[index][0].transcript;
      setTranscript(text);
      if (event.results[event.results.length - 1].isFinal && conversationId) {
        sendMessage.mutate({ id: conversationId, data: { content: text } }, { onSuccess: response => speakText(response.message.content) });
      }
    };
    recognitionRef.current = recognition;
    recognition.start();
  };
  return <div className="min-h-[100dvh] bg-[#eee2d5] grain"><AppShell><main className="mx-auto flex max-w-[1000px] flex-col items-center px-6 pb-12 pt-10 text-center"><span className="eyebrow">Voice room / 04</span><h1 className="mt-8 text-5xl tracking-[-.06em] text-[#493632] md:text-7xl">Let’s talk it out<span className="serif italic text-[#b76f69]">.</span></h1><p className="mt-5 max-w-md text-[#806d64]">No need to look at the screen. Just listen, think, and speak naturally.</p><div className="relative my-14 flex h-[310px] w-[310px] items-center justify-center rounded-full border border-[#cfaca0] md:h-[390px] md:w-[390px]"><div className={`absolute inset-7 rounded-full border border-[#c58c82]/50 ${active && !paused ? 'animate-pulse-soft' : ''}`} /><div className={`absolute inset-16 rounded-full bg-[#dfb9ad] ${active && !paused ? 'animate-pulse-soft' : ''}`} /><div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[#b76f69] text-[#fff5ed] shadow-[0_12px_30px_rgba(145,82,76,.2)] md:h-40 md:w-40"><span className="serif text-7xl italic">M</span></div><div className="absolute -bottom-7 rounded-full bg-[#f7eee5] px-4 py-2 text-xs text-[#8f7168]">{active ? paused ? 'Paused for you' : 'Mia is listening' : 'Tap to begin'}</div></div>{transcript && <p className="max-w-md text-sm italic text-[#806d64]">“{transcript}”</p>}<div className="flex items-center gap-4"><button data-testid="button-voice-toggle" onClick={begin} className="press-button flex h-16 w-16 items-center justify-center rounded-full bg-[#b76f69] text-[#fff8f0]">{active ? <Pause size={21} /> : <Mic size={22} />}</button>{active && <button data-testid="button-voice-pause" onClick={() => setPaused(!paused)} className="press-button flex h-12 w-12 items-center justify-center rounded-full border border-[#cfa99e] text-[#8d6d64]">{paused ? <Play size={17} /> : <Pause size={17} />}</button>}</div><p className="mt-8 text-xs text-[#a1877c]">{active ? paused ? 'Take your time. Mia will be here.' : 'Say something about your day.' : 'A private space for your voice'}</p></main></AppShell></div>;
}

function Progress() {
  const { data: progress } = useGetProgress();
  const { data: conversations } = useListConversations();
  const { data: vocabulary } = useListVocabulary();
  const [dismissed, setDismissed] = useState(false);
  const stats = progress ?? { conversationsCompleted: 0, messagesExchanged: 0, vocabularySaved: 0, correctionsMade: 0, practiceDays: 0, speakingSessions: 0, minutesToday: 0, dailyGoal: 10 };
  return <div className="min-h-[100dvh] bg-[#f7f0e7] grain"><AppShell><main className="mx-auto max-w-[1180px] px-5 pb-16 pt-6 md:px-10"><div className="border-b border-[#decec1] pb-8"><span className="eyebrow">Your space</span><h1 className="mt-3 text-5xl tracking-[-.06em] text-[#3b2b28] md:text-7xl">Your English,<br /><span className="serif italic text-[#b76f69]">becoming yours.</span></h1><p className="mt-5 max-w-md text-[#806d64]">A quiet record of showing up, finding your words, and sounding more like yourself.</p></div><div className="mt-8 grid gap-5 md:grid-cols-[1.1fr_.9fr]"><div className="rounded-[1.8rem] bg-[#e9d7cb] p-7 md:p-9"><div className="flex items-start justify-between"><div><span className="eyebrow text-[#a66b65]">Today</span><p className="mt-4 text-6xl tracking-[-.07em] text-[#4d3732]">{stats.minutesToday}<span className="serif text-4xl italic text-[#b76f69]">m</span></p><p className="mt-2 text-sm text-[#80655d]">of your {stats.dailyGoal}-minute daily goal</p></div><div className="rounded-full bg-[#f4e8de] p-3 text-[#b76f69]"><BarChart3 size={19} /></div></div><div className="mt-12 flex h-28 items-end gap-2">{[stats.practiceDays, stats.messagesExchanged, stats.vocabularySaved, stats.correctionsMade, stats.minutesToday, stats.dailyGoal].map((value, i) => <div key={i} className="flex-1 rounded-t-full bg-[#c58c82]/70" style={{height:`${Math.max(12, Math.min(100, value * 12 + 12))}%`}} />)}</div><div className="mt-3 flex justify-between text-[.65rem] text-[#a17b70]"><span>{stats.practiceDays} practice days</span><span>{stats.messagesExchanged} messages</span></div></div><div className="rounded-[1.8rem] bg-[#3b2b28] p-7 text-[#f7ebe1] md:p-9"><span className="eyebrow text-[#cda198]">A pattern we notice</span><h2 className="serif mt-5 text-4xl italic leading-none text-[#f6d1c5]">{stats.correctionsMade ? "You’re refining your voice." : "You’re building a rhythm."}</h2><p className="mt-5 text-sm leading-relaxed text-[#ddc6ba]">{stats.messagesExchanged ? `You’ve exchanged ${stats.messagesExchanged} messages with Mia. Small moments add up to a voice that feels like yours.` : "Your first conversation will start your learning record."}</p><button data-testid="button-view-pattern" onClick={() => setDismissed(!dismissed)} className="mt-8 flex items-center gap-2 text-xs text-[#f4c4b8]">{dismissed ? 'Noted' : 'Keep this in mind'} {dismissed ? <Check size={14} /> : <ArrowUpRight size={14} />}</button></div></div><div className="mt-10 grid gap-8 lg:grid-cols-[1fr_.85fr]"><section><div className="flex items-end justify-between"><div><span className="eyebrow">Recent conversations</span><h2 className="mt-3 text-3xl tracking-[-.04em] text-[#493632]">Little moments</h2></div><span className="text-xs text-[#b76f69]">{stats.conversationsCompleted} total</span></div><div className="mt-5 divide-y divide-[#e2d4c8]">{(conversations ?? []).slice(0, 5).map((conversation) => <Link href="/talk" data-testid={`button-conversation-${conversation.id}`} key={conversation.id} className="flex w-full items-center justify-between py-5 text-left"><div><p className="eyebrow text-[#a18176]">{formatDate(conversation.updatedAt)}</p><p className="mt-2 text-base text-[#58423d]">{conversation.title}</p></div><span className="text-xs text-[#a18176]">{modeLabel(conversation.mode)}</span></Link>)}{!conversations?.length && <p className="py-5 text-sm text-[#9a8177]">Your conversations will appear here.</p>}</div></section><section className="rounded-[1.5rem] border border-[#decec1] p-6"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ebd9cd] text-[#b76f69]"><Lightbulb size={16} /></div><span className="eyebrow">A phrase to keep</span></div><p className="serif mt-8 text-3xl italic leading-tight text-[#533c37]">“I’ve been meaning to...”</p><p className="mt-4 text-sm leading-relaxed text-[#887068]">{vocabulary?.length ? `You’ve saved ${vocabulary.length} useful word${vocabulary.length === 1 ? "" : "s"} so far.` : "A natural way to introduce something that’s been on your mind."}</p><Link href="/talk" data-testid="button-practice-phrase" className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#b76f69]">Practice with Mia <ArrowUpRight size={14} /></Link></section></div></main></AppShell></div>;
}

function AppShell({ children }: { children: ReactNode }) {
  const { signOut } = useClerk();
  return <div className="flex min-h-[100dvh]"><aside className="hidden w-[220px] shrink-0 flex-col border-r border-[#dfd0c4] bg-[#f0e6db] px-6 py-7 md:flex"><Link href="/" data-testid="link-shell-logo" className="serif text-[2rem] tracking-[-.04em] text-[#3b2b28]">mia<span className="text-[#b76f69]">.</span></Link><nav className="mt-20 space-y-2"><ShellLink href="/talk" icon={<MessageCircle size={17} />} label="Talk" /><ShellLink href="/voice" icon={<Headphones size={17} />} label="Voice" /><ShellLink href="/progress" icon={<BarChart3 size={17} />} label="Progress" /></nav><div className="mt-auto"><div className="mb-6 h-px bg-[#ddcfc2]" /><ShellLink href="/" icon={<HomeIcon size={16} />} label="Home" /><button data-testid="button-sidebar-settings" onClick={() => signOut({ redirectUrl: basePath || "/" })} className="mt-4 flex w-full items-center gap-3 px-3 py-2 text-sm text-[#947a70]"><Settings2 size={16} /> Sign out</button></div></aside><div className="min-w-0 flex-1"><div className="flex items-center justify-between border-b border-[#dfd0c4] bg-[#f7f0e7] px-5 py-4 md:hidden"><Link href="/" data-testid="link-mobile-logo" className="serif text-3xl text-[#3b2b28]">mia<span className="text-[#b76f69]">.</span></Link><div className="flex items-center gap-3"><Link href="/progress" data-testid="link-mobile-progress" className="rounded-full p-2 text-[#8e7269]"><BarChart3 size={19} /></Link><Link href="/talk" data-testid="link-mobile-talk" className="rounded-full bg-[#b76f69] p-2 text-[#fff8f0]"><MessageCircle size={18} /></Link></div></div>{children}</div></div>;
}

function ShellLink({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return <Link href={href} data-testid={`link-shell-${label.toLowerCase()}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#806a61] transition-colors hover:bg-[#e8d9cc] hover:text-[#b76f69]">{icon}{label}</Link>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={HomeRedirect} /><Route path="/sign-in/*?" component={SignInPage} /><Route path="/sign-up/*?" component={SignUpPage} /><Route path="/talk"><Protected><Talk /></Protected></Route><Route path="/voice"><Protected><Voice /></Protected></Route><Route path="/progress"><Protected><Progress /></Protected></Route><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const previousUserId = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const currentUserId = user?.id ?? null;
      if (previousUserId.current !== undefined && previousUserId.current !== currentUserId) queryClient.clear();
      previousUserId.current = currentUserId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);
  return null;
}

function ClerkApp() {
  const [, setLocation] = useLocation();
  return <ClerkProvider publishableKey={clerkPubKey} proxyUrl={clerkProxyUrl} appearance={clerkAppearance} signInUrl={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} localization={{ signIn: { start: { title: "Welcome back", subtitle: "Your private English space is waiting." } }, signUp: { start: { title: "Create your Mia account", subtitle: "Start a gentler English habit." } } }} routerPush={(to) => setLocation(stripBase(to))} routerReplace={(to) => setLocation(stripBase(to))}><QueryClientProvider client={queryClient}><ClerkQueryClientCacheInvalidator /><Router /></QueryClientProvider></ClerkProvider>;
}

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
};

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  const browserWindow = window as Window & { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike };
  return browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition ?? null;
}

function speakText(text: string) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value));
}

function modeLabel(mode: string) {
  return mode.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function App() {
  if (!clerkPubKey) throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
  return <WouterRouter base={basePath}><ClerkApp /><Toaster /></WouterRouter>;
}

export default App;