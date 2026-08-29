'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Scene = 'login' | 'envelope' | 'letter' | 'voice' | 'chat' | 'report' | 'home' | 'call' | 'settings' | 'history';
type OrbState = 'idle' | 'recording' | 'sending' | 'thinking' | 'speaking';

const scenes: { key: Scene; no: string; title: string; caption: string }[] = [
  { key: 'login', no: '001', title: '登录与授权', caption: '一段温柔关系的开始' },
  { key: 'envelope', no: '002', title: '主创来信', caption: '打开信封，理解我们为何在这里' },
  { key: 'voice', no: '003', title: 'Voice 对话', caption: '长按说话，让回应完整抵达' },
  { key: 'chat', no: '004', title: '深度陪伴', caption: '把没有说完的话慢慢说完' },
  { key: 'report', no: '005', title: '陪伴看板', caption: '翻开一块收藏回忆的真实木板' },
  { key: 'home', no: '006', title: '今日陪伴', caption: '每一天都不必急着变好' },
  { key: 'call', no: '007', title: '模拟来电', caption: '在安全的练习里，再听一次声音' },
  { key: 'settings', no: '008', title: '账户与设置', caption: '管理账号、提醒与隐私' },
  { key: 'history', no: '009', title: '对话历史', caption: '按时间重新翻阅被听见的片段' },
];

const historyGroups = [
  { label: '今天 21:06', messages: [
    { id: 'today-wakey', from: 'wakey', text: '晚上好，林屿。今天有没有哪个瞬间，让你又想起毛球了？' },
    { id: 'today-user', from: 'user', text: '回家开门的时候，下意识还在等它跑过来。屋子很安静，我突然特别想它。' },
  ] },
  { label: '昨天 23:48', messages: [
    { id: 'yesterday-wakey', from: 'wakey', text: '我听见了。你想念的不只是它跑向你的样子，也是那种“无论多晚回家，都有人在等你”的安心。\n\n这种习惯突然消失，安静才会显得格外大。你不需要逼自己马上适应。今晚可以先把那一刻留在这里：门打开了，毛球还是像以前一样，摇着尾巴向你跑来。' },
    { id: 'yesterday-user', from: 'user', text: '谢谢你。我想先把这段话收好，等难受的时候再回来看看。' },
  ] },
];

