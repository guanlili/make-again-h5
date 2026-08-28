'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Scene = 'login' | 'envelope' | 'letter' | 'voice' | 'chat' | 'report' | 'home' | 'call';
type OrbState = 'idle' | 'recording' | 'sending' | 'thinking' | 'speaking';

const scenes: { key: Scene; no: string; title: string; caption: string }[] = [
  { key: 'login', no: '001', title: '登录与授权', caption: '一段温柔关系的开始' },
  { key: 'envelope', no: '002', title: '主创来信', caption: '打开信封，理解我们为何在这里' },
  { key: 'voice', no: '003', title: 'Voice 对话', caption: '长按说话，让回应完整抵达' },
  { key: 'chat', no: '004', title: '深度陪伴', caption: '把没有说完的话慢慢说完' },
  { key: 'report', no: '005', title: '陪伴看板', caption: '翻开一块收藏回忆的真实木板' },
  { key: 'home', no: '006', title: '今日陪伴', caption: '每一天都不必急着变好' },
  { key: 'call', no: '007', title: '模拟来电', caption: '在安全的练习里，再听一次声音' },
];

const founderParagraphs = [
  '高中时期，我谈过一段非常内耗的恋爱。年少的互动很纯粹，我也慢慢动心，不顾身边所有人的反对，和他走到了一起。',
  '他曾郑重承诺会收心努力，和我奔赴同一个未来。但长久相处下来，承诺反复落空，我一次次期待、一次次失望，耗尽了所有热情。',
  '在我慢慢走出情伤、试着和遗憾和解的那一年，我遭遇了人生第一次重大离别——我的姥姥骤然离世。',
  '那段时间，巨大的悲伤将我击溃。无数个深夜，我独自消化思念和遗憾。我第一次明白，亲人的离别不是瞬间的痛哭，而是往后漫长日子里反复想起、反复遗憾的自我拉扯。',
  '所幸身边有人温柔陪伴、耐心倾听，慢慢引导我接纳失去，让我学会带着思念好好生活。',
  '因为自己淋过雨，所以我想为所有困在离别里的人撑一把伞，打造一款专门应对离别与遗憾的 AI 陪伴产品。',
  '我们想做的，从来不是快速抹平你的难过，而是给你一个绝对安全、永远包容的情绪角落，让每一份遗憾都有归处，每一段离别都能被温柔安放。',
];

function StatusBar() {
  return <div className="status-bar"><b>9:41</b><span><i className="cell" /><i className="wifi" /><i className="battery" /></span></div>;
}

function WechatMark() {
  return <span className="wechat-mark" aria-hidden="true"><i /><i /></span>;
}

function VoiceOrb({ state = 'idle', small = false }: { state?: OrbState; small?: boolean }) {
  return <span className={`voice-orb-visual ${small ? 'small' : ''}`} data-orb-state={state} aria-hidden="true"><i className="orb-halo" /><i className="orb-ring ring-a" /><i className="orb-ring ring-b" /><i className="orb-ring ring-c" /><i className="orb-core"><b /><b /><b /><em /></i><i className="orb-sheen" /></span>;
}

