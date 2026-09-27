import { type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { ArrowUpRight, BarChart3, Check, ChevronDown, Clock3, Headphones, Home as HomeIcon, Lightbulb, Menu, MessageCircle, Mic, MoreHorizontal, Pause, Play, Send, Settings2, X } from 'lucide-react';
import {
  Link,
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

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
            {[['01','Show up as you are','No prep, no red pen. Just open the door.'],['02','Find your natural rhythm','Mia gently keeps the conversation moving.'],['03','Leave with more confidence','Small moments add up to a voice that feels like yours.']].map(([n,t,d], i) => <div key={n} className="bg-[#f3e9dd] p-8 md:min-h-[280px] md:p-10"><span className="eyebrow text-[#b76f69]">{n}</span><div className="mt-20"><h3 className="text-xl font-medium tracking-[-.02em] text-[#463530]">{t}</h3><p className="mt-3 max-w-[220px] text-sm leading-relaxed text-[#806e65]">{d}</p></div></div>)}
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden bg-[#b97870] px-6 py-28 text-[#fff7ef] lg:px-16 lg:py-40">
        <div className="absolute -right-20 top-20 h-72 w-72 rounded-full border border-[#e7b9ae]/40" /><div className="absolute -right-4 top-36 h-72 w-72 rounded-full border border-[#e7b9ae]/25" />
        <div className="mx-auto max-w-[1200px]"><span className="eyebrow text-[#f2d3cb]">The promise</span><h2 className="mt-7 max-w-3xl text-[clamp(3.5rem,7vw,7.5rem)] leading-[.86] tracking-[-.065em]">No classrooms.<br /><span className="serif italic text-[#f6d2c7]">No pressure.</span><br />Just conversation.</h2><button data-testid="button-start-talking" onClick={() => setLocation('/talk')} className="press-button mt-12 flex items-center gap-4 rounded-full bg-[#f8e9df] px-7 py-4 font-semibold text-[#8f504d]">Start talking <ArrowUpRight size={17} /></button></div>
      </section>
      <footer className="flex flex-col justify-between gap-8 bg-[#f6f0e7] px-6 py-10 text-[#79675f] md:flex-row md:items-end lg:px-16"><div><div className="serif text-4xl text-[#3b2b28]">mia<span className="text-[#b76f69]">.</span></div><p className="mt-2 text-sm">Your English, becoming yours.</p></div><div className="flex gap-6 text-xs"><span>Made for real conversations</span><span>© 2024 Mia</span></div></footer>
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
  return <header className="relative z-40 flex items-center justify-between px-6 py-6 lg:px-16">
    <Link href="/" data-testid="link-home-logo" className="serif text-[2rem] leading-none tracking-[-.04em] text-[#3b2b28]">mia<span className="text-[#b76f69]">.</span></Link>
    <nav className={`${open ? 'flex' : 'hidden'} absolute left-6 right-6 top-[74px] flex-col gap-4 rounded-2xl bg-[#f8f0e7] p-5 shadow-[0_20px_40px_rgba(72,46,39,.1)] md:static md:flex md:flex-row md:items-center md:gap-8 md:bg-transparent md:p-0 md:shadow-none`}>
      <Link data-testid="link-talk-nav" href="/talk" onClick={() => setOpen(false)} className={`text-sm ${location === '/talk' ? 'font-semibold text-[#b76f69]' : 'text-[#79675f]'}`}>Talk</Link>
      <Link data-testid="link-progress-nav" href="/progress" onClick={() => setOpen(false)} className={`text-sm ${location === '/progress' ? 'font-semibold text-[#b76f69]' : 'text-[#79675f]'}`}>Progress</Link>
      <button data-testid="button-nav-mia" onClick={() => setLocation('/talk')} className="press-button rounded-full bg-[#3b2b28] px-5 py-2.5 text-xs font-semibold text-[#fff8f0]">Talk to Mia</button>
    </nav>
    <button data-testid="button-mobile-menu" onClick={() => setOpen(!open)} className="rounded-full p-2 text-[#5b4842] md:hidden">{open ? <X size={21} /> : <Menu size={21} />}</button>
  </header>;
}

type Message = { id: number; from: 'mia' | 'you'; text: string };
const seedMessages: Message[] = [{ id: 1, from: 'mia', text: 'Hey. I’m glad you’re here. What kind of day did you have?' }, { id: 2, from: 'you', text: 'It was a bit long, but I saw the most beautiful sunset on my way home.' }, { id: 3, from: 'mia', text: 'That sounds like a lovely way to end it. What did it look like?' }];

function Talk() {
  const [messages, setMessages] = useState(seedMessages);
  const [draft, setDraft] = useState('');
  const [listening, setListening] = useState(false);
  const [topic, setTopic] = useState('Everyday life');
  const [showTopics, setShowTopics] = useState(false);
  const send = () => { if (!draft.trim()) return; const text = draft.trim(); setMessages(m => [...m, { id: Date.now(), from: 'you', text }]); setDraft(''); window.setTimeout(() => setMessages(m => [...m, { id: Date.now() + 1, from: 'mia', text: text.toLowerCase().includes('sunset') ? 'I can almost see it. That’s a beautiful detail — keep going.' : 'I like hearing you tell it. Tell me a little more.' }]), 650); };
  return <div className="min-h-[100dvh] bg-[#f7f0e7] grain"><AppShell><div className="mx-auto max-w-[1180px] px-5 pb-10 pt-6 md:px-10">
    <div className="flex flex-col justify-between gap-5 border-b border-[#decec1] pb-7 md:flex-row md:items-end"><div><span className="eyebrow">Private conversation</span><h1 className="mt-3 text-4xl tracking-[-.05em] text-[#3b2b28] md:text-6xl">Good to see you<span className="serif italic text-[#b76f69]">.</span></h1></div><div className="flex items-center gap-2 text-sm text-[#79675f]"><span className="h-2 w-2 rounded-full bg-[#82a286] animate-pulse-soft" /> Mia is online</div></div>
    <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_310px]">
      <section className="min-h-[620px] rounded-[2rem] bg-[#f1e5d9] px-5 py-7 md:px-10"><div className="mb-10 flex items-center justify-between"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c58c82] text-sm font-semibold text-[#fff7ef]">M</div><div><p className="font-medium text-[#493632]">Mia</p><p className="eyebrow mt-1 text-[#9b7e73]">Listening</p></div></div><button data-testid="button-more-options" className="rounded-full p-2 text-[#856c63] hover:bg-[#e8d8cc]"><MoreHorizontal size={19} /></button></div>
        <div className="space-y-7">{messages.map(message => <div key={message.id} data-testid={`message-${message.id}`} className={`flex ${message.from === 'you' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[82%] ${message.from === 'you' ? 'rounded-[1.3rem] rounded-br-sm bg-[#c48b82] text-[#fff8f0]' : 'text-[#493632]'}`}><p className={`${message.from === 'you' ? 'px-5 py-3.5' : 'border-l-2 border-[#c48b82] pl-5'} text-[1.05rem] leading-relaxed`}>{message.text}</p><span className={`mt-2 block text-[.65rem] text-[#9b7e73] ${message.from === 'you' ? 'text-right' : ''}`}>{message.from === 'you' ? 'You · just now' : 'Mia · now'}</span></div></div>)}</div>
        <div className="mt-20"><div className="relative flex items-center gap-3 rounded-2xl bg-[#f8f1e9] p-2 pl-5 shadow-[0_8px_24px_rgba(100,70,60,.06)]"><input data-testid="input-message" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(); }} placeholder="Say whatever is on your mind..." className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#493632] outline-none placeholder:text-[#ae988c]" /><button data-testid="button-send-message" onClick={send} className="press-button flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#b76f69] text-[#fff8f0]"><Send size={16} /></button></div><div className="mt-3 flex justify-center"><button data-testid="button-microphone" onClick={() => setListening(!listening)} className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs ${listening ? 'bg-[#b76f69] text-[#fff8f0]' : 'text-[#92766c]'}`}>{listening ? <><span className="flex gap-0.5">{[1,2,3,4].map(i => <span key={i} className="h-3 w-0.5 origin-bottom animate-[wave_1s_ease-in-out_infinite] bg-current" style={{animationDelay: `${i * .12}s`}} />)}</span> Listening...</> : <><Mic size={14} /> Speak instead</>}</button></div></div>
      </section>
      <aside className="space-y-4"><div className="relative rounded-[1.5rem] bg-[#e7d3c7] p-6"><span className="eyebrow text-[#a16c65]">A little direction</span><h2 className="serif mt-3 text-3xl italic leading-tight text-[#573e39]">What’s on your mind?</h2><button data-testid="button-topic-selector" onClick={() => setShowTopics(!showTopics)} className="mt-5 flex w-full items-center justify-between border-b border-[#cba79b] pb-3 text-left text-sm text-[#70554d]">{topic}<ChevronDown size={15} /></button>{showTopics && <div className="absolute left-6 right-6 top-[147px] z-10 rounded-xl bg-[#fbf5ee] p-2 shadow-lg">{['Everyday life','A place you love','Something you learned'].map(t => <button data-testid={`button-topic-${t.replaceAll(' ', '-').toLowerCase()}`} key={t} onClick={() => { setTopic(t); setShowTopics(false); }} className="block w-full rounded-lg px-3 py-2 text-left text-xs text-[#70554d] hover:bg-[#efe1d5]">{t}</button>)}</div>}</div>
        <div className="rounded-[1.5rem] bg-[#3b2b28] p-6 text-[#f9eee4]"><span className="eyebrow text-[#c79c91]">Your gentle nudge</span><p className="mt-4 text-sm leading-relaxed text-[#ead5c9]">Try using a detail that begins with <span className="font-semibold text-[#f8cfc2]">“I remember...”</span></p><button data-testid="button-new-prompt" onClick={() => setDraft('I remember...')} className="mt-5 flex items-center gap-2 text-xs text-[#f8cfc2]">Use this prompt <ArrowUpRight size={14} /></button></div>
        <div className="flex items-center gap-3 rounded-[1.5rem] border border-[#decec1] p-5"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ead8cb] text-[#b76f69]"><Clock3 size={16} /></div><div><p className="text-sm font-medium text-[#5c4640]">A quiet 8 minutes</p><p className="mt-1 text-xs text-[#9a8177]">That’s all it takes today.</p></div></div>
      </aside>
    </div>
  </div></AppShell></div>;
}

