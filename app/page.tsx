'use client';

import { useEffect, useMemo, useState } from 'react';

const screens = [
  '启动页',
  '品牌引导',
  '注册登录',
  '初次叙述',
  'AI 深聊',
  '疗愈报告',
  '系统主页',
  '模拟来电',
] as const;

const moodOptions = ['平静', '想念', '焦虑', '难过', '释然'];

function StatusBar({ light = true }: { light?: boolean }) {
  return (
    <div className={`status-bar ${light ? 'status-light' : ''}`}>
      <span>9:41</span>
      <div className="status-icons" aria-hidden="true">
        <i className="signal" />
        <i className="wifi">⌁</i>
        <i className="battery" />
      </div>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="icon-button back-button" onClick={onClick} aria-label="返回上一页">
      ←
    </button>
  );
}

function ProgressDots({ active }: { active: number }) {
  return (
    <div className="progress-dots" aria-label={`引导进度 ${active + 1}/3`}>
      {[0, 1, 2].map((item) => (
        <span key={item} className={item === active ? 'active' : ''} />
      ))}
    </div>
  );
}

function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <div className={`brand-mark ${small ? 'brand-mark-small' : ''}`} aria-label="Make Again">
      <span className="brand-orbit" />
      <span className="brand-letter">M</span>
    </div>
  );
}

