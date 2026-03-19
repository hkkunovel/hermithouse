import { useState } from "react";
import { CARDS, POS, pick3 } from './cards.js';
import { getSynthesis, extractKeyword, analyzeQuestion } from './synthesis.js';

export default function App(){
  const[question,setQuestion]=useState('');
  const[phase,setPhase]=useState('input');
  const[cards,setCards]=useState([]);
  const[revealed,setRevealed]=useState([false,false,false]);
  const[qError,setQError]=useState('');
  const[qInfo,setQInfo]=useState(null);
  const[aiMsg,setAiMsg]=useState('');
  const[aiLoading,setAiLoading]=useState(false);
  const[extraCards,setExtraCards]=useState([]);
  const[extraRevealed,setExtraRevealed]=useState([false,false,false]);
  const[extraMsg,setExtraMsg]=useState('');
  const[extraLoading,setExtraLoading]=useState(false);
  const[dark,setDark]=useState(false);

  function onQuestionChange(e){
    const v=e.target.value;
    setQuestion(v);
    setQError('');
    if(v.trim().length>=4){
      const r=analyzeQuestion(v);
      setQInfo(r.ok?r:null);
    } else setQInfo(null);
  }
  function start(){
    const r=analyzeQuestion(question);
    if(!r.ok){setQError(r.reason);return;}
    const d=pick3();setCards(d);setQInfo(r);setPhase('result');
    setAiMsg('');setAiLoading(false);
    setRevealed([false,false,false]);
    setTimeout(()=>setRevealed([true,false,false]),200);
    setTimeout(()=>setRevealed([true,true,false]),520);
    setTimeout(()=>setRevealed([true,true,true]),840);
    const _kw=extractKeyword(question);
    if(window.gtag) window.gtag('event','reading_start',{category:r.cat,keyword:_kw?.word||'없음',intent:_kw?.intent||'없음'});
    setTimeout(()=>_aiReadWithCards(d, r),1100);
  }
  async function _aiReadWithCards(cardsArg, qInfoArg){
    setAiLoading(true);
    setAiMsg('');
    const cat = qInfoArg?.cat || '기타';
    const prompt = `당신은 타로 리더입니다. 질문자의 상황에 직접 답하는 타로 메시지를 써주세요.\n\n[질문자의 질문]\n"${question}"\n\n[카테고리]\n${cat}\n\n[뽑힌 카드]\n- 과거: ${cardsArg[0].kr} — ${cardsArg[0].reading}\n- 현재: ${cardsArg[1].kr} — ${cardsArg[1].reading}\n- 미래: ${cardsArg[2].kr} — ${cardsArg[2].reading}\n\n[작성 규칙]\n1. 가장 중요: 질문자가 실제로 궁금해하는 것에 직접 답해야 합니다. 질문의 핵심 상황(회사, 관계, 시험 등)을 메시지에 반드시 반영하세요.\n2. 과거→현재→미래 카드의 흐름을 내러티브로 이어주세요.\n3. 카드 이름이나 타로 용어는 직접 언급하지 마세요. 카드의 의미를 자연스럽게 녹여주세요.\n4. 질문자에게 직접 말하는 2인칭(당신) 어투로 써주세요.\n5. 필요하면 의문문을 써도 좋습니다.\n6. 감성적이고 따뜻하되, 구체적이고 실질적인 내용을 담아주세요.\n7. 3~5문장 이내로 써주세요.\n8. 답변 텍스트만 출력하세요. 제목이나 부가 설명 없이.`;
    try {
      const res = await fetch('/api/reading', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514',
          max_tokens:1000,
          messages:[{role:'user', content:prompt}]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==='text')?.text;
      if(text) setAiMsg(text);
      else setAiMsg(getSynthesis(cardsArg, qInfoArg?.cat, question));
    } catch(e) {
      setAiMsg(getSynthesis(cardsArg, qInfoArg?.cat, question));
    }
    setAiLoading(false);
  }
  function aiRead(){ _aiReadWithCards(cards, qInfo); }

  async function drawExtra(){
    if(extraLoading) return;
    const usedNames = new Set(cards.map(c=>c.name));
    const pool = CARDS.filter(c=>!usedNames.has(c.name));
    const shuffled = pool.sort(()=>Math.random()-.5);
    const drawn = [shuffled[0], shuffled[1], shuffled[2]];
    setExtraCards(drawn);
    setExtraRevealed([false,false,false]);
    setExtraMsg('');
    setTimeout(()=>setExtraRevealed([true,false,false]),200);
    setTimeout(()=>setExtraRevealed([true,true,false]),520);
    setTimeout(()=>setExtraRevealed([true,true,true]),840);
    setTimeout(()=>_aiExtraRead(drawn), 1200);
  }

  async function _aiExtraRead(extraCardsArg){
    setExtraLoading(true);
    setExtraMsg('');
    const cat = qInfo?.cat || '기타';
    const prompt = `당신은 타로 리더입니다. 기존 3장 리딩에 이어, 조언 카드와 방해물 카드 2장을 추가로 해석해주세요.\n\n[질문]\n"${question}" (카테고리: ${cat})\n\n[기존 3장]\n- 과거: ${cards[0].kr} — ${cards[0].reading}\n- 현재: ${cards[1].kr} — ${cards[1].reading}\n- 미래: ${cards[2].kr} — ${cards[2].reading}\n\n[추가 카드]\n- 방해물: ${extraCardsArg[0].kr} — ${extraCardsArg[0].reading}\n- 상대방/주변환경: ${extraCardsArg[1].kr} — ${extraCardsArg[1].reading}\n- 조언: ${extraCardsArg[2].kr} — ${extraCardsArg[2].reading}\n\n[작성 규칙]\n1. 기존 3장의 흐름과 맥락을 이어받아 해석해주세요.\n2. 방해물 카드 — 지금 앞을 막고 있는 것, 주의해야 할 것을 현실적으로 짚어주세요.\n3. 상대방/주변환경 카드 — 지금 주변 상황이나 상대방의 에너지를 읽어주세요.\n4. 조언 카드 — 이 상황에서 취해야 할 구체적인 행동 방향으로 마무리해주세요.\n5. 질문자의 실제 상황(회사, 관계 등)에 직접 연결해서 써주세요.\n6. 카드 이름이나 타로 용어는 절대 언급하지 마세요.\n7. 2인칭 어투, 감성적이되 구체적으로, 4~6문장 이내.\n8. 답변 텍스트만 출력하세요.`;
    try {
      const res = await fetch('/api/reading', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,messages:[{role:'user',content:prompt}]})
      });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==='text')?.text;
      if(text) setExtraMsg(text);
      else setExtraMsg(_extraFallback(extraCardsArg));
    } catch(e){
      setExtraMsg(_extraFallback(extraCardsArg));
    }
    setExtraLoading(false);
  }

  function _extraFallback(ec){
    const cat = qInfo?.cat || '기타';
    const isLove = cat.includes('연애');
    const isWork = cat.includes('직업');
    const block = ec[0]?.reading || '';
    const env = ec[1]?.reading || '';
    const advice = ec[2]?.reading || '';
    if(isLove) return `지금 이 관계에서 당신 앞을 막고 있는 것이 있습니다. ${block} 주변 상황은 이렇게 말하고 있어요. ${env} 그 안에서 카드가 건네는 조언은 이것입니다. ${advice}`;
    if(isWork) return `지금 앞으로 나아가는 데 걸림돌이 되는 것이 있습니다. ${block} 주변 환경의 에너지는 이렇습니다. ${env} 카드가 제안하는 방향은 이렇습니다. ${advice}`;
    return `지금 당신 앞을 막고 있는 것이 있습니다. ${block} 주변 상황은 이렇게 흐르고 있어요. ${env} 카드가 건네는 조언입니다. ${advice}`;
  }

  function reset(){setPhase('input');setQuestion('');setCards([]);setRevealed([false,false,false]);setQError('');setQInfo(null);setAiMsg('');setAiLoading(false);setExtraCards([]);setExtraRevealed([false,false,false]);setExtraMsg('');setExtraLoading(false);}

  function formatAiMsg(text){
    if(!text) return null;
    text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
    const sentences = [];
    let buf = '';
    for(let i=0;i<text.length;i++){
      buf += text[i];
      if(('.!?').includes(text[i]) && (i===text.length-1 || text[i+1]===' ')){
        sentences.push(buf.trim());
        buf=''; i++;
      }
    }
    if(buf.trim()) sentences.push(buf.trim());
    if(!sentences.length) sentences.push(text);
    const lastIdx = sentences.length - 1;
    return sentences.map((s, si) => (
      <span key={si} style={si===lastIdx ? {fontWeight:500,color:dark?'rgba(245,238,220,.98)':'rgba(40,20,5,.95)'} : {color:dark?'rgba(245,238,220,.82)':'rgba(60,40,10,.78)'}}>
        {s}{si < lastIdx ? ' ' : ''}
      </span>
    ));
  }

  const g  = dark ? '#e2b84e' : '#8a6a1a';
  const gd = dark ? '#a07828' : '#b08030';
  const iv = dark ? '#f5eedc' : '#2c1f0e';
  const bg = dark ? '#0e0c16' : '#f5f0eb';
  const bgCard = dark ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.8)';
  const bgInput = dark ? 'rgba(0,0,0,.35)' : 'rgba(255,255,255,.9)';
  const borderCol = dark ? 'rgba(226,184,78,.2)' : 'rgba(138,106,26,.25)';
  const textSub = dark ? 'rgba(245,238,220,.72)' : 'rgba(60,40,10,.7)';
  const textFaint = dark ? 'rgba(245,238,220,.88)' : 'rgba(60,40,10,.85)';
  const radialBg = dark
    ? 'radial-gradient(ellipse at 20% 40%,rgba(120,70,200,.07),transparent 55%),radial-gradient(ellipse at 80% 20%,rgba(226,184,78,.05),transparent 50%)'
    : 'radial-gradient(ellipse at 20% 40%,rgba(180,140,80,.06),transparent 55%),radial-gradient(ellipse at 80% 20%,rgba(200,160,80,.04),transparent 50%)';

  return(<>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500&family=Outfit:wght@200;300;400;500&display=swap');@keyframes breathe{0%,100%{opacity:.55}50%{opacity:1}}@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}.br:hover{background:rgba(226,184,78,.2)!important;border-color:#e2b84e!important;color:#ffe060!important;}.rs:hover{border-color:#e2b84e!important;color:#e2b84e!important;}.ch:hover{transform:translateY(-5px);box-shadow:0 16px 44px rgba(0,0,0,.8)!important;}textarea:focus{border-color:rgba(226,184,78,.6)!important;outline:none;}textarea{color-scheme:light dark;}*{-webkit-font-smoothing:antialiased;}`}</style>
    <div style={{minHeight:'100vh',background:bg,color:iv,transition:'background .3s,color .3s',fontFamily:'"Noto Sans KR","Outfit",sans-serif'}}>
      <div style={{position:'fixed',inset:0,pointerEvents:'none',background:radialBg}}/>
      <div style={{maxWidth:800,margin:'0 auto',padding:'64px 24px 96px',position:'relative',zIndex:1}}>
        <header style={{textAlign:'center',marginBottom:52}}>
          <div style={{fontFamily:'"Outfit",sans-serif',fontSize:'clamp(1.8rem,5.5vw,3rem)',letterSpacing:'.45em',color:g,textShadow:'0 0 32px rgba(226,184,78,.35)',marginBottom:14,fontWeight:200}}>HERMIT HOUSE</div>
          <div style={{display:'flex',justifyContent:'center',marginBottom:20}}>
            <svg viewBox="0 0 120 140" width="72" height="84" style={{opacity:.85}}>
              <circle cx="92" cy="18" r="2.5" fill={g} opacity=".9"/>
              <circle cx="82" cy="8" r="1.5" fill={g} opacity=".6"/>
              <circle cx="100" cy="10" r="1.2" fill={g} opacity=".5"/>
              <line x1="92" y1="12" x2="92" y2="14" stroke={g} strokeWidth="1" opacity=".7"/>
              <line x1="86" y1="18" x2="88" y2="18" stroke={g} strokeWidth="1" opacity=".7"/>
              <line x1="96" y1="18" x2="98" y2="18" stroke={g} strokeWidth="1" opacity=".7"/>
              <line x1="92" y1="22" x2="92" y2="24" stroke={g} strokeWidth="1" opacity=".7"/>
              <rect x="84" y="26" width="16" height="20" rx="2" fill="none" stroke={g} strokeWidth="1.2" opacity=".8"/>
              <line x1="92" y1="20" x2="92" y2="26" stroke={g} strokeWidth="1.2" opacity=".7"/>
              <line x1="86" y1="30" x2="100" y2="30" stroke={g} strokeWidth=".8" opacity=".5"/>
              <line x1="86" y1="36" x2="100" y2="36" stroke={g} strokeWidth=".8" opacity=".5"/>
              <circle cx="92" cy="33" r="3" fill={g} opacity=".5"/>
              <path d="M52 28 Q52 18 62 16 Q72 14 76 22 Q80 30 74 36 L70 40 L54 40 Z" fill="none" stroke={dark?'rgba(245,232,210,.6)':'rgba(80,50,10,.7)'} strokeWidth="1.4"/>
              <ellipse cx="64" cy="38" rx="10" ry="12" fill="none" stroke={dark?'rgba(245,232,210,.7)':'rgba(80,50,10,.8)'} strokeWidth="1.4"/>
              <path d="M56 46 Q60 52 64 50 Q68 52 72 46" fill="none" stroke={dark?'rgba(245,232,210,.5)':'rgba(80,50,10,.6)'} strokeWidth="1"/>
              <path d="M44 52 Q48 44 56 44 L72 44 Q80 44 84 52 L88 90 Q88 96 82 96 L46 96 Q40 96 40 90 Z" fill="none" stroke={dark?'rgba(245,232,210,.5)':'rgba(80,50,10,.6)'} strokeWidth="1.4"/>
              <line x1="64" y1="44" x2="64" y2="96" stroke={dark?'rgba(245,232,210,.2)':'rgba(80,50,10,.28)'} strokeWidth=".8"/>
              <path d="M80 56 Q86 50 88 42 Q90 36 88 30" fill="none" stroke={dark?'rgba(245,232,210,.45)':'rgba(80,50,10,.55)'} strokeWidth="1.4"/>
              <line x1="38" y1="52" x2="30" y2="108" stroke={dark?'rgba(245,232,210,.55)':'rgba(80,50,10,.65)'} strokeWidth="1.8"/>
              <path d="M30 108 L26 116 Q28 120 32 118 L36 112" fill="none" stroke={dark?'rgba(245,232,210,.4)':'rgba(80,50,10,.5)'} strokeWidth="1.2"/>
              <ellipse cx="52" cy="100" rx="8" ry="3" fill="none" stroke={dark?'rgba(245,232,210,.3)':'rgba(80,50,10,.4)'} strokeWidth="1"/>
              <ellipse cx="72" cy="102" rx="7" ry="3" fill="none" stroke={dark?'rgba(245,232,210,.3)':'rgba(80,50,10,.4)'} strokeWidth="1"/>
              <path d="M20 118 Q64 112 108 118" fill="none" stroke="rgba(226,184,78,.2)" strokeWidth=".8"/>
            </svg>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:12,color:gd}}>
            <div style={{flex:1,height:'1px',background:`linear-gradient(to right,transparent,${gd},transparent)`}}/>
            <span style={{fontSize:'1rem',animation:'breathe 4s ease-in-out infinite',color:g}}>✦</span>
            <div style={{flex:1,height:'1px',background:`linear-gradient(to right,transparent,${gd},transparent)`}}/>
          </div>
          <div style={{display:'flex',justifyContent:'center',marginTop:8}}>
            <button onClick={()=>setDark(d=>!d)} style={{background:'transparent',border:`1px solid ${borderCol}`,color:gd,fontFamily:'"Outfit",sans-serif',fontSize:'.72rem',letterSpacing:'.18em',padding:'6px 16px',cursor:'pointer',borderRadius:20,transition:'all .3s',textTransform:'uppercase',fontWeight:300}}>
              {dark ? '☀ LIGHT' : '☾ DARK'}
            </button>
          </div>
        </header>

        {phase==='input'&&<div style={{background:bgCard,border:`1px solid ${borderCol}`,borderRadius:8,padding:28}}>
          <div style={{fontFamily:'"Noto Sans KR",sans-serif',fontSize:'.85rem',letterSpacing:'.12em',color:gd,marginBottom:10,fontWeight:400}}>질문을 입력하세요</div>
          <textarea rows={3} value={question} onChange={onQuestionChange} placeholder="마음속에 품은 고민이나 앞날에 대한 궁금증을 적어주세요." style={{width:'100%',background:bgInput,border:`1px solid ${qError?'rgba(220,100,100,.5)':borderCol}`,borderRadius:6,color:iv,fontFamily:'"Noto Sans KR",sans-serif',fontSize:'1rem',lineHeight:1.9,padding:'14px 16px',resize:'none',transition:'border-color .3s',fontWeight:300}}/>
          {qError&&<div style={{fontFamily:'"Noto Sans KR",sans-serif',fontSize:'.85rem',color:'rgba(220,120,120,.9)',marginTop:8,fontWeight:400}}>⚠ {qError}</div>}
          {qInfo&&!qError&&<div style={{display:'flex',alignItems:'center',gap:8,marginTop:10}}>
            <span style={{fontSize:'.8rem',fontFamily:'"Noto Sans KR",sans-serif',fontWeight:300,color:'rgba(245,238,220,.45)'}}>인식된 주제</span>
            <span style={{fontFamily:'"Noto Sans KR",sans-serif',fontSize:'.82rem',padding:'3px 12px',borderRadius:20,background:`${qInfo.color}22`,border:`1px solid ${qInfo.color}`,color:qInfo.color,fontWeight:500}}>{qInfo.badge} {qInfo.cat}</span>
          </div>}
          <div style={{display:'flex',gap:8,margin:'14px 0 18px',flexWrap:'wrap'}}>{['웨이트 덱 78장','쓰리카드','정방향 해석'].map(t=><span key={t} style={{fontFamily:'"Noto Sans KR",sans-serif',fontSize:'.8rem',padding:'4px 12px',border:'1px solid rgba(226,184,78,.18)',borderRadius:20,color:gd,letterSpacing:'.06em',fontWeight:300}}>{t}</span>)}</div>
          <button className="br" onClick={start} style={{width:'100%',background:'rgba(226,184,78,.08)',border:`1px solid ${gd}`,color:g,fontFamily:'"Outfit",sans-serif',fontSize:'1rem',letterSpacing:'.32em',textTransform:'uppercase',padding:'16px',cursor:'pointer',borderRadius:6,transition:'all .3s',fontWeight:500}}>✦  타로 보기  ✦</button>
        </div>}

        {phase==='result'&&<>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:28}}>
            {cards.map((c,i)=>(
              <div key={i} style={{opacity:revealed[i]?1:0,transform:revealed[i]?'none':'translateY(22px)',transition:'opacity .6s ease,transform .6s ease'}}>
                <div style={{fontFamily:'"Outfit",sans-serif',fontSize:'.75rem',letterSpacing:'.12em',color:gd,textAlign:'center',textTransform:'uppercase',marginBottom:7,fontWeight:400}}>{POS[i]}</div>
                <div className="ch" style={{borderRadius:6,overflow:'hidden',boxShadow:'0 6px 24px rgba(0,0,0,.75)',transition:'transform .3s,box-shadow .3s',border:'1px solid rgba(226,184,78,.25)',aspectRatio:'2/3',background:'#080808'}}>{c.svg}</div>
                <div style={{textAlign:'center',marginTop:8}}>
                  <div style={{fontFamily:'"Outfit",sans-serif',fontSize:'.72rem',color:g,letterSpacing:'.03em',marginBottom:2,fontWeight:500}}>{c.name}</div>
                  <div style={{fontFamily:'"Noto Sans KR",sans-serif',fontSize:'.78rem',color:iv,opacity:dark?.6:.75,fontWeight:300}}>{c.kr}</div>
                </div>
              </div>
            ))}
            {extraCards.length>0&&<>
              {extraCards.map((c,i)=>{
                const labels=['방해물','주변환경','조언'];
                const cols=['rgba(220,120,100,.75)','rgba(160,140,220,.75)','rgba(120,200,140,.75)'];
                const bords=['rgba(220,120,100,.25)','rgba(160,140,220,.25)','rgba(120,200,140,.25)'];
                return(
                  <div key={`ex${i}`} style={{opacity:extraRevealed[i]?1:0,transform:extraRevealed[i]?'none':'translateY(22px)',transition:'opacity .6s ease,transform .6s ease'}}>
                    <div style={{fontFamily:'"Outfit",sans-serif',fontSize:'.75rem',letterSpacing:'.12em',color:cols[i],textAlign:'center',textTransform:'uppercase',marginBottom:7,fontWeight:400}}>{labels[i]}</div>
                    <div className="ch" style={{borderRadius:6,overflow:'hidden',boxShadow:'0 6px 24px rgba(0,0,0,.75)',transition:'transform .3s,box-shadow .3s',border:`1px solid ${bords[i]}`,aspectRatio:'2/3',background:'#080808'}}>{c.svg}</div>
                    <div style={{textAlign:'center',marginTop:8}}>
                      <div style={{fontFamily:'"Outfit",sans-serif',fontSize:'.72rem',color:cols[i],letterSpacing:'.03em',marginBottom:2,fontWeight:500}}>{c.name}</div>
                      <div style={{fontFamily:'"Noto Sans KR",sans-serif',fontSize:'.78rem',color:iv,opacity:dark?.6:.75,fontWeight:300}}>{c.kr}</div>
                    </div>
                  </div>
                );
              })}
            </>}
          </div>

          {revealed[2]&&<div style={{animation:'fadeUp .65s ease'}}>
            <div style={{textAlign:'center',marginBottom:20}}>
              <div style={{display:'inline-flex',alignItems:'center',gap:8,flexWrap:'wrap',justifyContent:'center'}}>
                {qInfo&&<span style={{fontFamily:'"Noto Sans KR",sans-serif',fontSize:'.78rem',padding:'3px 11px',borderRadius:20,background:`${qInfo.color}18`,border:`1px solid ${qInfo.color}88`,color:qInfo.color,fontWeight:400}}>{qInfo.badge} {qInfo.cat}</span>}
                <span style={{fontFamily:'"Noto Sans KR",sans-serif',fontSize:'1rem',color:textSub,fontWeight:300}}>"{question}"</span>
              </div>
            </div>

            {false&&<div>{getSynthesis(cards, qInfo?.cat, question)}</div>}

            <div style={{background:bgCard,border:`1px solid ${borderCol}`,borderRadius:8,padding:'20px 24px',marginBottom:extraMsg?14:0}}>
              <div style={{fontFamily:'"Outfit",sans-serif',fontSize:'.92rem',letterSpacing:'.14em',color:g,textAlign:'center',marginBottom:16,textTransform:'uppercase',fontWeight:300}}>기본 리딩</div>
              {aiLoading&&<div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,padding:'16px 0',color:gd,fontFamily:'"Noto Sans KR",sans-serif',fontSize:'.9rem',fontWeight:300}}>
                <span style={{display:'inline-block',width:14,height:14,border:'1.5px solid rgba(226,184,78,.4)',borderTopColor:g,borderRadius:'50%',animation:'spin 0.8s linear infinite',flexShrink:0}}/>
                카드를 읽는 중...
              </div>}
              {aiMsg&&<>
                <div style={{fontFamily:'"Noto Sans KR",sans-serif',fontSize:'1rem',lineHeight:2.1,color:textFaint,fontWeight:300,animation:'fadeUp .5s ease',marginBottom:14}}>{formatAiMsg(aiMsg)}</div>
                <div style={{textAlign:'right'}}>
                  <button onClick={aiRead} style={{background:'transparent',border:'none',color:gd,fontFamily:'"Noto Sans KR",sans-serif',fontSize:'.8rem',cursor:'pointer',padding:'4px 0',fontWeight:300,opacity:.7}}>↺ 다시 읽기</button>
                </div>
              </>}
            </div>

            {(extraLoading||extraMsg)&&<div style={{background:bgCard,border:`1px solid ${borderCol}`,borderRadius:8,padding:'20px 24px',marginTop:14,animation:'fadeUp .5s ease'}}>
              <div style={{fontFamily:'"Outfit",sans-serif',fontSize:'.92rem',letterSpacing:'.14em',color:g,textAlign:'center',marginBottom:16,textTransform:'uppercase',fontWeight:300}}>조언 듣기</div>
              {extraLoading&&<div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,padding:'16px 0',color:gd,fontFamily:'"Noto Sans KR",sans-serif',fontSize:'.9rem',fontWeight:300}}>
                <span style={{display:'inline-block',width:14,height:14,border:'1.5px solid rgba(226,184,78,.4)',borderTopColor:g,borderRadius:'50%',animation:'spin 0.8s linear infinite',flexShrink:0}}/>
                카드를 읽는 중...
              </div>}
              {extraMsg&&<div style={{fontFamily:'"Noto Sans KR",sans-serif',fontSize:'1rem',lineHeight:2.1,color:textFaint,fontWeight:300,animation:'fadeUp .5s ease'}}>{formatAiMsg(extraMsg)}</div>}
            </div>}
          </div>}

          <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:28}}>
            {!extraCards.length&&<button onClick={drawExtra} disabled={extraLoading} style={{width:'100%',background:'rgba(226,184,78,.07)',border:'1px solid rgba(226,184,78,.28)',color:g,fontFamily:'"Outfit",sans-serif',fontSize:'.78rem',letterSpacing:'.1em',padding:'13px',cursor:extraLoading?'default':'pointer',borderRadius:6,transition:'all .3s',textTransform:'uppercase',fontWeight:400}}>✦  조언 듣기</button>}
            {aiMsg&&<button onClick={()=>{
              const firstSentence=aiMsg.split(/[.!?]/)[0].trim();
              const text=`🔮 HERMIT HOUSE 타로 리딩\n\n"${firstSentence}."\n\n#타로 #타로리딩\nhttps://hermithouse.vercel.app`;
              const url=`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
              if(window.gtag) window.gtag('event','share_x',{category:qInfo?.cat});
              window.open(url,'_blank');
            }} style={{width:'100%',background:'transparent',border:'1px solid rgba(255,255,255,.12)',color:dark?'rgba(255,255,255,.6)':'rgba(40,40,40,.6)',fontFamily:'"Outfit",sans-serif',fontSize:'.75rem',letterSpacing:'.14em',padding:'11px',cursor:'pointer',borderRadius:6,transition:'all .3s',textTransform:'uppercase',fontWeight:300}}>𝕏  공유하기</button>}
            <button className="rs" onClick={reset} style={{width:'100%',background:'transparent',border:'1px solid rgba(226,184,78,.15)',color:gd,fontFamily:'"Outfit",sans-serif',fontSize:'.75rem',letterSpacing:'.16em',padding:'11px',cursor:'pointer',borderRadius:6,transition:'all .3s',textTransform:'uppercase',fontWeight:300}}>↩  새로운 질문</button>
          </div>
        </>}
        <div style={{textAlign:'center',marginTop:60,fontFamily:'"Noto Sans KR",sans-serif',fontSize:'.8rem',letterSpacing:'.14em',color:dark?'rgba(160,130,50,.38)':'rgba(120,90,20,.35)',fontWeight:300}}>카드는 안내할 뿐, 선택은 당신의 것</div>
      </div>
    </div>
  </>);
}
