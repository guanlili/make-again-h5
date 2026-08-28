'use client';

import { useMemo, useState } from 'react';

const screens = ['启动引导', '注册登录', '初次叙述', 'AI 深聊', '陪伴报告', '系统主页', '模拟来电'] as const;
const moods = ['开心', '平静', '焦虑', '悲伤', '其他'];
const sloganLines = ['我们不帮助你', '忘记谁，', '而是陪你慢慢', '学会，', '在失去之后也能继续'];

function StatusBar() {
  return (
    <div className="status-bar">
      <span>9:41</span>
      <div aria-hidden="true"><i className="signal" /><i className="wifi">⌁</i><i className="battery" /></div>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return <button className="round-control back" onClick={onClick} aria-label="返回">←</button>;
}

function GlowOrb({ small = false }: { small?: boolean }) {
  return <span className={`glow-orb ${small ? 'small' : ''}`} aria-hidden="true"><i /></span>;
}

function BrandTile() {
  return <div className="brand-tile"><span>M</span><small>Make Again</small></div>;
}

export default function Home() {
  const [screen, setScreen] = useState(0);
  const [mood, setMood] = useState('开心');
  const [message, setMessage] = useState('我最近有点焦虑…');
  const [recording, setRecording] = useState(false);
  const [chatStep, setChatStep] = useState(0);
  const [callAccepted, setCallAccepted] = useState(false);

  const screenTitle = useMemo(() => screens[screen], [screen]);
  const next = () => setScreen((value) => Math.min(value + 1, screens.length - 1));
  const back = () => setScreen((value) => Math.max(value - 1, 0));

  return (
    <main className="prototype-shell">
      <aside className="prototype-intro">
        <div className="eyebrow"><span /> MAKE AGAIN · NEW UI</div>
        <h1>在失去之后，<br />也能继续。</h1>
        <p>深海夜色、橙粉光晕与低透明玻璃共同构成的新一代情绪陪伴界面。</p>
        <div className="prototype-meta"><span>深海夜色</span><span>能量光晕</span><span>疗愈玻璃</span></div>
        <nav className="screen-nav" aria-label="页面导航">
          {screens.map((item, index) => (
            <button key={item} className={screen === index ? 'active' : ''} onClick={() => setScreen(index)}>
              <span>{String(index + 1).padStart(2, '0')}</span>{item}
            </button>
          ))}
        </nav>
      </aside>

      <section className="device-stage">
        <div className="stage-glow stage-glow-one" /><div className="stage-glow stage-glow-two" />
        <div className="phone" data-screen={screenTitle}>
          <div className="dynamic-island" />

          {screen === 0 && (
            <section className="screen launch-screen">
              <StatusBar />
              <div className="edge-frame" />
              <div className="launch-brand"><BrandTile /></div>
              <div className="launch-slogan" aria-label={sloganLines.join('')}>
                {sloganLines.map((line, lineIndex) => (
                  <p key={line}>{[...line].map((char, charIndex) => (
                    <span key={`${char}-${charIndex}`} style={{ animationDelay: `${.35 + (lineIndex * 7 + charIndex) * .07}s` }}>{char}</span>
                  ))}</p>
                ))}
              </div>
              <button className="glass-primary enter-button" onClick={next}>进入 <span>→</span></button>
            </section>
          )}

          {screen === 1 && (
            <section className="screen login-screen">
              <StatusBar />
              <div className="edge-frame" />
              <BackButton onClick={back} />
              <div className="login-title">Make again</div>
              <button className="wechat-login" onClick={next}><span>●●</span> 微信一键登录</button>
              <small className="privacy-note">登录即代表同意《用户协议》与《隐私政策》</small>
            </section>
          )}

          {screen === 2 && (
            <section className="screen voice-screen">
              <StatusBar />
              <div className="edge-frame" />
              <header className="question-header"><BackButton onClick={back} /><h2>最近，是什么让你有些放不下</h2><button onClick={next}>跳过</button></header>
              <div className="conversation-area">
                <div className="glass-message ai-prompt"><em>Wakey</em><strong>今天想聊聊什么呢？</strong><p>可以是你的心情、困惑，或者任何想说的。</p></div>
                <div className="glass-message self-message"><em>我</em><strong>{message}</strong></div>
              </div>
              <div className={`voice-dock ${recording ? 'recording' : ''}`}>
                <button className="keyboard-button" aria-label="切换键盘">⌨</button>
                <button className="hold-to-talk" onPointerDown={() => setRecording(true)} onPointerUp={() => setRecording(false)} onPointerLeave={() => setRecording(false)} onClick={() => setMessage(recording ? '我最近总在夜里想起它…' : message)}>
                  <GlowOrb />
                  <span>{recording ? '正在聆听…' : '按住说话'}</span>
                </button>
                <button className="close-button" onClick={next}>×</button>
              </div>
            </section>
          )}

          {screen === 3 && (
            <section className="screen chat-screen">
              <StatusBar />
              <div className="edge-frame" />
              <header className="question-header"><BackButton onClick={back} /><h2>最近，是什么让你有些放不下</h2><button>···</button></header>
              <div className="conversation-area">
                <div className="glass-message ai-prompt"><em>Wakey</em><strong>{chatStep ? '我会陪你把这份焦虑慢慢放轻。' : '今天想聊聊什么呢？'}</strong><p>{chatStep ? '先从此刻身体最明显的感受开始，可以吗？' : '可以是你的心情、困惑，或者任何想说的。'}</p></div>
                <div className="glass-message self-message"><em>我</em><strong>{message}</strong></div>
                {chatStep > 0 && <div className="glass-message ai-followup"><strong>不需要急着说清楚。此刻，是胸口更紧，还是脑子停不下来？</strong></div>}
              </div>
              <div className="chat-dock">
                <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="输入你想问的…" aria-label="对话输入" />
                <button onClick={() => setChatStep(1)}><GlowOrb small /></button>
              </div>
            </section>
          )}

          {screen === 4 && (
            <section className="screen report-screen">
              <StatusBar />
              <header className="report-header"><BackButton onClick={back} /><h2>你的初次陪伴报告</h2><button className="round-control">↗</button></header>
              <div className="report-scroll">
                <section className="report-card narrative-card">
                  <div className="report-card-title"><span>▤</span><h3>你的陪伴报告</h3></div>
                  <p>我听到，毛球不只是宠物，它是陪你十二年的家人。它每天在门口摇着尾巴等你，会把头轻轻搁在你腿上，晚上就睡在床边，让你一伸手就能摸到。</p>
                  <p>它走得突然，你没能见到最后一面，这件事一直压在心头。你反复回想它最后没精神、不爱吃饭的样子，后悔自己当时只当它是老了、天热，没有早点带它去医院。</p>
                  <p>你不想忘记它，只想把这些回忆好好收着，慢慢习惯没有它的日子。</p>
                  <div className="memory-object"><span>♥</span><i /></div>
                </section>
                <section className="report-card plan-report">
                  <div className="report-card-title"><span>♧</span><div><h3>你的疗愈计划</h3><small>按周期陪伴你，慢慢走出思念</small></div></div>
                  <div className="plan-timeline">
                    <article><i>▤</i><div><strong>［第1–2周］允许悲伤，说出内疚</strong><p>每天给毛球写几句话或一封信，把“对不起”和“我舍不得你”说出口。</p></div></article>
                    <article><i>▣</i><div><strong>［第2–4周］为毛球做一个纪念空间</strong><p>把项圈和小黄鸭玩具放在专门的盒子里，配上照片，完成一次小小的告别。</p></div></article>
                    <article><i>☾</i><div><strong>［第1–2个月］陪伴夜晚的孤独</strong><p>夜里特别空时，放一点轻柔声音，让思念有地方安放。</p></div></article>
                    <article><i>♡</i><div><strong>［3个月后］慢慢考虑再养的事</strong><p>不急着决定。新的生命不是替代，而是另一段关系。</p></div></article>
                  </div>
                </section>
                <section className="report-card encouragement"><span>♥</span><div><h3>你已经做得很好了</h3><p>爱从不会因告别消失，它会以另一种方式继续陪伴你。</p></div></section>
                <div className="report-actions"><button>✎　补充想说的</button><button className="gradient-action" onClick={next}>进入主界面　→</button></div>
              </div>
            </section>
          )}

          {screen === 5 && (
            <section className="screen home-screen">
              <StatusBar />
              <header className="home-header"><GlowOrb small /><div><span>Hi，林屿。</span><strong>今晚也不用急着变好</strong></div><button className="heart-button">♡</button></header>
              <main className="home-scroll">
                <button className="date-card"><span>▦</span><div><small>这是属于你的今日</small><strong>8 月 28 日 · 星期五</strong></div><b>›</b></button>
                <section className="healing-copy-card">
                  <small>情绪疗愈文案 ·</small>
                  <p>你已经很努力了，<br />不是所有情绪都要立刻被理解。<br />允许自己慢下来，<br />在每一个呼吸中，<br />找回内心的平静与力量。<br />无论今天怎样，<br />你依然值得被温柔以待。</p>
                  <div className="healing-orb"><GlowOrb /><i className="leaf leaf-a" /><i className="leaf leaf-b" /><i className="leaf leaf-c" /></div>
                </section>
                <section className="home-glass mood-card"><h2>你现在感觉怎样？</h2><div>{moods.map((item) => <button key={item} className={mood === item ? 'active' : ''} onClick={() => setMood(item)}>{item}</button>)}</div></section>
                <section className="home-glass topic-card"><h2>今天想聊点什么？</h2><div><button onClick={() => setScreen(3)}>✦　自己的生活</button><button className="active" onClick={() => setScreen(3)}>♥　情感与关系</button></div></section>
                <blockquote>—　相信每一次对话，<br />都能让你更靠近内心的平静　—</blockquote>
              </main>
              <div className="home-dock"><button>⌨</button><button className="home-orb" onClick={() => setScreen(3)}><GlowOrb /></button><button onClick={() => { setCallAccepted(false); setScreen(6); }}>×</button></div>
            </section>
          )}

          {screen === 6 && (
            <section className={`screen ios-call-screen ${callAccepted ? 'accepted' : 'incoming'}`}>
              <StatusBar />
              {!callAccepted ? <>
                <div className="incoming-caller"><GlowOrb /><h2>Make Again</h2><p>手机</p><small>模拟来电 · 一次只属于你的练习</small></div>
                <div className="incoming-secondary-actions"><button><span>◷</span>提醒我</button><button><span>▤</span>信息</button></div>
                <div className="incoming-main-actions"><button className="decline-call" onClick={() => setScreen(5)}><span>⌕</span><em>拒绝</em></button><button className="accept-call" onClick={() => setCallAccepted(true)}><span>⌕</span><em>接听</em></button></div>
              </> : <>
                <div className="active-call-copy"><h2>Make Again</h2><p>00:12</p></div>
                <div className="active-call-grid"><button><span>●</span>静音</button><button><span>⊞</span>键盘</button><button className="selected"><span>◖</span>免提</button><button><span>＋</span>添加通话</button><button><span>▣</span>FaceTime</button><button><span>◎</span>通讯录</button></div>
                <button className="end-call" onClick={() => { setCallAccepted(false); setScreen(5); }}><span>⌕</span></button><div className="active-call-caption">慢慢说，我在听</div>
              </>}
            </section>
          )}
        </div>
      </section>

      <aside className="prototype-note"><span>当前页面</span><strong>{String(screen + 1).padStart(2, '0')} / {screens.length}</strong><p>{screenTitle}</p></aside>
    </main>
  );
}