export default function Home() {
  const [screen, setScreen] = useState(0);
  const [mood, setMood] = useState('想念');
  const [message, setMessage] = useState('我总会在周六晚上想起他，那原本是我们固定打电话的时间。');
  const [chatStep, setChatStep] = useState(0);
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    if (screen !== 0) return;
    const timer = window.setTimeout(() => setScreen(1), 2400);
    return () => window.clearTimeout(timer);
  }, [screen]);

  const screenTitle = useMemo(() => screens[screen], [screen]);
  const next = () => setScreen((value) => Math.min(value + 1, screens.length - 1));
  const back = () => setScreen((value) => Math.max(value - 1, 0));

  return (
    <main className="prototype-shell">
      <section className="prototype-intro" aria-label="原型说明">
        <div className="eyebrow"><span /> MAKE AGAIN · MOBILE PROTOTYPE</div>
        <h1>在失去之后，<br />慢慢继续生活。</h1>
        <p>一款帮助人接受离别、整理记忆，并重新找回生活节奏的 AI 陪伴产品。</p>
        <div className="prototype-meta">
          <span>蓝紫夜色</span><span>低刺激动效</span><span>温柔陪伴</span>
        </div>
        <nav className="screen-nav" aria-label="原型页面导航">
          {screens.map((item, index) => (
            <button key={item} className={screen === index ? 'active' : ''} onClick={() => setScreen(index)}>
              <span>{String(index + 1).padStart(2, '0')}</span>{item}
            </button>
          ))}
        </nav>
      </section>

      <section className="device-stage">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="phone" data-screen={screenTitle}>
          <div className="phone-glint" />

          {screen === 0 && (
            <button className="screen splash-screen" onClick={next} aria-label="进入 Make Again">
              <StatusBar />
              <div className="star-field" aria-hidden="true">
                {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
              </div>
              <div className="splash-center">
                <BrandMark />
                <div className="wordmark">Make <em>Again</em></div>
                <p>温柔地，和过去重新相处</p>
              </div>
              <div className="splash-bottom">轻触屏幕开始</div>
            </button>
          )}

          {screen === 1 && (
            <section className="screen intro-screen">
              <StatusBar />
              <div className="soft-stars" aria-hidden="true" />
              <div className="intro-art" aria-hidden="true">
                <div className="moon-disc"><span /></div>
                <div className="horizon horizon-back" />
                <div className="horizon horizon-front" />
                <div className="tiny-person" />
              </div>
              <div className="intro-copy">
                <ProgressDots active={0} />
                <h2>我们不帮助你忘记谁</h2>
                <p>而是陪你慢慢学会，<br />在失去之后继续生活。</p>
                <button className="primary-button" onClick={next}>开始这段旅程 <span>→</span></button>
                <button className="text-button" onClick={() => setScreen(6)}>我已经来过</button>
              </div>
            </section>
          )}

          {screen === 2 && (
            <section className="screen login-screen">
              <StatusBar />
              <BackButton onClick={back} />
              <div className="login-visual" aria-hidden="true">
                <div className="login-orb orb-a" />
                <div className="login-orb orb-b" />
                <BrandMark />
              </div>
              <div className="login-copy">
                <ProgressDots active={1} />
                <h2>欢迎来到<br />Make Again</h2>
                <p>这里没有评判，也不催促你。<br />你可以按照自己的节奏慢慢来。</p>
                <button className="wechat-button" onClick={next}><span>●●</span> 微信一键登录</button>
                <small>登录即代表你同意《用户协议》与《隐私政策》</small>
              </div>
            </section>
          )}

          {screen === 3 && (
            <section className="screen writing-screen">
              <StatusBar light={false} />
              <header className="screen-header">
                <BackButton onClick={back} />
                <span className="step-label">初次见面 · 1 / 3</span>
                <button className="skip-button" onClick={next}>稍后</button>
              </header>
              <div className="writing-copy">
                <span className="mini-label">不需要组织好语言</span>
                <h2>最近，是什么<br />让你有些放不下？</h2>
                <p>可以是一段关系、一个人、一只陪伴过你的宠物，或一件没有说完的事。</p>
              </div>
              <div className="writing-card">
                <textarea value={message} onChange={(event) => setMessage(event.target.value)} aria-label="写下最近放不下的事" />
                <div className="writing-tools">
                  <span>{message.length} 字</span>
                  <button aria-label="语音输入">⌁</button>
                </div>
              </div>
              <div className="prompt-chips">
                <button onClick={() => setMessage('我害怕有一天会记不清他的声音。')}>害怕记忆消失</button>
                <button onClick={() => setMessage('很多话还没有来得及好好说出口。')}>还有话没说</button>
              </div>
              <button className="primary-button bottom-action" onClick={next} disabled={!message.trim()}>把这些告诉 Make Again <span>→</span></button>
            </section>
          )}

          {screen === 4 && (
            <section className="screen chat-screen">
              <StatusBar />
              <header className="screen-header chat-header">
                <BackButton onClick={back} />
                <div><strong>Make Again</strong><span><i /> 正在陪伴你</span></div>
                <button className="more-button" aria-label="更多选项">···</button>
              </header>
              <div className="chat-date">今天 21:14</div>
              <div className="messages">
                <div className="message ai-message">
                  <BrandMark small />
                  <div>
                    <p>{chatStep === 0 ? '谢谢你愿意告诉我这些。周六晚上对你来说，像是一个被突然留下来的空位。' : '我记住了。我们不急着把这个空位填满，先一起让今晚变得轻一点。'}</p>
                  </div>
                </div>
                <div className="message user-message"><p>{message}</p></div>
                <div className="message ai-message delayed">
                  <BrandMark small />
                  <div>
                    <p>{chatStep === 0 ? '当这种想念出现时，你身体的哪个地方最先有感觉？' : '如果愿意，今晚我们可以做一个 3 分钟的小练习。你不需要表现得很坚强。'}</p>
                    <div className="quick-replies">
                      {(chatStep === 0 ? ['胸口有点闷', '脑子停不下来', '说不太清楚'] : ['现在开始', '先陪我聊一会儿']).map((item) => (
                        <button key={item} onClick={() => setChatStep(1)}>{item}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="chat-composer">
                <button aria-label="语音输入">⌁</button>
                <input placeholder="慢慢说，我在听…" aria-label="回复 Make Again" />
                <button className="send-button" onClick={next} aria-label="发送并生成报告">↑</button>
              </div>
            </section>
          )}

          {screen === 5 && (
            <section className="screen report-screen">
              <StatusBar light={false} />
              <header className="screen-header">
                <BackButton onClick={back} />
                <span className="step-label">你的初次陪伴报告</span>
                <button className="share-button" aria-label="分享">↗</button>
              </header>
              <div className="report-scroll">
                <div className="report-hero">
                  <span>MA · 0827</span>
                  <h2>你不是放不下，<br />只是这段关系<br />还没有找到新的位置。</h2>
                  <p>Make Again 根据你刚才的叙述，为你整理了这份开始。</p>
                  <div className="report-constellation" aria-hidden="true"><i /><i /><i /><i /></div>
                </div>
                <div className="report-card">
                  <span className="card-kicker">此刻的你</span>
                  <h3>你的想念有清晰的时间线索</h3>
                  <p>周六夜晚、电话和“没有说完的话”，是最近最常触发情绪的三个线索。</p>
                  <div className="emotion-bars">
                    <div><span style={{ width: '78%' }} /><em>想念</em><b>78</b></div>
                    <div><span style={{ width: '56%' }} /><em>遗憾</em><b>56</b></div>
                    <div><span style={{ width: '35%' }} /><em>焦虑</em><b>35</b></div>
                  </div>
                </div>
                <div className="plan-card">
                  <div className="plan-number">01</div>
                  <div><span>第一个小计划</span><h3>重新安排周六的夜晚</h3><p>这周六 20:30，我们用一段散步替代等待。</p></div>
                </div>
                <button className="primary-button report-button" onClick={next}>确认我的陪伴计划 <span>→</span></button>
              </div>
            </section>
          )}

          {screen === 6 && (
            <section className="screen home-screen">
              <StatusBar />
              <header className="home-header">
                <button className="avatar-button" aria-label="个人中心"><span>林</span></button>
                <div><span>晚上好，林屿</span><strong>今天也不用急着变好</strong></div>
                <button className="heart-button" aria-label="树洞消息">♡<i>2</i></button>
              </header>
              <button className="notice-card" onClick={() => setShowNotice(!showNotice)}>
                <span className="notice-icon">☾</span>
                <div><small>温柔提醒 · 周六 20:30</small><strong>{showNotice ? '计划已加入今晚提醒' : '今晚，换一种方式度过这个时间'}</strong></div>
                <span>›</span>
              </button>
              <section className="daily-card">
                <div className="daily-orb" aria-hidden="true"><i /></div>
                <div className="quote-mark">“</div>
                <p>你不需要放下过去，<br />只需要把它放到一个<br />不会挡住未来的位置。</p>
                <div className="quote-source">今日陪伴 · 01</div>
              </section>
              <section className="mood-section">
                <div className="section-title"><div><small>每日情绪记录</small><h2>你现在感觉怎样？</h2></div><span>连续 4 天</span></div>
                <div className="mood-row">
                  {moodOptions.map((item) => <button key={item} className={mood === item ? 'active' : ''} onClick={() => setMood(item)}><i />{item}</button>)}
                </div>
              </section>
              <section className="talk-section">
                <div className="section-title"><div><small>今晚可以</small><h2>想聊点什么？</h2></div><button>全部 ›</button></div>
                <div className="talk-cards">
                  <button onClick={() => setScreen(4)}><span>01</span><strong>关于那段<br />没有说完的话</strong><em>开始聊聊 →</em></button>
                  <button onClick={() => setScreen(7)}><span>02</span><strong>试着接起<br />那通电话</strong><em>模拟来电 →</em></button>
                </div>
              </section>
              <nav className="tab-bar" aria-label="底部导航"><button className="active">⌂<span>今天</span></button><button>◌<span>记录</span></button><button className="main-talk" onClick={() => setScreen(4)}>✦</button><button>□<span>树洞</span></button><button>○<span>我的</span></button></nav>
            </section>
          )}

          {screen === 7 && (
            <section className="screen call-screen">
              <StatusBar />
              <div className="call-top"><BackButton onClick={back} /><span>模拟来电</span><button>文字模式</button></div>
              <div className="call-copy"><small>一次只属于你的练习</small><h2>如果那通电话<br />真的再次响起</h2><p>你不需要证明自己已经释怀。<br />只要听听此刻的自己，会说些什么。</p></div>
              <div className="voice-presence" aria-label="AI 形象正在聆听">
                <div className="voice-ring ring-one" /><div className="voice-ring ring-two" /><div className="voice-ring ring-three" />
                <div className="voice-core"><span>MA</span><i /></div>
                <div className="waveform" aria-hidden="true">{[1,2,3,4,5,6,7,8,9].map((n) => <i key={n} />)}</div>
              </div>
              <div className="call-status"><i /> Make Again 正在听</div>
              <div className="call-actions"><button><span>⌁</span>切换文字</button><button className="mic-button"><span>●</span></button><button onClick={() => setScreen(6)}><span>×</span>结束练习</button></div>
              <div className="call-hint">想停下时，随时都可以离开</div>
            </section>
          )}
        </div>
      </section>

      <aside className="prototype-note">
        <span>当前页面</span><strong>{String(screen + 1).padStart(2, '0')} / {screens.length}</strong><p>{screenTitle}</p>
      </aside>
    </main>
  );
}
