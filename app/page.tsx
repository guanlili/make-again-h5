'use client';

import { useMemo, useState } from 'react';

const screens = [
  '启动引导',
  '注册登录',
  '初次叙述',
  'AI 深聊',
  '疗愈报告',
  '系统主页',
  '模拟来电',
] as const;

const moodOptions = ['平静', '想念', '焦虑', '难过', '释然'];
const animatedSlogan = '我们不帮助你忘记谁，而是陪你慢慢学会，在失去之后继续生活。';

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
  const [callAccepted, setCallAccepted] = useState(false);

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
          <span>暖色渐变</span><span>iOS 原生感</span><span>温柔陪伴</span>
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
            <section className="screen splash-screen" aria-label="Make Again 启动引导">
              <StatusBar />
              <div className="star-field" aria-hidden="true">
                {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
              </div>
              <div className="launch-landscape" aria-hidden="true">
                <div className="launch-sun" />
                <div className="launch-hill launch-hill-back" />
                <div className="launch-hill launch-hill-front" />
              </div>
              <div className="splash-center merged-launch">
                <BrandMark />
                <div className="wordmark">Make <em>Again</em></div>
                <p className="animated-slogan" aria-label={animatedSlogan}>
                  {[...animatedSlogan].map((character, index) => (
                    <span key={`${character}-${index}`} style={{ animationDelay: `${.7 + index * .075}s` }}>{character}</span>
                  ))}
                  <i aria-hidden="true" />
                </p>
              </div>
              <div className="launch-actions">
                <button className="primary-button" onClick={next}>开始这段旅程 <span>→</span></button>
                <button className="text-button" onClick={() => setScreen(5)}>我已经来过</button>
              </div>
            </section>
          )}

          {screen === 1 && (
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

          {screen === 2 && (
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

          {screen === 3 && (
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

          {screen === 4 && (
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

          {screen === 5 && (
            <section className="screen home-screen">
              <StatusBar />
              <header className="home-header">
                <button className="avatar-button" aria-label="个人中心"><span>林</span></button>
                <div><span>晚上好，林屿</span><strong>今天也不用急着变好</strong></div>
                <button className="heart-button" aria-label="树洞消息">♡<i>2</i></button>
              </header>
              <section className="talk-section home-primary">
                <div className="section-title"><div><small>MAKE AGAIN 在这里</small><h2>今晚，想聊点什么？</h2></div><button>全部 ›</button></div>
                <div className="talk-cards">
                  <button className="featured-talk" onClick={() => setScreen(3)}>
                    <span>周六 20:30 · 温柔提醒</span>
                    <strong>这个星期，我们换一种方式<br />度过原本属于那通电话的时间。</strong>
                    <em>和 Make Again 聊聊 <b>→</b></em>
                  </button>
                  <button onClick={() => { setCallAccepted(false); setScreen(6); }}>
                    <span>一次勇气练习</span>
                    <strong>如果那通电话<br />再次响起</strong>
                    <em>模拟来电 <b>→</b></em>
                  </button>
                </div>
              </section>
              <section className="mood-section">
                <div className="section-title"><div><small>每日情绪记录</small><h2>你现在感觉怎样？</h2></div><span>连续 4 天</span></div>
                <div className="mood-row">
                  {moodOptions.map((item) => <button key={item} className={mood === item ? 'active' : ''} onClick={() => setMood(item)}><i />{item}</button>)}
                </div>
              </section>
              <section className="daily-card compact-daily">
                <div className="quote-mark">“</div>
                <p>愿你的想念，今天轻一点。</p>
                <div className="quote-source">今日短句 · 01</div>
              </section>
              <nav className="tab-bar" aria-label="底部导航"><button className="active">⌂<span>今天</span></button><button>◌<span>记录</span></button><button className="main-talk" onClick={() => setScreen(3)}>✦</button><button>□<span>树洞</span></button><button>○<span>我的</span></button></nav>
            </section>
          )}

          {screen === 6 && (
            <section className={`screen ios-call-screen ${callAccepted ? 'accepted' : 'incoming'}`}>
              <StatusBar />
              {!callAccepted ? (
                <>
                  <div className="incoming-caller">
                    <div className="caller-avatar"><span>MA</span></div>
                    <h2>Make Again</h2>
                    <p>手机</p>
                    <small>模拟来电 · 一次只属于你的练习</small>
                  </div>
                  <div className="incoming-secondary-actions">
                    <button><span>◷</span>提醒我</button>
                    <button><span>▤</span>信息</button>
                  </div>
                  <div className="incoming-main-actions">
                    <button className="decline-call" onClick={() => setScreen(5)}><span>⌕</span><em>拒绝</em></button>
                    <button className="accept-call" onClick={() => setCallAccepted(true)}><span>⌕</span><em>接听</em></button>
                  </div>
                  <div className="slide-hint">你可以随时选择不接听</div>
                </>
              ) : (
                <>
                  <div className="active-call-copy">
                    <h2>Make Again</h2>
                    <p>00:12</p>
                  </div>
                  <div className="active-call-grid">
                    <button><span>●</span>静音</button>
                    <button><span>⊞</span>键盘</button>
                    <button className="selected"><span>◖</span>免提</button>
                    <button><span>＋</span>添加通话</button>
                    <button><span>▣</span>FaceTime</button>
                    <button><span>◎</span>通讯录</button>
                  </div>
                  <button className="end-call" onClick={() => { setCallAccepted(false); setScreen(5); }} aria-label="结束通话"><span>⌕</span></button>
                  <div className="active-call-caption">慢慢说，我在听</div>
                </>
              )}
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