export default function Home() {
  const [scene, setScene] = useState<Scene>('login');
  const [authOpen, setAuthOpen] = useState(false);
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [textMode, setTextMode] = useState(false);
  const [message, setMessage] = useState('我最近总在夜里想起它…');
  const [chatSent, setChatSent] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [boardFlipped, setBoardFlipped] = useState(false);
  const touchStart = useRef(0);
  const timers = useRef<number[]>([]);

  const current = useMemo(() => scenes.find((item) => item.key === scene) ?? scenes[0], [scene]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);
  const clearOrbTimers = () => { timers.current.forEach(window.clearTimeout); timers.current = []; };
  const beginRecording = () => { if (textMode || orbState !== 'idle') return; clearOrbTimers(); setOrbState('recording'); };
  const sendRecording = () => {
    if (orbState !== 'recording') return;
    setOrbState('sending');
    timers.current.push(window.setTimeout(() => setOrbState('thinking'), 900));
    timers.current.push(window.setTimeout(() => setOrbState('speaking'), 2250));
    timers.current.push(window.setTimeout(() => setOrbState('idle'), 6500));
  };

  return (
    <main className="experience-shell">
      <aside className="review-panel">
        <div className="review-brand"><span>M</span><div><b>Make Again</b><small>交互原型 · 001—007</small></div></div>
        <p className="review-intro">陪你慢慢，和遗憾和解。<br />以一封信开始，让每段难过都有归处。</p>
        <nav aria-label="原型页面">
          {scenes.map((item) => <button key={item.key} className={current.key === item.key || (item.key === 'envelope' && scene === 'letter') ? 'active' : ''} onClick={() => { setScene(item.key); setAuthOpen(false); setOrbState('idle'); }}><span>{item.no}</span><div><b>{item.title}</b><small>{item.caption}</small></div><i>→</i></button>)}
        </nav>
        <div className="review-foot"><span>ATMOSPHERE UI</span><b>{current.no}</b></div>
      </aside>

      <section className="phone-stage">
        <div className="ambient ambient-one" /><div className="ambient ambient-two" />
        <div className="phone" data-scene={scene}>
          <div className="speaker-island" />

          {scene === 'login' && <section className="phone-screen login-scene"><StatusBar /><div className="login-photo" /><div className="login-shade" /><div className="login-lockup"><h1>Make Again</h1><p>陪你慢慢，和遗憾和解</p></div><button className="wechat-login" onClick={() => setAuthOpen(true)}><WechatMark />微信一键登录</button><small className="legal">登录即代表同意《用户协议》与《隐私政策》</small>{authOpen && <div className="auth-layer" role="dialog" aria-modal="true" aria-labelledby="auth-title"><div className="auth-card"><div className="auth-symbol">M</div><h2 id="auth-title">微信授权登录</h2><p>允许 Make Again 使用你的微信公开信息，为你保存这段温柔的陪伴。</p><div><button onClick={() => setAuthOpen(false)}>暂不登录</button><button onClick={() => { setAuthOpen(false); setScene('envelope'); }}>允许</button></div></div></div>}</section>}

          {scene === 'envelope' && <section className="phone-screen envelope-scene"><StatusBar /><div className="aurora aurora-one" /><div className="aurora aurora-two" /><div className="envelope-heading"><span>002 · A LETTER FOR YOU</span><h2>在正式开始前，<br />想先给你一封信</h2></div><button className="envelope" onClick={() => setScene('letter')} aria-label="打开 Wakey 写给你的信"><i className="envelope-shadow" /><i className="envelope-letter">Wakey<br />给你的一封信</i><i className="envelope-pocket" /><i className="envelope-flap" /><b>M</b></button><p className="envelope-hint">轻触信封，打开这封信</p></section>}

          {scene === 'letter' && <section className="phone-screen letter-scene"><StatusBar /><div className="letter-scroll"><article className="letter-paper"><div className="paper-ornament"><i /><span>M</span><i /></div><div className="letter-copy"><p className="opening">在正式使用之前，Wakey 想跟你分享两段自己的故事：</p>{founderParagraphs.map((text) => <p key={text}>{text}</p>)}<footer><span>—</span><b>Make Again 主创团队</b><time>2026 年 8 月 28 日</time></footer><button onClick={() => setScene('home')}>进入主页 <span>→</span></button></div></article></div></section>}

          {scene === 'voice' && <section className="phone-screen voice-scene" data-input-mode={textMode ? 'text' : 'voice'} data-orb-state={orbState}><StatusBar /><header className="voice-heading"><p>Wakey · 陪你慢慢说</p><h2>最近，是什么让你有些放不下</h2><div><i /><span>✦</span><i /></div></header><div className="voice-stage">{orbState === 'speaking' && <div className="voice-answer"><small>Wakey · 回应已抵达</small><p><span>我听见了。</span><span>焦虑不用立刻被解决，你可以先慢慢告诉我，最近是哪一刻最难受。</span></p><em>整段回答已到达</em></div>}</div><div className="voice-composer">{textMode && <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="输入你想问的…" aria-label="输入你想问的" />}<button className="orb-button" onPointerDown={beginRecording} onPointerUp={sendRecording} onPointerCancel={() => setOrbState('idle')} onClick={() => textMode && setTextMode(false)} aria-label="长按开始录音，松开发送"><VoiceOrb state={orbState} small={textMode} /></button>{!textMode && <button className="text-mode" onClick={() => { clearOrbTimers(); setOrbState('idle'); setTextMode(true); }} aria-label="切换文字输入">×</button>}</div><p className="voice-hint">{textMode ? '文字 · 输入你想问的…' : orbState === 'recording' ? '正在聆听 · 松开发送' : orbState === 'sending' ? '正在送出你的声音…' : orbState === 'thinking' ? 'Wakey 正在认真听懂你…' : orbState === 'speaking' ? 'Wakey 正在回应你' : 'Voice · 长按球体录音，松开发送'}</p><button className="continue-link" onClick={() => setScene('chat')}>继续体验深度陪伴　→</button></section>}

          {scene === 'chat' && (
            <section className="phone-screen chat-scene mirror-chat" onTouchStart={(event) => { touchStart.current = event.touches[0].clientY; }} onTouchEnd={(event) => { if (touchStart.current - event.changedTouches[0].clientY > 48) setHistoryOpen(true); }}>
              <StatusBar />
              <header className="simple-header"><button onClick={() => setScene('home')}>‹</button><div><small>Wakey · 魔镜对话</small><h2>把这一刻慢慢说出来</h2></div><button onClick={() => setHistoryOpen(true)}>⌃</button></header>
              <div className="mirror-stage">
                <div className="mirror-aura"><VoiceOrb state={chatSent ? 'speaking' : 'idle'} /></div>
                <article className="mirror-reply"><small>Wakey · 此刻的回应</small><p>{chatSent ? '我在。先不用急着解决它。此刻，是胸口更紧，还是脑子停不下来？' : '今天想聊聊什么呢？不需要组织好语言，你想到哪里，就说到哪里。'}</p></article>
                <p className="swipe-hint">↑ 上滑查看对话历史</p>
                {chatSent && <button className="report-preview" onClick={() => setScene('report')}><span>本月陪伴报告已生成</span><strong>我听见的你</strong><p>你不是放不下，只是这份爱还没有地方安放。</p><i>点击展开　→</i></button>}
              </div>
              <div className="chat-composer"><input value={message} onChange={(event) => setMessage(event.target.value)} aria-label="聊天输入" /><button onClick={() => setChatSent(true)} aria-label="发送消息"><VoiceOrb small /></button></div>
              {historyOpen && <div className="history-sheet"><button onClick={() => setHistoryOpen(false)}>×</button><span>对话历史</span><article><small>Wakey</small><p>今天想聊聊什么呢？</p></article><article className="mine"><small>我</small><p>{message}</p></article>{chatSent && <article><small>Wakey</small><p>我在。先不用急着解决它。</p></article>}<i>下滑或点击关闭，回到当前回应</i></div>}
            </section>
          )}

          {scene === 'report' && (
            <section className="phone-screen report-scene board-scene">
              <StatusBar />
              <header className="simple-header board-header"><button onClick={() => setScene('home')}>×</button><div><small>MEMORY BOARD</small><h2>你的陪伴看板</h2></div><button onClick={() => { setSavedToast(true); window.setTimeout(() => setSavedToast(false), 1800); }}>⇩</button></header>
              <div className={`board-flipper ${boardFlipped ? 'is-flipped' : ''}`}>
                <button className="board-face cork-board" onClick={() => setBoardFlipped(true)} aria-label="翻开陪伴看板查看报告">
                  <span className="wood-grain wood-top" /><span className="wood-grain wood-left" /><span className="wood-grain wood-right" /><span className="wood-grain wood-bottom" />
                  <div className="board-title"><small>Wakey 为你整理</small><strong>被好好记住的那些事</strong></div>
                  <article className="pinned-photo"><i className="pin red" /><div className="memory-photo"><span>♥</span><em /></div><p>毛球 · 陪伴你的第十二年</p></article>
                  <article className="sticky-note"><i className="pin yellow" /><p>“它每天都会<br />在门口等我。”</p><small>一段重要的回忆</small></article>
                  <article className="memory-ticket"><i className="pin blue" /><small>MEMORY · 08/28</small><strong>床边的小黄鸭</strong><p>你说，那是它最喜欢的玩具。</p></article>
                  <article className="thread-card"><i className="pin red" /><span>允许悲伤</span><b>01</b></article>
                  <i className="memory-thread thread-one" /><i className="memory-thread thread-two" />
                  <div className="board-flip-hint"><span>↻</span><p><b>轻触木板翻开报告</b><small>背面保存着 Wakey 对你的理解</small></p></div>
                </button>
                <section className="board-face report-back">
                  <div className="report-back-scroll">
                    <button className="flip-back" onClick={() => setBoardFlipped(false)}>↶　翻回看板</button>
                    <article className="report-hero"><small>你的陪伴报告</small><h3>你不是放不下，<br />只是这份爱还没有地方安放。</h3><p>我听到，毛球不只是宠物，它是陪你十二年的家人。它每天在门口摇着尾巴等你，会把头轻轻搁在你腿上，晚上就睡在床边，让你一伸手就能摸到。</p><p>它走得突然，你没能见到最后一面，这件事一直压在心头。你不想忘记它，只想把这些回忆好好收着，慢慢习惯没有它的日子。</p><div className="report-orbit"><VoiceOrb small /></div></article>
                    <article className="report-plan"><header><small>Wakey 为你准备</small><h3>你的疗愈计划</h3></header><div><span>01</span><p><b>允许悲伤，说出内疚</b><small>把“对不起”和“我舍不得你”说出来。</small></p></div><div><span>02</span><p><b>为毛球做一个纪念空间</b><small>把项圈、照片和小黄鸭好好收在一起。</small></p></div><div><span>03</span><p><b>陪伴夜晚的孤独</b><small>让思念有一个安全的地方被安放。</small></p></div></article>
                    <blockquote>“爱从不会因告别消失，<br />它只是换一种方式继续陪伴你。”</blockquote>
                    <div className="dashboard-actions"><button onClick={() => setBoardFlipped(false)}>返回木板</button><button onClick={() => { setSavedToast(true); window.setTimeout(() => setSavedToast(false), 1800); }}>保存卡片报告　⇩</button></div>
                  </div>
                </section>
              </div>
              {savedToast && <div className="saved-toast">✓　陪伴报告已保存</div>}
            </section>
          )}

          {scene === 'home' && (
            <section className="phone-screen home-scene">
              <StatusBar />
              <header className="home-header"><button className="function-trigger" onClick={() => setMenuOpen(!menuOpen)}>☰</button><div className="home-avatar"><VoiceOrb small /></div><div><small>Hi，林屿。</small><h2>今晚也不用急着变好</h2></div></header>
              {menuOpen && <nav className="function-menu"><button onClick={() => { setMenuOpen(false); setScene('home'); }}>⌂<span>今日陪伴</span></button><button onClick={() => { setMenuOpen(false); setScene('report'); }}>▥<span>陪伴看板</span></button><button onClick={() => { setMenuOpen(false); setScene('letter'); }}>✉<span>主创来信</span></button><button onClick={() => setMenuOpen(false)}>⚙<span>账户与设置</span></button></nav>}
              <div className="home-scroll">
                <section className="home-mood-calendar"><header><div><small>AI 心情日历</small><strong>8 月 22 日—28 日</strong></div><button>查看整月　›</button></header><div className="calendar-week">{['五 22','六 23','日 24','一 25','二 26','三 27','四 28'].map((item, index) => <i key={item} className={index === 6 ? 'today' : index === 1 || index === 4 ? 'warm' : index === 2 ? 'low' : ''}><span>{item.split(' ')[0]}</span><b>{item.split(' ')[1]}</b><em /></i>)}</div><footer><div className="mood-signal"><i /><i /><i /></div><p><small>Wakey 的观察 · {chatSent ? '刚刚更新' : '等待了解'}</small><strong>{chatSent ? '平静里，藏着一点想念' : '完成一次对话后自动生成心情评价'}</strong></p><span>{chatSent ? '温柔' : '—'}</span></footer></section>
                <section className="daily-card"><small>8 月 28 日 · 今日陪伴</small><p>不是所有情绪<br />都要立刻被理解。<br />允许自己慢下来，<br />你依然值得被温柔以待。</p><div className="mini-orb"><VoiceOrb /></div></section>
                <section className="talk-card"><small>想聊点什么？</small><h3>把此刻最真实的感受<br />交给我就好</h3><div className="talk-topics"><button onClick={() => setScene('chat')}>✦　自己的生活</button><button onClick={() => setScene('chat')}>♡　情感与关系</button></div><button className="talk-voice" onClick={() => setScene('voice')}><VoiceOrb small /><span><b>按住说话</b><small>松开后自动发送</small></span></button></section>
              </div>
            </section>
          )}

          {scene === 'call' && <section className={`phone-screen call-scene ${callAccepted ? 'accepted' : ''}`}><StatusBar />{!callAccepted ? <><div className="caller"><VoiceOrb /><h2>Make Again</h2><p>手机</p></div><div className="call-tools"><button><span>◷</span>提醒我</button><button><span>▤</span>信息</button></div><div className="call-actions"><button className="decline" onClick={() => setScene('home')}><span>⌕</span>拒绝</button><button className="accept" onClick={() => setCallAccepted(true)}><span>⌕</span>接听</button></div></> : <><div className="active-caller"><h2>Make Again</h2><p>00:12</p></div><div className="active-call-grid">{['静音','键盘','免提','添加通话','FaceTime','通讯录'].map((item) => <button key={item}><span>{item === '免提' ? '◖' : '○'}</span>{item}</button>)}</div><button className="end-call" onClick={() => { setCallAccepted(false); setScene('home'); }}><span>⌕</span></button><small className="call-caption">慢慢说，我在听</small></>}</section>}
        </div>
      </section>
      <div className="scene-indicator"><span>{current.no}</span><i /><p>{current.title}</p></div>
    </main>
  );
}