const settingsItems = [
  { icon: '♙', title: '账号与安全', detail: '微信绑定、登录方式与账号管理' },
  { icon: '◔', title: '消息通知管理', detail: '陪伴提醒与重要消息' },
  { icon: '♡', title: '推荐偏好', detail: '调整 Wakey 更懂你的方式' },
  { icon: '◉', title: '隐私管理', detail: '记忆、对话与数据使用范围' },
  { icon: '⊘', title: '黑名单与举报', detail: '管理屏蔽内容与安全反馈' },
  { icon: 'M', title: '关于 Make Again', detail: '产品理念、协议与版本信息' },
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
  const [toastMessage, setToastMessage] = useState('');
  const [boardFlipped, setBoardFlipped] = useState(false);
  const [historyManage, setHistoryManage] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<string[]>([]);
  const [hiddenHistory, setHiddenHistory] = useState<string[]>([]);
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
  const showToast = (text: string) => {
    setToastMessage(text);
    timers.current.push(window.setTimeout(() => setToastMessage(''), 1800));
  };
  const toggleHistoryItem = (id: string) => setSelectedHistory((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleHistoryDay = (ids: string[]) => setSelectedHistory((current) => ids.every((id) => current.includes(id)) ? current.filter((id) => !ids.includes(id)) : Array.from(new Set([...current, ...ids])));
  const deleteSelectedHistory = () => {
    if (!selectedHistory.length) return;
    setHiddenHistory((current) => Array.from(new Set([...current, ...selectedHistory])));
    setSelectedHistory([]);
    showToast('已删除选中的对话片段');
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
              <header className="simple-header board-header"><button onClick={() => setScene('home')}>×</button><div><small>MEMORY BOARD</small><h2>你的陪伴看板</h2></div><button onClick={() => showToast('陪伴报告已保存')}>⇩</button></header>
              <div className={`board-flipper ${boardFlipped ? 'is-flipped' : ''}`}>
                <section className="board-face board-gallery-front">
                  <div className="board-gallery-scroll">
                    <button className="hanging-board annual-board" onClick={() => setBoardFlipped(true)} aria-label="翻开年度报告木板">
                      <span className="board-hook" /><span className="board-rope rope-left" /><span className="board-rope rope-right" />
                      <span className="board-label"><small>01</small><b>年度报告</b></span>
                      <span className="gallery-wood-frame" />
                      <span className="gallery-cork">
                        <article className="annual-note note-one"><i className="pin red" /><small>2026 · AUG</small><strong>我听见的你</strong><p>平静里，藏着一点想念。</p></article>
                        <article className="annual-note note-two"><i className="pin blue" /><small>陪伴记录</small><strong>12 次</strong><p>真诚对话被好好收藏</p></article>
                        <i className="gallery-thread" />
                        <em className="board-open-hint">轻触翻开年度报告　↻</em>
                      </span>
                    </button>
                    <section className="hanging-board keepsake-board" aria-label="信件与物品木板">
                      <span className="board-hook" /><span className="board-rope rope-left" /><span className="board-rope rope-right" />
                      <span className="board-label"><small>02</small><b>信件 &amp; 物品</b></span>
                      <span className="gallery-wood-frame" />
                      <span className="gallery-cork keepsake-cork">
                        <article className="keepsake-envelope"><i className="pin yellow" /><span /><small>写给毛球的一封信</small></article>
                        <article className="keepsake-photo"><i className="pin red" /><div>♥</div><small>陪伴你的第十二年</small></article>
                        <article className="keepsake-object"><i className="pin blue" /><span>◒</span><p><b>床边的小黄鸭</b><small>它最喜欢的玩具</small></p></article>
                      </span>
                    </section>
                    <button className="add-memory-button" onClick={() => showToast('已为 TA 留下新的位置')}><span>＋</span><p><b>添加更多有关 TA 的物品</b><small>照片、信件或一件舍不得丢掉的小东西</small></p></button>
                  </div>
                </section>
                <section className="board-face report-back">
                  <div className="report-back-scroll">
                    <button className="flip-back" onClick={() => setBoardFlipped(false)}>↶　翻回看板</button>
                    <article className="report-hero"><small>你的陪伴报告</small><h3>你不是放不下，<br />只是这份爱还没有地方安放。</h3><p>我听到，毛球不只是宠物，它是陪你十二年的家人。它每天在门口摇着尾巴等你，会把头轻轻搁在你腿上，晚上就睡在床边，让你一伸手就能摸到。</p><p>它走得突然，你没能见到最后一面，这件事一直压在心头。你不想忘记它，只想把这些回忆好好收着，慢慢习惯没有它的日子。</p><div className="report-orbit"><VoiceOrb small /></div></article>
                    <article className="report-plan"><header><small>Wakey 为你准备</small><h3>你的疗愈计划</h3></header><div><span>01</span><p><b>允许悲伤，说出内疚</b><small>把“对不起”和“我舍不得你”说出来。</small></p></div><div><span>02</span><p><b>为毛球做一个纪念空间</b><small>把项圈、照片和小黄鸭好好收在一起。</small></p></div><div><span>03</span><p><b>陪伴夜晚的孤独</b><small>让思念有一个安全的地方被安放。</small></p></div></article>
                    <blockquote>“爱从不会因告别消失，<br />它只是换一种方式继续陪伴你。”</blockquote>
                    <div className="dashboard-actions"><button onClick={() => setBoardFlipped(false)}>返回木板</button><button onClick={() => showToast('陪伴报告已保存')}>保存卡片报告　⇩</button></div>
                  </div>
                </section>
              </div>
            </section>
          )}

          {scene === 'home' && (
            <section className="phone-screen home-scene">
              <StatusBar />
              <header className="home-header"><button className="function-trigger" onClick={() => setMenuOpen(!menuOpen)}>☰</button><div className="home-avatar"><VoiceOrb small /></div><div><small>Hi，林屿。</small><h2>今晚也不用急着变好</h2></div></header>
              {menuOpen && <><button className="menu-scrim" onClick={() => setMenuOpen(false)} aria-label="关闭菜单" /><aside className="side-drawer" aria-label="功能菜单">
                <header className="drawer-profile"><div className="drawer-avatar">林</div><p><small>晚上好，</small><strong>林屿</strong></p><button onClick={() => setMenuOpen(false)} aria-label="关闭功能菜单">×</button></header>
                <section className="trial-card"><span>♙</span><p><b>新用户 7 天免费试用</b><small>解锁完整陪伴与专属记忆空间</small></p><button onClick={() => showToast('会员功能即将开放')}>开通会员</button></section>
                <nav className="drawer-nav">
                  <button onClick={() => { setMenuOpen(false); setScene('report'); }}><i>＋</i><span><b>私人影像 / 物品上传</b><small>把与 TA 有关的回忆放进看板</small></span><em>＋</em></button>
                  <button onClick={() => { setMenuOpen(false); setScene('report'); }}><i>▥</i><span><b>陪伴看板</b><small>查看报告、信件与收藏物品</small></span><em>›</em></button>
                  <button onClick={() => { setMenuOpen(false); setScene('history'); }}><i>▤</i><span><b>AI 聊天历史记录</b><small>找回每一次被认真听见的对话</small></span><em>›</em></button>
                  <button onClick={() => { setMenuOpen(false); setScene('settings'); }}><i>⌂</i><span><b>设置</b><small>账号、提醒与隐私管理</small></span><em>›</em></button>
                  <button onClick={() => { setMenuOpen(false); showToast('帮助与支持即将开放'); }}><i>?</i><span><b>帮助与支持</b><small>常见问题与意见反馈</small></span><em>›</em></button>
                </nav>
                <footer className="drawer-brand"><span>M</span><p><b>Make Again</b><small>相信每一次对话，都能让内心更靠近一点平静。</small></p></footer>
              </aside></>}
              <div className="home-scroll">
                <section className="home-mood-calendar"><header><div><small>AI 心情日历</small><strong>8 月 22 日—28 日</strong></div><button>查看整月　›</button></header><div className="calendar-week">{['五 22','六 23','日 24','一 25','二 26','三 27','四 28'].map((item, index) => <i key={item} className={index === 6 ? 'today' : index === 1 || index === 4 ? 'warm' : index === 2 ? 'low' : ''}><span>{item.split(' ')[0]}</span><b>{item.split(' ')[1]}</b><em /></i>)}</div><footer><div className="mood-signal"><i /><i /><i /></div><p><small>Wakey 的观察 · {chatSent ? '刚刚更新' : '等待了解'}</small><strong>{chatSent ? '平静里，藏着一点想念' : '完成一次对话后自动生成心情评价'}</strong></p><span>{chatSent ? '温柔' : '—'}</span></footer></section>
                <section className="daily-card"><small>8 月 28 日 · 今日陪伴</small><p>不是所有情绪<br />都要立刻被理解。<br />允许自己慢下来，<br />你依然值得被温柔以待。</p><div className="mini-orb"><VoiceOrb /></div></section>
                <section className="talk-card"><small>想聊点什么？</small><h3>把此刻最真实的感受<br />交给我就好</h3><div className="talk-topics"><button onClick={() => setScene('chat')}>✦　自己的生活</button><button onClick={() => setScene('chat')}>♡　情感与关系</button></div><button className="talk-voice" onClick={() => setScene('voice')}><VoiceOrb small /><span><b>按住说话</b><small>松开后自动发送</small></span></button></section>
              </div>
            </section>
          )}

          {scene === 'history' && <section className="phone-screen conversation-history-scene">
            <StatusBar />
            <header className="simple-header history-header"><button onClick={() => { setHistoryManage(false); setSelectedHistory([]); setScene('home'); }}>‹</button><div><small>MEMORIES</small><h2>对话历史</h2></div><button onClick={() => { setHistoryManage((value) => !value); setSelectedHistory([]); }}>{historyManage ? '完成' : '管理'}</button></header>
            <div className={`conversation-history-scroll ${historyManage ? 'is-managing' : ''}`}>
              {historyGroups.map((group) => { const visible = group.messages.filter((message) => !hiddenHistory.includes(message.id)); if (!visible.length) return null; const ids = visible.map((message) => message.id); return <section className="history-day" key={group.label}>
                <button className="history-time" onClick={() => historyManage && toggleHistoryDay(ids)}><span>{group.label}</span>{historyManage && <small>{ids.every((id) => selectedHistory.includes(id)) ? '取消本日' : '选择本日'}</small>}</button>
                {visible.map((message) => <button key={message.id} className={`history-message ${message.from} ${selectedHistory.includes(message.id) ? 'selected' : ''}`} onClick={() => historyManage && toggleHistoryItem(message.id)} aria-pressed={historyManage ? selectedHistory.includes(message.id) : undefined}>
                  <span className="history-avatar">{message.from === 'wakey' ? 'W' : '林'}</span><article><small>{message.from === 'wakey' ? 'Wakey' : '我'}</small><p>{message.text}</p></article>{historyManage && <i>{selectedHistory.includes(message.id) ? '✓' : ''}</i>}
                </button>)}
              </section>; })}
              {historyGroups.every((group) => group.messages.every((message) => hiddenHistory.includes(message.id))) && <section className="history-empty"><span>⌁</span><h3>这里暂时空了</h3><p>新的对话会继续被温柔保存。</p></section>}
            </div>
            {historyManage && <div className="history-manage-bar"><button onClick={() => { setHiddenHistory(historyGroups.flatMap((group) => group.messages.map((message) => message.id))); setSelectedHistory([]); showToast('对话历史已清空'); }}>清空全部</button><button className="delete-selected" disabled={!selectedHistory.length} onClick={deleteSelectedHistory}>删除选中{selectedHistory.length ? `（${selectedHistory.length}）` : ''}</button></div>}
          </section>}

          {scene === 'settings' && <section className="phone-screen settings-scene">
            <StatusBar />
            <header className="simple-header settings-header"><button onClick={() => setScene('home')}>‹</button><div><small>ACCOUNT</small><h2>账户与设置</h2></div><button onClick={() => showToast('更多设置即将开放')}>•••</button></header>
            <div className="settings-scroll">
              <section className="settings-identity"><div>林</div><p><strong>林屿</strong><small>微信账号已安全绑定</small></p><span>已登录</span></section>
              <section className="settings-list">{settingsItems.map((item) => <button key={item.title} onClick={() => showToast(`${item.title}即将开放`)}><i>{item.icon}</i><p><b>{item.title}</b><small>{item.detail}</small></p><span>›</span></button>)}</section>
              <p className="settings-assurance"><span>✦</span>你的对话与记忆只属于你，未经允许不会被分享。</p>
              <button className="logout-button" onClick={() => { setMenuOpen(false); setScene('login'); }}>退出登录</button>
              <small className="settings-version">Make Again · Version 0.1.0</small>
            </div>
          </section>}

          {scene === 'call' && <section className={`phone-screen call-scene ${callAccepted ? 'accepted' : ''}`}><StatusBar />{!callAccepted ? <><div className="caller"><VoiceOrb /><h2>Make Again</h2><p>手机</p></div><div className="call-tools"><button><span>◷</span>提醒我</button><button><span>▤</span>信息</button></div><div className="call-actions"><button className="decline" onClick={() => setScene('home')}><span>⌕</span>拒绝</button><button className="accept" onClick={() => setCallAccepted(true)}><span>⌕</span>接听</button></div></> : <><div className="active-caller"><h2>Make Again</h2><p>00:12</p></div><div className="active-call-grid">{['静音','键盘','免提','添加通话','FaceTime','通讯录'].map((item) => <button key={item}><span>{item === '免提' ? '◖' : '○'}</span>{item}</button>)}</div><button className="end-call" onClick={() => { setCallAccepted(false); setScene('home'); }}><span>⌕</span></button><small className="call-caption">慢慢说，我在听</small></>}</section>}
          {toastMessage && <div className="saved-toast">✓　{toastMessage}</div>}
        </div>
      </section>
      <div className="scene-indicator"><span>{current.no}</span><i /><p>{current.title}</p></div>
    </main>
  );
}