function Voice() {
  const [active, setActive] = useState(false); const [paused, setPaused] = useState(false);
  return <div className="min-h-[100dvh] bg-[#eee2d5] grain"><AppShell><main className="mx-auto flex max-w-[1000px] flex-col items-center px-6 pb-12 pt-10 text-center"><span className="eyebrow">Voice room / 04</span><h1 className="mt-8 text-5xl tracking-[-.06em] text-[#493632] md:text-7xl">Let’s talk it out<span className="serif italic text-[#b76f69]">.</span></h1><p className="mt-5 max-w-md text-[#806d64]">No need to look at the screen. Just listen, think, and speak naturally.</p><div className="relative my-14 flex h-[310px] w-[310px] items-center justify-center rounded-full border border-[#cfaca0] md:h-[390px] md:w-[390px]"><div className={`absolute inset-7 rounded-full border border-[#c58c82]/50 ${active && !paused ? 'animate-pulse-soft' : ''}`} /><div className={`absolute inset-16 rounded-full bg-[#dfb9ad] ${active && !paused ? 'animate-pulse-soft' : ''}`} /><div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[#b76f69] text-[#fff5ed] shadow-[0_12px_30px_rgba(145,82,76,.2)] md:h-40 md:w-40"><span className="serif text-7xl italic">M</span></div><div className="absolute -bottom-7 rounded-full bg-[#f7eee5] px-4 py-2 text-xs text-[#8f7168]">{active ? paused ? 'Paused for you' : 'Mia is listening' : 'Tap to begin'}</div></div><div className="flex items-center gap-4"><button data-testid="button-voice-toggle" onClick={() => setActive(!active)} className="press-button flex h-16 w-16 items-center justify-center rounded-full bg-[#b76f69] text-[#fff8f0]">{active ? <Pause size={21} /> : <Mic size={22} />}</button>{active && <button data-testid="button-voice-pause" onClick={() => setPaused(!paused)} className="press-button flex h-12 w-12 items-center justify-center rounded-full border border-[#cfa99e] text-[#8d6d64]">{paused ? <Play size={17} /> : <Pause size={17} />}</button>}</div><p className="mt-8 text-xs text-[#a1877c]">{active ? paused ? 'Take your time. Mia will be here.' : 'Say something about your day.' : 'A private space for your voice'}</p></main></AppShell></div>;
}

function Progress() {
  const [dismissed, setDismissed] = useState(false);
  return <div className="min-h-[100dvh] bg-[#f7f0e7] grain"><AppShell><main className="mx-auto max-w-[1180px] px-5 pb-16 pt-6 md:px-10"><div className="border-b border-[#decec1] pb-8"><span className="eyebrow">Your space</span><h1 className="mt-3 text-5xl tracking-[-.06em] text-[#3b2b28] md:text-7xl">Your English,<br /><span className="serif italic text-[#b76f69]">becoming yours.</span></h1><p className="mt-5 max-w-md text-[#806d64]">A quiet record of showing up, finding your words, and sounding more like yourself.</p></div><div className="mt-8 grid gap-5 md:grid-cols-[1.1fr_.9fr]"><div className="rounded-[1.8rem] bg-[#e9d7cb] p-7 md:p-9"><div className="flex items-start justify-between"><div><span className="eyebrow text-[#a66b65]">This month</span><p className="mt-4 text-6xl tracking-[-.07em] text-[#4d3732]">7<span className="serif text-4xl italic text-[#b76f69]">h</span> 24<span className="serif text-4xl italic text-[#b76f69]">m</span></p><p className="mt-2 text-sm text-[#80655d]">in conversation with Mia</p></div><div className="rounded-full bg-[#f4e8de] p-3 text-[#b76f69]"><BarChart3 size={19} /></div></div><div className="mt-12 flex h-28 items-end gap-2">{[33,45,28,63,52,76,58,88,68,95,79,87].map((h,i) => <div key={i} className="flex-1 rounded-t-full bg-[#c58c82]/70" style={{height:`${h}%`}} />)}</div><div className="mt-3 flex justify-between text-[.65rem] text-[#a17b70]"><span>May 01</span><span>May 30</span></div></div><div className="rounded-[1.8rem] bg-[#3b2b28] p-7 text-[#f7ebe1] md:p-9"><span className="eyebrow text-[#cda198]">A pattern we notice</span><h2 className="serif mt-5 text-4xl italic leading-none text-[#f6d1c5]">You’re telling longer stories.</h2><p className="mt-5 text-sm leading-relaxed text-[#ddc6ba]">You’ve been adding more detail lately. That’s the kind of progress that doesn’t fit in a score.</p><button data-testid="button-view-pattern" onClick={() => setDismissed(!dismissed)} className="mt-8 flex items-center gap-2 text-xs text-[#f4c4b8]">{dismissed ? 'Noted' : 'Keep this in mind'} {dismissed ? <Check size={14} /> : <ArrowUpRight size={14} />}</button></div></div><div className="mt-10 grid gap-8 lg:grid-cols-[1fr_.85fr]"><section><div className="flex items-end justify-between"><div><span className="eyebrow">Recent conversations</span><h2 className="mt-3 text-3xl tracking-[-.04em] text-[#493632]">Little moments</h2></div><button data-testid="button-see-all-history" className="text-xs text-[#b76f69] underline underline-offset-4">See all</button></div><div className="mt-5 divide-y divide-[#e2d4c8]">{[['Sunday evening','The shape of a good day','12 min'],['A rainy Tuesday','Things we notice on walks','8 min'],['Saturday morning','Making plans for summer','16 min']].map(([d,t,l],i) => <button data-testid={`button-conversation-${i}`} key={d} onClick={() => {}} className="flex w-full items-center justify-between py-5 text-left"><div><p className="eyebrow text-[#a18176]">{d}</p><p className="mt-2 text-base text-[#58423d]">{t}</p></div><span className="text-xs text-[#a18176]">{l}</span></button>)}</div></section><section className="rounded-[1.5rem] border border-[#decec1] p-6"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ebd9cd] text-[#b76f69]"><Lightbulb size={16} /></div><span className="eyebrow">A phrase to keep</span></div><p className="serif mt-8 text-3xl italic leading-tight text-[#533c37]">“I’ve been meaning to...”</p><p className="mt-4 text-sm leading-relaxed text-[#887068]">A natural way to introduce something that’s been on your mind.</p><button data-testid="button-practice-phrase" onClick={() => {}} className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#b76f69]">Practice with Mia <ArrowUpRight size={14} /></button></section></div></main></AppShell></div>;
}

function AppShell({ children }: { children: ReactNode }) {
  return <div className="flex min-h-[100dvh]"><aside className="hidden w-[220px] shrink-0 flex-col border-r border-[#dfd0c4] bg-[#f0e6db] px-6 py-7 md:flex"><Link href="/" data-testid="link-shell-logo" className="serif text-[2rem] tracking-[-.04em] text-[#3b2b28]">mia<span className="text-[#b76f69]">.</span></Link><nav className="mt-20 space-y-2"><ShellLink href="/talk" icon={<MessageCircle size={17} />} label="Talk" /><ShellLink href="/voice" icon={<Headphones size={17} />} label="Voice" /><ShellLink href="/progress" icon={<BarChart3 size={17} />} label="Progress" /></nav><div className="mt-auto"><div className="mb-6 h-px bg-[#ddcfc2]" /><ShellLink href="/" icon={<HomeIcon size={16} />} label="Home" /><button data-testid="button-sidebar-settings" className="mt-4 flex w-full items-center gap-3 px-3 py-2 text-sm text-[#947a70]"><Settings2 size={16} /> Settings</button></div></aside><div className="min-w-0 flex-1"><div className="flex items-center justify-between border-b border-[#dfd0c4] bg-[#f7f0e7] px-5 py-4 md:hidden"><Link href="/" data-testid="link-mobile-logo" className="serif text-3xl text-[#3b2b28]">mia<span className="text-[#b76f69]">.</span></Link><div className="flex items-center gap-3"><Link href="/progress" data-testid="link-mobile-progress" className="rounded-full p-2 text-[#8e7269]"><BarChart3 size={19} /></Link><Link href="/talk" data-testid="link-mobile-talk" className="rounded-full bg-[#b76f69] p-2 text-[#fff8f0]"><MessageCircle size={18} /></Link></div></div>{children}</div></div>;
}

function ShellLink({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return <Link href={href} data-testid={`link-shell-${label.toLowerCase()}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#806a61] transition-colors hover:bg-[#e8d9cc] hover:text-[#b76f69]">{icon}{label}</Link>;
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/talk" component={Talk} />
        <Route path="/voice" component={Voice} />
        <Route path="/progress" component={Progress} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
