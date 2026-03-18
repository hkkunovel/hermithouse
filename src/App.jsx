import { useState } from "react";

// ── helpers ──
const C=(bg,ac,els)=><svg viewBox="0 0 80 120" style={{width:'100%',height:'100%',display:'block'}}><rect width="80" height="120" fill={bg} rx="4"/><rect x="3" y="3" width="74" height="114" rx="3" fill="none" stroke={ac} strokeWidth="0.6" opacity="0.4"/>{els}<rect x="6" y="6" width="68" height="108" rx="2" fill="none" stroke={ac} strokeWidth="0.3" opacity="0.2"/></svg>;
const lb=(t,c)=><text key="lb" x="40" y="113" textAnchor="middle" fill={c} fontSize="5.2" fontFamily="'Outfit',sans-serif" letterSpacing="0.7" opacity="0.85">{t}</text>;
const sR=(cx,cy,r,c)=>[<circle key="s0" cx={cx} cy={cy} r={r*0.44} fill={c} opacity="0.9"/>,<circle key="s1" cx={cx} cy={cy} r={r} fill="none" stroke={c} strokeWidth="0.8" opacity="0.5"/>,...[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i)=><line key={i} x1={cx+(r*.54)*Math.cos(a*Math.PI/180)} y1={cy+(r*.54)*Math.sin(a*Math.PI/180)} x2={cx+r*Math.cos(a*Math.PI/180)} y2={cy+r*Math.sin(a*Math.PI/180)} stroke={c} strokeWidth="0.8"/>)];
const s5=(cx,cy,r,c,op=0.85)=>{const p=[0,72,144,216,288].map(a=>({x:cx+r*Math.cos((a-90)*Math.PI/180),y:cy+r*Math.sin((a-90)*Math.PI/180)}));const q=[36,108,180,252,324].map(a=>({x:cx+r*.4*Math.cos((a-90)*Math.PI/180),y:cy+r*.4*Math.sin((a-90)*Math.PI/180)}));const d=p.flatMap((pt,i)=>[pt,q[i]]).map((pt,i)=>`${i===0?'M':'L'}${pt.x},${pt.y}`).join(' ')+'Z';return <path key={`s5${cx}${cy}`} d={d} fill={c} opacity={op}/>;};
const cR=(cx,cy,w,h,c)=><path key={`cr${cx}${cy}`} d={`M${cx-w/2} ${cy+h} L${cx-w/2} ${cy} L${cx-w/4} ${cy+h/3} L${cx} ${cy-h/4} L${cx+w/4} ${cy+h/3} L${cx+w/2} ${cy} L${cx+w/2} ${cy+h} Z`} fill="none" stroke={c} strokeWidth="1.2"/>;
const cU=(cx,cy,c)=><path key={`cu${cx}${cy}`} d={`M${cx-9} ${cy} Q${cx-9} ${cy-14} ${cx} ${cy-16} Q${cx+9} ${cy-14} ${cx+9} ${cy} L${cx+8} ${cy+12} L${cx-8} ${cy+12} Z`} fill="none" stroke={c} strokeWidth="1.2"/>;
const sW=(cx,cy,l,c)=>[<line key={`sa${cx}${cy}`} x1={cx} y1={cy-l/2} x2={cx} y2={cy+l/2} stroke={c} strokeWidth="1.8"/>,<line key={`sg${cx}${cy}`} x1={cx-8} y1={cy+l/6} x2={cx+8} y2={cy+l/6} stroke={c} strokeWidth="1.2"/>,<path key={`sh${cx}${cy}`} d={`M${cx-3} ${cy-l/2} L${cx} ${cy-l/2-5} L${cx+3} ${cy-l/2}`} fill={c}/>];
const pN=(cx,cy,r,c)=>{const p=[0,72,144,216,288].map(a=>({x:cx+r*Math.cos((a-90)*Math.PI/180),y:cy+r*Math.sin((a-90)*Math.PI/180)}));const q=[36,108,180,252,324].map(a=>({x:cx+r*.4*Math.cos((a-90)*Math.PI/180),y:cy+r*.4*Math.sin((a-90)*Math.PI/180)}));const d=p.flatMap((pt,i)=>[pt,q[i]]).map((pt,i)=>`${i===0?'M':'L'}${pt.x},${pt.y}`).join(' ')+'Z';return [<circle key={`pa${cx}${cy}`} cx={cx} cy={cy} r={r+3} fill="none" stroke={c} strokeWidth="1"/>,<path key={`pb${cx}${cy}`} d={d} fill="none" stroke={c} strokeWidth="1"/>];};
const wN=(cx,cy,l,c)=>[<line key={`wa${cx}${cy}`} x1={cx} y1={cy-l/2} x2={cx} y2={cy+l/2} stroke={c} strokeWidth="2.2"/>,<line key={`wb${cx}${cy}`} x1={cx} y1={cy-l/4} x2={cx-8} y2={cy-l/4-6} stroke={c} strokeWidth="1.2"/>,<line key={`wc${cx}${cy}`} x1={cx} y1={cy-l/4} x2={cx+8} y2={cy-l/4-6} stroke={c} strokeWidth="1.2"/>,<line key={`wd${cx}${cy}`} x1={cx} y1={cy} x2={cx-8} y2={cy-6} stroke={c} strokeWidth="1"/>,<line key={`we${cx}${cy}`} x1={cx} y1={cy} x2={cx+8} y2={cy-6} stroke={c} strokeWidth="1"/>,<circle key={`wf${cx}${cy}`} cx={cx} cy={cy-l/2-3} r="3" fill={c} opacity="0.8"/>];
const mN=(cx,cy,r,c)=><path key={`mn${cx}${cy}`} d={`M${cx+r*.3} ${cy-r} Q${cx-r*1.2} ${cy} ${cx+r*.3} ${cy+r} Q${cx-r*.8} ${cy+r*.5} ${cx-r*.8} ${cy} Q${cx-r*.8} ${cy-r*.5} ${cx+r*.3} ${cy-r}Z`} fill={c} opacity="0.85"/>;
const body=(c)=><path key="body" d="M29 47 L22 80 L40 72 L58 80 L51 47" fill="none" stroke={c} strokeWidth="1.4"/>;
const head=(c)=><circle key="head" cx="40" cy="36" r="11" fill="none" stroke={c} strokeWidth="1.4"/>;

const G='#e8c84a',B='#6ab0e8',R='#e86848',Gr='#7ad870',P='#c090e8';

// ── MAJOR 22 ──
const MAJOR=[
  {name:'The Fool',kr:'바보',reading:'새로운 시작의 에너지가 감돌고 있습니다. 두려움 없이 앞으로 나아가는 용기가 필요한 시점이며, 순수한 마음으로 가능성을 열어두세요.',svg:C('#1a0e2e',P,[...sR(40,38,14,P),<path key="p" d="M26 58 Q40 50 54 58 Q40 65 26 58Z" fill={P} opacity="0.4"/>,lb('THE FOOL',P)])},
  {name:'The Magician',kr:'마법사',reading:'당신에게는 상황을 변화시킬 능력과 자원이 이미 갖춰져 있습니다. 의지와 집중력을 한곳에 모으면 원하는 것을 현실로 만들 수 있습니다.',svg:C('#1e0e18',P,[<path key="inf" d="M30 22 Q40 15 50 22 Q40 29 30 22Z" fill={P} opacity="0.6"/>,<circle key="c" cx="40" cy="42" r="12" fill="none" stroke={P} strokeWidth="1.2"/>,<line key="v" x1="40" y1="30" x2="40" y2="54" stroke={P} strokeWidth="1"/>,<line key="h" x1="28" y1="42" x2="52" y2="42" stroke={P} strokeWidth="1"/>,<circle key="d" cx="40" cy="42" r="3" fill={P} opacity="0.7"/>,lb('THE MAGICIAN',P)])},
  {name:'The High Priestess',kr:'여사제',reading:'표면에 드러나지 않은 진실이 있습니다. 직관을 믿고 내면의 목소리에 귀 기울이세요. 서두르지 않고 기다리는 것이 가장 현명한 선택일 수 있습니다.',svg:C('#080e20',B,[mN(40,38,14,B),<rect key="r1" x="16" y="64" width="8" height="28" rx="1" fill="none" stroke={B} strokeWidth="1"/>,<rect key="r2" x="56" y="64" width="8" height="28" rx="1" fill="none" stroke={B} strokeWidth="1"/>,lb('HIGH PRIESTESS',B)])},
  {name:'The Empress',kr:'여황제',reading:'풍요와 성장의 에너지가 흐르고 있습니다. 창조적인 힘이 충만하며 노력이 결실을 맺을 시기입니다.',svg:C('#0e1e0e',Gr,[<circle key="c1" cx="40" cy="35" r="15" fill="rgba(122,216,112,.15)" stroke={Gr} strokeWidth="1.2"/>,<circle key="c2" cx="40" cy="35" r="7" fill={Gr} opacity="0.5"/>,...[28,40,52].map((x,i)=><circle key={i} cx={x} cy="62" r="4" fill={Gr} opacity="0.7"/>),...[28,40,52].map((x,i)=><circle key={`s${i}`} cx={x} cy="74" r="5" fill="none" stroke={Gr} strokeWidth=".8" opacity=".4"/>),lb('THE EMPRESS',Gr)])},
  {name:'The Emperor',kr:'황제',reading:'안정적인 기반과 명확한 방향이 필요합니다. 감정보다 이성과 논리로 접근할 때 더 나은 결과를 얻을 수 있습니다.',svg:C('#200808',G,[cR(40,28,28,18,G),<rect key="r" x="26" y="50" width="28" height="36" rx="1" fill="none" stroke={G} strokeWidth="1.2"/>,lb('THE EMPEROR',G)])},
  {name:'The Hierophant',kr:'교황',reading:'검증된 방식과 신뢰할 수 있는 조언이 도움이 됩니다. 경험 많은 이의 지혜를 구하는 것이 현명합니다.',svg:C('#14081e',G,[<line key="v" x1="40" y1="12" x2="40" y2="34" stroke={G} strokeWidth="2.2"/>,<line key="h1" x1="30" y1="17" x2="50" y2="17" stroke={G} strokeWidth="1.5"/>,<line key="h2" x1="32" y1="23" x2="48" y2="23" stroke={G} strokeWidth="1.2"/>,...[22,58].map((x,i)=><rect key={i} x={x} y="56" width="9" height="30" rx="1" fill="none" stroke={G} strokeWidth="1"/>),lb('THE HIEROPHANT',G)])},
  {name:'The Lovers',kr:'연인',reading:'중요한 선택의 기로에 서 있습니다. 가슴이 이끄는 방향을 따르되, 그 선택의 책임 또한 온전히 받아들일 준비가 되어 있어야 합니다.',svg:C('#180e28',P,[s5(40,20,10,P),<circle key="c1" cx="28" cy="55" r="11" fill="rgba(192,144,232,.2)" stroke={P} strokeWidth="1.2"/>,<circle key="c2" cx="52" cy="55" r="11" fill="rgba(192,144,232,.2)" stroke={P} strokeWidth="1.2"/>,<path key="hrt" d="M40 72 Q34 66 34 61 Q34 56 40 58 Q46 56 46 61 Q46 66 40 72Z" fill={P} opacity=".6"/>,lb('THE LOVERS',P)])},
  {name:'The Chariot',kr:'전차',reading:'강한 의지와 집중으로 앞으로 나아가야 할 때입니다. 방향을 잃지 않으면 반드시 승리할 수 있습니다.',svg:C('#081830',B,[<rect key="r" x="18" y="42" width="44" height="34" rx="2" fill="none" stroke={B} strokeWidth="1.4"/>,<path key="top" d="M18 42 L18 32 L62 32 L62 42" fill="none" stroke={B} strokeWidth="1.2"/>,...[28,52].map((x,i)=><circle key={i} cx={x} cy="82" r="7" fill="none" stroke={B} strokeWidth="1.2"/>),lb('THE CHARIOT',B)])},
  {name:'Strength',kr:'힘',reading:'진정한 힘은 내면에서 나옵니다. 인내와 부드러운 용기로 상황을 다스릴 수 있습니다.',svg:C('#1e1000',G,[<path key="inf" d="M26 18 Q40 10 54 18 Q40 26 26 18Z" fill={G} opacity="0.6"/>,<ellipse key="e" cx="40" cy="50" rx="18" ry="14" fill="none" stroke={G} strokeWidth="1.4"/>,<path key="j" d="M27 54 Q40 62 53 54" fill="none" stroke={G} strokeWidth="1.2"/>,lb('STRENGTH',G)])},
  {name:'The Hermit',kr:'은둔자',reading:'혼자만의 시간과 깊은 성찰이 필요한 시기입니다. 고요함 속에서 원하는 답을 발견하게 될 것입니다.',svg:C('#0c0c1a',B,[s5(40,22,9,B,0.9),<line key="st" x1="38" y1="34" x2="34" y2="90" stroke={B} strokeWidth="2.2"/>,<line key="am" x1="34" y1="55" x2="24" y2="66" stroke={B} strokeWidth="1.5"/>,lb('THE HERMIT',B)])},
  {name:'Wheel of Fortune',kr:'운명의 수레바퀴',reading:'변화의 바람이 불고 있습니다. 변화에 유연하게 적응한다면 새로운 기회가 열릴 것입니다.',svg:C('#120820',P,[<circle key="c1" cx="40" cy="55" r="30" fill="none" stroke={P} strokeWidth="1.4"/>,<circle key="c2" cx="40" cy="55" r="20" fill="none" stroke={P} strokeWidth="1"/>,<circle key="c3" cx="40" cy="55" r="6" fill={P} opacity="0.5"/>,...[0,45,90,135,180,225,270,315].map((a,i)=><line key={i} x1={40+6*Math.cos(a*Math.PI/180)} y1={55+6*Math.sin(a*Math.PI/180)} x2={40+20*Math.cos(a*Math.PI/180)} y2={55+20*Math.sin(a*Math.PI/180)} stroke={P} strokeWidth="0.9"/>),lb('WHEEL·FORTUNE',P)])},
  {name:'Justice',kr:'정의',reading:'모든 행동에는 그에 상응하는 결과가 따릅니다. 진실하고 공정하게 행동하는 것이 장기적으로 가장 유리합니다.',svg:C('#180808',G,[<line key="v" x1="40" y1="14" x2="40" y2="96" stroke={G} strokeWidth="1.8"/>,<line key="h" x1="22" y1="40" x2="58" y2="40" stroke={G} strokeWidth="1.8"/>,<line key="l1" x1="22" y1="40" x2="16" y2="62" stroke={G} strokeWidth="1.2"/>,<line key="l2" x1="16" y1="62" x2="28" y2="62" stroke={G} strokeWidth="1.2"/>,<line key="r1" x1="58" y1="40" x2="64" y2="62" stroke={G} strokeWidth="1.2"/>,<line key="r2" x1="58" y1="62" x2="70" y2="62" stroke={G} strokeWidth="1.2"/>,lb('JUSTICE',G)])},
  {name:'The Hanged Man',kr:'매달린 남자',reading:'잠시 멈추고 다른 시각으로 바라볼 때입니다. 내려놓음으로써 더 큰 통찰을 얻을 수 있습니다.',svg:C('#081810',Gr,[<line key="h" x1="18" y1="18" x2="62" y2="18" stroke={Gr} strokeWidth="2"/>,<line key="l1" x1="18" y1="18" x2="18" y2="40" stroke={Gr} strokeWidth="1.5"/>,<line key="l2" x1="62" y1="18" x2="62" y2="40" stroke={Gr} strokeWidth="1.5"/>,<line key="rp" x1="40" y1="18" x2="40" y2="36" stroke={Gr} strokeWidth="1.4"/>,<circle key="hd" cx="40" cy="44" r="9" fill="none" stroke={Gr} strokeWidth="1.4"/>,<line key="b1" x1="34" y1="53" x2="28" y2="76" stroke={Gr} strokeWidth="1.4"/>,<line key="b2" x1="46" y1="53" x2="52" y2="76" stroke={Gr} strokeWidth="1.4"/>,lb('THE HANGED MAN',Gr)])},
  {name:'Death',kr:'죽음',reading:'끝맺음이 있어야 새로운 시작이 가능합니다. 낡은 것을 내려놓는 용기가 필요한 시기입니다.',svg:C('#080808','#909090',[<path key="sk" d="M30 28 Q30 14 40 14 Q50 14 50 28 Q50 36 46 38 L46 44 L34 44 L34 38 Q30 36 30 28Z" fill="rgba(144,144,144,.18)" stroke="#909090" strokeWidth="1.4"/>,...[35,40,45].map((x,i)=><line key={i} x1={x} y1="44" x2={x} y2="50" stroke="#909090" strokeWidth="1.2"/>),<path key="w" d="M16 68 Q24 60 32 68 Q40 76 48 68 Q56 60 64 68" fill="rgba(144,144,144,.12)" stroke="#909090" strokeWidth="1.4"/>,<circle key="eye1" cx="36" cy="26" r="2.5" fill="#909090" opacity=".7"/>,<circle key="eye2" cx="44" cy="26" r="2.5" fill="#909090" opacity=".7"/>,lb('DEATH','#909090')])},
  {name:'Temperance',kr:'절제',reading:'균형과 조화가 핵심입니다. 서두르지 않고 차분하게 조율해 나간다면 원하는 결과에 도달할 수 있습니다.',svg:C('#080e18',B,[s5(40,18,9,B),<ellipse key="e1" cx="28" cy="65" rx="10" ry="16" fill="none" stroke={B} strokeWidth="1.2"/>,<ellipse key="e2" cx="52" cy="65" rx="10" ry="16" fill="none" stroke={B} strokeWidth="1.2"/>,<path key="f1" d="M38 54 Q40 48 42 54" fill="none" stroke={B} strokeWidth="1" strokeDasharray="3,2"/>,<path key="f2" d="M38 76 Q40 82 42 76" fill="none" stroke={B} strokeWidth="1" strokeDasharray="3,2"/>,lb('TEMPERANCE',B)])},
  {name:'The Devil',kr:'악마',reading:'무언가에 지나치게 얽매여 있지는 않은지 돌아보세요. 그 사슬을 인식하는 순간, 이미 벗어날 힘이 생깁니다.',svg:C('#100800',R,[<path key="hn" d="M26 30 L20 14 L32 26 M54 30 L60 14 L48 26" fill="none" stroke={R} strokeWidth="1.6"/>,<circle key="hd" cx="40" cy="36" r="12" fill="rgba(232,104,72,.2)" stroke={R} strokeWidth="1.4"/>,<circle key="hdi" cx="40" cy="36" r="5" fill={R} opacity=".4"/>,...[[28,78],[52,78]].map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="5" fill="rgba(232,104,72,.25)" stroke={R} strokeWidth="1"/>),<line key="ch" x1="28" y1="73" x2="52" y2="73" stroke={R} strokeWidth="1" strokeDasharray="3,2"/>,lb('THE DEVIL',R)])},
  {name:'The Tower',kr:'탑',reading:'예상치 못한 변화나 충격이 올 수 있습니다. 혼란 속에서도 중심을 잃지 않으면 더 단단한 토대를 만드는 과정이 됩니다.',svg:C('#100808',R,[<rect key="tw" x="28" y="28" width="24" height="56" rx="1" fill="rgba(232,104,72,.1)" stroke={R} strokeWidth="1.4"/>,<path key="tp" d="M26 28 L40 14 L54 28" fill="rgba(232,104,72,.2)" stroke={R} strokeWidth="1.4"/>,<path key="ck" d="M54 28 L62 18 L58 22 L66 12 L60 17 L64 8" fill="none" stroke={R} strokeWidth="2" opacity=".9"/>,<circle key="fr" cx="40" cy="14" r="5" fill={R} opacity="0.7"/>,...[[14,50],[66,42],[12,66],[68,66]].map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill={R} opacity="0.7"/>),lb('THE TOWER',R)])},
  {name:'The Star',kr:'별',reading:'희망의 빛이 어둠을 밝히고 있습니다. 치유와 회복의 에너지가 흐르는 시기이니 자신을 믿고 앞으로 나아가세요.',svg:C('#04080e',B,[s5(40,24,12,B),...[[14,26],[66,22],[10,52],[70,50],[16,76],[64,74]].map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="2" fill={B} opacity="0.6"/>),<path key="wt" d="M20 88 Q30 82 40 88 Q50 94 60 88 L60 100 L20 100 Z" fill="rgba(106,176,232,.2)" stroke={B} strokeWidth="1.2"/>,lb('THE STAR',B)])},
  {name:'The Moon',kr:'달',reading:'모든 것이 명확하게 보이지 않는 시기입니다. 섣불리 판단하지 말고 진실이 서서히 드러날 때를 기다리세요.',svg:C('#06060e','#9090c0',[mN(40,34,16,'#9090c0'),<path key="wv" d="M16 78 Q24 70 32 78 Q40 86 48 78 Q56 70 64 78" fill="rgba(144,144,192,.18)" stroke="#9090c0" strokeWidth="1.2"/>,...[[24,94],[56,94]].map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="5" fill="rgba(144,144,192,.25)" stroke="#9090c0" strokeWidth="1"/>),lb('THE MOON','#9090c0')])},
  {name:'The Sun',kr:'태양',reading:'밝고 긍정적인 에너지가 가득합니다. 노력이 빛을 발하고 기쁨과 성공이 찾아오는 시기입니다.',svg:C('#180e00',G,[<circle key="sc" cx="40" cy="44" r="12" fill={G} opacity="0.55"/>,<circle key="sg" cx="40" cy="44" r="7" fill={G} opacity="0.9"/>,...sR(40,44,20,G),<path key="bn" d="M24 76 Q40 68 56 76" fill="none" stroke={G} strokeWidth="1.2"/>,lb('THE SUN',G)])},
  {name:'Judgement',kr:'심판',reading:'과거를 돌아보고 진정한 자신의 소명을 깨달을 시기입니다. 깨어남의 순간이 다가오고 있습니다.',svg:C('#080e14',B,[<path key="cl" d="M22 22 Q22 14 32 14 Q34 8 42 10 Q50 6 54 14 Q62 14 60 22 Z" fill="rgba(106,176,232,.25)" stroke={B} strokeWidth="1.2"/>,<path key="cr" d="M20 60 L20 90 L32 82 L32 90 L40 82 L40 90 L48 82 L48 90 L60 82 L60 60" fill="rgba(106,176,232,.1)" stroke={B} strokeWidth="1.2"/>,...[[26,56],[40,52],[54,56]].map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="6" fill="rgba(106,176,232,.3)" stroke={B} strokeWidth="1"/>),lb('JUDGEMENT',B)])},
  {name:'The World',kr:'세계',reading:'한 사이클이 완성되는 축복받은 시기입니다. 노력이 결실을 맺고 성취감과 충만함이 찾아옵니다.',svg:C('#061006',Gr,[<ellipse key="e1" cx="40" cy="60" rx="26" ry="38" fill="rgba(122,216,112,.08)" stroke={Gr} strokeWidth="1.4"/>,<ellipse key="e2" cx="40" cy="60" rx="16" ry="26" fill="rgba(122,216,112,.12)" stroke={Gr} strokeWidth="0.8" opacity="0.5"/>,<circle key="c" cx="40" cy="60" r="8" fill={Gr} opacity=".4" stroke={Gr} strokeWidth="1"/>,...[[18,24],[62,24],[18,96],[62,96]].map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="5" fill={Gr} opacity=".35" stroke={Gr} strokeWidth="1.2"/>),lb('THE WORLD',Gr)])},
];

// ── MINOR suits generator ──
const mkSuit=(suit,bg,ac,cards)=>cards.map(w=>({name:`${w.n} of ${suit}`,kr:w.kr,reading:w.r,svg:C(bg,ac,[...(w.e.flat?w.e.flat():[w.e]),lb(`${w.n}·${suit.slice(0,5).toUpperCase()}`,ac)])}));

const WANDS=mkSuit('Wands','#1e0800',R,[
  {n:'Ace',kr:'지팡이 에이스',r:'열정적인 새 출발의 에너지가 타오르고 있습니다. 오랫동안 품어온 아이디어나 프로젝트를 시작하기에 최적의 시기입니다.',e:[...wN(40,52,56,R),s5(40,18,8,R,0.8)]},
  {n:'II',kr:'지팡이 2',r:'계획을 세우고 미래를 내다보는 시기입니다. 더 큰 그림을 그리는 용감한 결단이 새로운 지평을 열어줍니다.',e:[...wN(26,52,56,R),...wN(54,52,56,R),<circle key="g" cx="40" cy="50" r="12" fill="none" stroke={R} strokeWidth="1"/>]},
  {n:'III',kr:'지팡이 3',r:'이미 내딛은 첫걸음이 결실을 맺기 시작합니다. 멀리 바라보는 시선이 더 큰 성공을 이끌어줄 것입니다.',e:[...wN(26,52,56,R),...wN(40,52,56,R),...wN(54,52,56,R)]},
  {n:'IV',kr:'지팡이 4',r:'축하와 안정의 에너지가 흐릅니다. 중요한 단계를 완성했거나 곧 완성하게 될 것입니다.',e:[...wN(18,52,56,R),...wN(34,52,56,R),...wN(50,52,56,R),...wN(66,52,56,R),<path key="g" d="M18 30 Q40 22 62 30" fill="none" stroke={R} strokeWidth="1.2"/>]},
  {n:'V',kr:'지팡이 5',r:'갈등과 경쟁이 있는 시기입니다. 자신의 입장을 명확히 하고 에너지를 낭비하지 않도록 주의하세요.',e:[<line key="a" x1="20" y1="20" x2="58" y2="80" stroke={R} strokeWidth="2.2"/>,<line key="b" x1="60" y1="20" x2="22" y2="80" stroke={R} strokeWidth="2.2"/>,<line key="c" x1="40" y1="14" x2="40" y2="90" stroke={R} strokeWidth="2.2"/>,<line key="d" x1="12" y1="50" x2="72" y2="60" stroke={R} strokeWidth="2"/>,<line key="e" x1="14" y1="70" x2="70" y2="38" stroke={R} strokeWidth="2"/>]},
  {n:'VI',kr:'지팡이 6',r:'승리와 인정이 찾아오는 시기입니다. 자신감을 갖되 겸손함을 잃지 마세요.',e:[[18,28,38,48,58,68].map((x,i)=><line key={i} x1={x} y1="16" x2={x} y2="96" stroke={R} strokeWidth="2.2"/>),<path key="l" d="M26 32 L54 32" stroke={R} strokeWidth="1.4"/>]},
  {n:'VII',kr:'지팡이 7',r:'도전과 압박에 맞서야 하는 시기입니다. 자신의 위치를 지키며 흔들리지 않는 것이 중요합니다.',e:[...wN(40,44,56,R),...[20,30,50,60,24,56].map((x,i)=><line key={i} x1={x} y1={[56,62,56,62,74,74][i]} x2={x+12} y2={[76,82,76,82,94,94][i]} stroke={R} strokeWidth="1.8"/>)]},
  {n:'VIII',kr:'지팡이 8',r:'빠른 진전과 움직임이 있는 시기입니다. 기다리던 기회가 빠르게 다가오고 있습니다.',e:[14,24,34,44,54,64,74,82].map((x,i)=><line key={i} x1={x+4} y1="20" x2={x} y2="88" stroke={R} strokeWidth="2"/>)},
  {n:'IX',kr:'지팡이 9',r:'지쳐있지만 아직 포기하기엔 이릅니다. 마지막 한 걸음을 위한 용기를 내세요.',e:[...wN(40,50,60,R),...[16,24,32,56,64,72,20,28].map((x,i)=><line key={i} x1={x} y1="26" x2={x-4} y2="86" stroke={R} strokeWidth="1.6"/>)]},
  {n:'X',kr:'지팡이 10',r:'너무 많은 짐을 지고 있지는 않은지 돌아보세요. 덜어낼 것은 덜어내는 용기가 필요합니다.',e:[12,20,28,36,44,52,60,68,76,84].map((x,i)=><line key={i} x1={x} y1="18" x2={x-5} y2="96" stroke={R} strokeWidth="1.8"/>)},
  {n:'Page',kr:'지팡이 시종',r:'새로운 아이디어와 열정이 넘칩니다. 순수한 호기심을 믿고 나아가세요.',e:[...wN(40,50,58,R),cR(40,24,22,14,R)]},
  {n:'Knight',kr:'지팡이 기사',r:'열정과 행동력이 넘치는 시기입니다. 에너지를 올바른 곳에 집중하면 놀라운 결과를 만들 수 있습니다.',e:[head(R),body(R),<line key="ln" x1="58" y1="22" x2="74" y2="8" stroke={R} strokeWidth="2.4"/>]},
  {n:'Queen',kr:'지팡이 여왕',r:'카리스마와 창의력이 빛나는 시기입니다. 자신만의 방식으로 상황을 이끌어 나가세요.',e:[cR(40,18,26,16,R),head(R),body(R)]},
  {n:'King',kr:'지팡이 왕',r:'비전과 리더십이 필요한 시기입니다. 용감하게 결단하고 앞장서세요.',e:[cR(40,16,28,18,R),head(R),body(R),...wN(62,46,32,R)]},
]);

const CUPS=mkSuit('Cups','#001428',B,[
  {n:'Ace',kr:'컵 에이스',r:'새로운 감정과 관계의 시작을 알립니다. 마음을 열면 사랑과 기쁨이 넘치는 새로운 인연이 흘러들어올 것입니다.',e:[cU(40,64,B),<path key="dv" d="M34 36 Q40 28 46 36 Q40 42 34 36Z" fill={B} opacity="0.7"/>,...[[28,52],[40,46],[52,52]].map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="2" fill={B} opacity="0.6"/>)]},
  {n:'II',kr:'컵 2',r:'깊은 연결과 조화로운 관계가 형성됩니다. 마음을 열고 다가가세요.',e:[cU(28,68,B),cU(52,68,B),<circle key="gl1" cx="28" cy="53" r="5" fill={B} opacity=".25"/>,<circle key="gl2" cx="52" cy="53" r="5" fill={B} opacity=".25"/>,<path key="ac" d="M37 52 Q40 44 43 52" fill="none" stroke={B} strokeWidth="1.4"/>,<path key="hrt" d="M40 62 Q35 56 35 52 Q35 48 40 50 Q45 48 45 52 Q45 56 40 62Z" fill={B} opacity=".5"/>]},
  {n:'III',kr:'컵 3',r:'우정과 축하의 에너지가 넘칩니다. 소중한 사람들과 함께하는 시간이 큰 기쁨을 줍니다.',e:[cU(22,72,B),cU(40,68,B),cU(58,72,B),<circle key="f1" cx="22" cy="56" r="6" fill={B} opacity=".25" stroke={B} strokeWidth=".8"/>,<circle key="f2" cx="40" cy="50" r="6" fill={B} opacity=".25" stroke={B} strokeWidth=".8"/>,<circle key="f3" cx="58" cy="56" r="6" fill={B} opacity=".25" stroke={B} strokeWidth=".8"/>,s5(22,30,7,B,0.5),s5(40,24,7,B,0.5),s5(58,30,7,B,0.5)]},
  {n:'IV',kr:'컵 4',r:'무언가에 지쳐 무감각해진 상태일 수 있습니다. 눈앞에 주어진 기회를 놓치지 않도록 주의하세요.',e:[<circle key="hd" cx="40" cy="32" r="9" fill="none" stroke={B} strokeWidth="1.2"/>,<path key="bd" d="M32 41 L28 70 L40 64 L52 70 L48 41" fill="none" stroke={B} strokeWidth="1.2"/>,<line key="lk" x1="32" y1="56" x2="28" y2="56" stroke={B} strokeWidth="1"/>,<line key="rk" x1="48" y1="56" x2="52" y2="56" stroke={B} strokeWidth="1"/>,cU(18,88,B),cU(36,90,B),cU(54,90,B),<path key="ck" d="M64 42 Q72 36 68 28" fill="none" stroke={B} strokeWidth="1" strokeDasharray="2,2" opacity=".6"/>,<path key="ck2" d="M68 28 L65 25 L72 25 Z" fill={B} opacity=".5"/>]},
  {n:'V',kr:'컵 5',r:'상실과 실망의 감정이 있을 수 있습니다. 잃은 것보다 아직 남아있는 것들을 돌아보세요.',e:[<path key="sp1" d="M22 72 L16 90 L28 90 Z" fill="rgba(106,176,232,.2)" stroke={B} strokeWidth="1"/>,<path key="sp2" d="M36 72 L30 90 L42 90 Z" fill="rgba(106,176,232,.2)" stroke={B} strokeWidth="1"/>,<path key="sp3" d="M50 72 L44 90 L56 90 Z" fill="rgba(106,176,232,.2)" stroke={B} strokeWidth="1"/>,<path key="drp" d="M28 85 Q32 96 36 88" fill="none" stroke={B} strokeWidth=".8" opacity=".5"/>,cU(14,42,B),cU(60,42,B),<circle key="wt" cx="14" cy="60" r="4" fill={B} opacity=".3"/>,<circle key="wt2" cx="60" cy="60" r="4" fill={B} opacity=".3"/>]},
  {n:'VI',kr:'컵 6',r:'과거의 기억과 인연이 현재에 영향을 미치고 있습니다. 따뜻한 기억이 앞으로 나아갈 힘을 줍니다.',e:[[12,48].flatMap(x=>[14,44,74].map((y,j)=><path key={`c${x}${y}`} d={`M${x} ${y+7} Q${x} ${y} ${x+9} ${y} Q${x+18} ${y} ${x+18} ${y+7} L${x+16} ${y+18} L${x+2} ${y+18} Z`} fill={`rgba(106,176,232,${0.15+j*0.06})`} stroke={B} strokeWidth="1"/>))]},
  {n:'VII',kr:'컵 7',r:'너무 많은 선택지가 혼란을 야기하고 있습니다. 진정으로 원하는 것이 무엇인지 명확히 해야 할 때입니다.',e:[[20,40,60,20,40,60,40].map((x,i)=>{const y=[12,10,12,40,38,40,68][i];const f=[.1,.25,.1,.15,.2,.15,.3][i];return <path key={i} d={`M${x-7} ${y+7} Q${x-7} ${y} ${x} ${y} Q${x+7} ${y} ${x+7} ${y+7} L${x+6} ${y+16} L${x-6} ${y+16} Z`} fill={`rgba(106,176,232,${f})`} stroke={B} strokeWidth="1"/>})]},
  {n:'VIII',kr:'컵 8',r:'더 이상 만족스럽지 않은 것을 뒤로하고 떠날 용기가 필요합니다.',e:[[16,28,40,52,64,22,34,46].map((x,i)=>{const y=i<5?72:84;return <path key={i} d={`M${x-7} ${y} Q${x-7} ${y-12} ${x} ${y-14} Q${x+7} ${y-12} ${x+7} ${y} L${x+6} ${y+8} L${x-6} ${y+8} Z`} fill="rgba(106,176,232,.15)" stroke={B} strokeWidth="1"/>}),mN(54,34,12,B),<line key="pt" x1="20" y1="90" x2="14" y2="60" stroke={B} strokeWidth="1.2" opacity=".5"/>]},
  {n:'IX',kr:'컵 9',r:'소망이 이루어지는 풍요로운 시기입니다. 감사한 마음으로 지금의 행복을 충분히 느끼세요.',e:[Array(9).fill(0).map((_,i)=>{const cx=16+28*(i%3),cy=26+30*Math.floor(i/3);return <path key={i} d={`M${cx-8} ${cy+9} Q${cx-8} ${cy} ${cx} ${cy} Q${cx+8} ${cy} ${cx+8} ${cy+9} L${cx+7} ${cy+20} L${cx-7} ${cy+20} Z`} fill="rgba(106,176,232,.2)" stroke={B} strokeWidth="1"/>})]},
  {n:'X',kr:'컵 10',r:'진정한 행복과 충만함이 찾아옵니다. 사랑하는 사람들과 함께하는 조화로운 삶이 이루어집니다.',e:[Array(10).fill(0).map((_,i)=>{const cx=i<5?13+12*i:19+12*(i-5),cy=i<5?22:44;return <path key={i} d={`M${cx-5} ${cy+6} Q${cx-5} ${cy} ${cx} ${cy} Q${cx+5} ${cy} ${cx+5} ${cy+6} L${cx+4} ${cy+14} L${cx-4} ${cy+14} Z`} fill="rgba(106,176,232,.2)" stroke={B} strokeWidth="1"/>}),<path key="rb" d="M14 64 Q40 48 66 64" fill="rgba(106,176,232,.12)" stroke={B} strokeWidth="1.4"/>]},
  {n:'Page',kr:'컵 시종',r:'창의적이고 감성적인 에너지가 넘칩니다. 마음이 이끄는 대로 표현하는 것이 새로운 길을 열어줍니다.',e:[cU(40,68,B),cR(40,24,22,14,B)]},
  {n:'Knight',kr:'컵 기사',r:'낭만적이고 이상적인 에너지가 흐릅니다. 진심 어린 마음으로 다가가면 원하는 것을 이룰 수 있습니다.',e:[head(B),body(B),cU(60,52,B)]},
  {n:'Queen',kr:'컵 여왕',r:'깊은 감수성과 직관이 강점이 되는 시기입니다. 경계를 지키면서도 사랑을 베푸세요.',e:[cR(40,18,26,16,B),head(B),body(B),cU(58,58,B)]},
  {n:'King',kr:'컵 왕',r:'감정과 이성의 균형을 유지하는 성숙함이 필요합니다. 따뜻한 마음을 잃지 않는 지혜가 상황을 이끌어 나갑니다.',e:[cR(40,16,28,18,B),head(B),body(B),cU(60,54,B)]},
]);

const SWORDS=(()=>{const S='#a0b0e0';return mkSuit('Swords','#080a1e',S,[
  {n:'Ace',kr:'검 에이스',r:'명확한 통찰과 진실이 드러나는 시기입니다. 두려움 없이 진실을 마주하면 돌파구가 열립니다.',e:[...sW(40,52,68,S),s5(40,18,9,S)]},
  {n:'II',kr:'검 2',r:'결정을 내리기 어려운 교착 상태에 놓여 있습니다. 진실을 직면할 용기가 올바른 선택을 가능하게 합니다.',e:[<line key="b1" x1="34" y1="20" x2="46" y2="88" stroke={S} strokeWidth="2"/>,<line key="b2" x1="46" y1="20" x2="34" y2="88" stroke={S} strokeWidth="2"/>]},
  {n:'III',kr:'검 3',r:'슬픔과 상처의 시간이 있을 수 있습니다. 이 아픔을 통해 더욱 단단해지고 깊어질 수 있습니다.',e:[...sW(40,52,60,S),<line key="s1" x1="26" y1="20" x2="54" y2="84" stroke={S} strokeWidth="2"/>,<line key="s2" x1="54" y1="20" x2="26" y2="84" stroke={S} strokeWidth="2"/>]},
  {n:'IV',kr:'검 4',r:'휴식과 회복이 필요한 시기입니다. 고요함 속에서 다음 단계를 위한 지혜가 쌓입니다.',e:[Array(4).fill(0).map((_,i)=><line key={i} x1={18+14*i} y1="22" x2={18+14*i} y2="90" stroke={S} strokeWidth="2"/>)]},
  {n:'V',kr:'검 5',r:'갈등 후 씁쓸한 승리가 있을 수 있습니다. 상처를 남기지 않는 방식을 선택하는 것이 진정한 지혜입니다.',e:[...sW(40,50,56,S),...[[22,62],[58,58]].map((p,i)=><line key={i} x1={p[0]} y1={p[1]} x2={p[0]+10} y2={p[1]+28} stroke={S} strokeWidth="1.6"/>)]},
  {n:'VI',kr:'검 6',r:'힘든 시기를 지나 보다 평온한 곳으로 나아가고 있습니다. 전진하는 것 자체가 치유입니다.',e:[<path key="bt" d="M14 86 Q38 56 68 66 L68 86 Z" fill="none" stroke={S} strokeWidth="1.4"/>,...Array(6).fill(0).map((_,i)=><line key={i} x1={24+8*i} y1="24" x2={24+8*i} y2="84" stroke={S} strokeWidth="1.8"/>)]},
  {n:'VII',kr:'검 7',r:'전략과 신중함이 필요한 시기입니다. 그러나 속임수나 회피는 결국 더 큰 문제를 만들 수 있습니다.',e:[[40,26,54,20,60,30,50].map((x,i)=>{const y=[18,26,26,38,38,50,50][i];return <line key={i} x1={x} y1={y} x2={x} y2={y+62} stroke={S} strokeWidth="1.8"/>})]},
  {n:'VIII',kr:'검 8',r:'스스로 만든 제약에 갇혀 있을 수 있습니다. 첫 번째 자유는 마음에서 시작됩니다.',e:[Array(8).fill(0).map((_,i)=><line key={i} x1={14+8*i} y1="16" x2={14+8*i} y2="90" stroke={S} strokeWidth="1.8"/>),<circle key="bd" cx="40" cy="56" r="14" fill="none" stroke={S} strokeWidth="1" strokeDasharray="4,3"/>]},
  {n:'IX',kr:'검 9',r:'불안과 걱정이 밤잠을 빼앗고 있을 수 있습니다. 믿을 수 있는 사람에게 마음을 털어놓는 것이 도움이 됩니다.',e:[Array(9).fill(0).map((_,i)=><line key={i} x1="16" y1={14+9*i} x2="64" y2={14+9*i} stroke={S} strokeWidth="1.6"/>)]},
  {n:'X',kr:'검 10',r:'고통스러운 끝맺음이 있을 수 있습니다. 어떤 끝도 새로운 시작의 씨앗을 품고 있으니 다시 일어날 힘을 믿으세요.',e:[Array(10).fill(0).map((_,i)=><line key={i} x1={15+7*i} y1="16" x2={15+7*i} y2="90" stroke={S} strokeWidth="1.8"/>)]},
  {n:'Page',kr:'검 시종',r:'날카로운 관찰력과 지적 호기심이 빛나는 시기입니다. 말보다 행동이 앞서도록 주의하세요.',e:[...sW(40,52,58,S),cR(40,24,22,14,S)]},
  {n:'Knight',kr:'검 기사',r:'빠르고 결단력 있는 행동이 필요한 시기입니다. 명확한 의도와 방향이 성공을 이끌어줍니다.',e:[head(S),body(S),...sW(62,44,32,S)]},
  {n:'Queen',kr:'검 여왕',r:'명확한 판단과 솔직한 소통이 필요합니다. 진실을 말하는 용기가 지금 가장 필요합니다.',e:[cR(40,18,26,16,S),head(S),body(S),...sW(62,44,32,S)]},
  {n:'King',kr:'검 왕',r:'이성과 논리로 상황을 이끌어야 할 때입니다. 감정보다 지성으로 접근하는 것이 현명합니다.',e:[cR(40,16,28,18,S),head(S),body(S),...sW(62,40,36,S)]},
]);})();

const PENTS=mkSuit('Pentacles','#060e06',Gr,[
  {n:'Ace',kr:'동전 에이스',r:'물질적이고 실질적인 새로운 기회가 찾아옵니다. 현실적인 계획과 꾸준한 노력이 풍요로운 결실을 맺게 합니다.',e:[<circle key="glow" cx="40" cy="52" r="24" fill="rgba(122,216,112,.1)"/>,...pN(40,52,18,Gr),<circle key="fill" cx="40" cy="52" r="8" fill={Gr} opacity=".3"/>]},
  {n:'II',kr:'동전 2',r:'여러 가지를 동시에 균형 있게 다루어야 하는 시기입니다. 변화에 적응하는 능력이 안정을 만들어냅니다.',e:[...pN(28,44,12,Gr),...pN(52,68,12,Gr),<path key="lp" d="M28 44 Q10 56 28 68 Q46 80 52 68 Q70 56 52 44 Q46 32 28 44Z" fill="none" stroke={Gr} strokeWidth="0.8" opacity="0.5"/>]},
  {n:'III',kr:'동전 3',r:'협력과 전문성이 빛을 발하는 시기입니다. 타인과 함께 성장하세요.',e:[<path key="ac" d="M16 80 L16 40 Q16 24 40 24 Q64 24 64 40 L64 80" fill="rgba(122,216,112,.08)" stroke={Gr} strokeWidth="1.2"/>,...pN(40,44,10,Gr),...pN(24,72,8,Gr),...pN(56,72,8,Gr),<circle key="f1" cx="40" cy="44" r="4" fill={Gr} opacity=".4"/>,<circle key="f2" cx="24" cy="72" r="3" fill={Gr} opacity=".4"/>,<circle key="f3" cx="56" cy="72" r="3" fill={Gr} opacity=".4"/>]},
  {n:'IV',kr:'동전 4',r:'안정을 원하는 마음이 집착이 되고 있지는 않은지 돌아보세요. 흐름을 막으면 성장도 멈춥니다.',e:[...pN(40,28,10,Gr),...pN(22,60,10,Gr),...pN(58,60,10,Gr),...pN(40,82,10,Gr),<circle key="f1" cx="40" cy="28" r="4" fill={Gr} opacity=".4"/>,<circle key="f2" cx="22" cy="60" r="4" fill={Gr} opacity=".4"/>,<circle key="f3" cx="58" cy="60" r="4" fill={Gr} opacity=".4"/>,<circle key="f4" cx="40" cy="82" r="4" fill={Gr} opacity=".4"/>,<rect key="fr" x="30" y="44" width="20" height="26" rx="2" fill="rgba(122,216,112,.08)" stroke={Gr} strokeWidth=".8"/>]},
  {n:'V',kr:'동전 5',r:'어려움과 결핍의 시기일 수 있습니다. 도움은 생각보다 가까이 있습니다.',e:[...pN(28,46,10,Gr),...pN(52,46,10,Gr),<rect key="wnd" x="24" y="58" width="32" height="44" rx="2" fill="none" stroke={Gr} strokeWidth=".8" opacity=".4"/>,<line key="wl" x1="40" y1="58" x2="40" y2="102" stroke={Gr} strokeWidth=".6" opacity=".3"/>,<line key="wh" x1="24" y1="80" x2="56" y2="80" stroke={Gr} strokeWidth=".6" opacity=".3"/>]},
  {n:'VI',kr:'동전 6',r:'주고받음의 균형이 중요한 시기입니다. 관대함으로 나누면 더 큰 풍요가 돌아옵니다.',e:[...pN(40,28,10,Gr),<circle key="fc" cx="40" cy="28" r="4" fill={Gr} opacity=".4"/>,...[[22,56],[58,56],[22,78],[58,78],[22,96],[58,96]].map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="4" fill={Gr} opacity="0.4"/>),...[[22,56],[58,56],[22,78],[58,78],[22,96],[58,96]].map((p,i)=><circle key={`r${i}`} cx={p[0]} cy={p[1]} r="7" fill="none" stroke={Gr} strokeWidth=".8" opacity=".4"/>)]},
  {n:'VII',kr:'동전 7',r:'꾸준한 노력이 천천히 결실을 맺고 있습니다. 지금의 노력이 나중에 풍요로운 수확으로 돌아올 것입니다.',e:[[20,40,60,20,40,60,40].flatMap((x,i)=>[...pN(x,[14,12,14,40,38,40,66][i],7,Gr),<circle key={`f${i}`} cx={x} cy={[14,12,14,40,38,40,66][i]} r="2.5" fill={Gr} opacity=".45"/>])]},
  {n:'VIII',kr:'동전 8',r:'집중적인 노력과 기술 연마의 시기입니다. 장인 정신이 탁월한 성과를 만들어냅니다.',e:[Array(8).fill(0).flatMap((_,i)=>{const cx=i%2===0?22:58,cy=12+18*Math.floor(i/2);return [...pN(cx,cy,7,Gr),<circle key={`f${i}`} cx={cx} cy={cy} r="2.5" fill={Gr} opacity=".4"/>];})]},
  {n:'IX',kr:'동전 9',r:'자립과 풍요를 누리는 시기입니다. 스스로의 힘으로 이룬 것들을 자랑스러워하세요.',e:[<circle key="bg" cx="40" cy="54" r="34" fill="rgba(122,216,112,.06)"/>,...[20,40,60,20,40,60,20,40,60].flatMap((x,i)=>[...pN(x,[14,12,14,36,34,36,58,56,58][i],7,Gr),<circle key={`f${i}`} cx={x} cy={[14,12,14,36,34,36,58,56,58][i]} r="2.5" fill={Gr} opacity=".45"/>])]},
  {n:'X',kr:'동전 10',r:'오랜 노력이 안정적이고 풍요로운 결실로 이어집니다. 지금의 행복을 소중히 여기세요.',e:[<circle key="bg" cx="40" cy="52" r="34" fill="rgba(122,216,112,.06)"/>,...[14,40,66,14,40,66,14,40,66,40].flatMap((x,i)=>[...pN(x,[16,16,16,42,42,42,68,68,68,90][i],7,Gr),<circle key={`f${i}`} cx={x} cy={[16,16,16,42,42,42,68,68,68,90][i]} r="2.5" fill={Gr} opacity=".45"/>])]},
  {n:'Page',kr:'동전 시종',r:'새로운 분야를 배우고 탐구하는 에너지가 충만합니다. 작은 시작이 큰 성장의 씨앗이 됩니다.',e:[...pN(40,52,14,Gr),cR(40,22,22,14,Gr)]},
  {n:'Knight',kr:'동전 기사',r:'꾸준함과 성실함이 빛을 발하는 시기입니다. 느리더라도 확실하게 나아가는 것이 최선입니다.',e:[head(Gr),body(Gr),...pN(62,52,10,Gr)]},
  {n:'Queen',kr:'동전 여왕',r:'실용적이고 따뜻한 에너지가 흐릅니다. 현실적인 지혜로 안정적인 환경을 만들어가세요.',e:[cR(40,18,26,16,Gr),head(Gr),body(Gr),...pN(60,56,10,Gr)]},
  {n:'King',kr:'동전 왕',r:'물질적 성공과 안정적인 리더십이 빛나는 시기입니다. 풍요로운 결실을 현명하게 관리하고 주변과 나누세요.',e:[cR(40,16,28,18,Gr),head(Gr),body(Gr),...pN(62,52,10,Gr)]},
]);

const CARDS=[...MAJOR,...WANDS,...CUPS,...SWORDS,...PENTS];
const POS=['과거','현재','미래'];

function pick3(){return [...CARDS].sort(()=>Math.random()-0.5).slice(0,3);}

function getSynthesis(cards, cat='기타', question=''){
  const catKey = cat.includes('연애') ? 'love' : cat.includes('직업') ? 'work' : 'etc';
  // 테마 분류 - 슈트 패턴 포함 전체 78장 커버
  const getT=n=>{
    if(['The Fool','Ace of Wands','Ace of Cups','Ace of Swords','Ace of Pentacles','The Star','The Sun','II of Wands','III of Wands','Page of Wands','Page of Cups','Page of Swords','Page of Pentacles'].includes(n))return'new';
    if(['Death','The Tower','X of Wands','III of Swords','IX of Swords','X of Swords','V of Cups','VIII of Cups'].includes(n))return'ending';
    if(['The Empress','Strength','The World','IX of Pentacles','X of Pentacles','X of Cups','IX of Cups','VI of Wands','III of Pentacles','VII of Pentacles','VIII of Pentacles','Queen of Pentacles','King of Pentacles'].includes(n))return'growth';
    if(['The Lovers','The Hierophant','Justice','VII of Cups','II of Swords','IV of Cups'].includes(n))return'choice';
    if(['The Hermit','The High Priestess','The Hanged Man','The Moon','IV of Swords','VIII of Swords'].includes(n))return'inner';
    if(['Wheel of Fortune','The Chariot','Knight of Wands','Knight of Swords','VIII of Wands','VI of Swords','V of Wands'].includes(n))return'change';
    if(['The Devil','VII of Swords','V of Swords','V of Pentacles'].includes(n))return'shadow';
    if(['II of Cups','III of Cups','VI of Cups','X of Cups','Queen of Cups','King of Cups','Knight of Cups','IV of Wands'].includes(n))return'connect';
    if(['The Emperor','The Magician','King of Swords','King of Wands','Queen of Wands','Queen of Swords'].includes(n))return'power';
    if(['Temperance','Judgement','Justice','VI of Pentacles','II of Pentacles','XIV of Wands'].includes(n))return'balance';
    if(['IV of Pentacles','IV of Wands','VII of Wands','IX of Wands'].includes(n))return'persist';
    // 나머지 숫자 카드들 슈트별 기본 분류
    if(n.includes('Wands'))return'passion';
    if(n.includes('Cups'))return'emotion';
    if(n.includes('Swords'))return'conflict';
    if(n.includes('Pentacles'))return'material';
    return'change';
  };
  const t0=getT(cards[0].name),t1=getT(cards[1].name),t2=getT(cards[2].name);
  const key=`${t0}-${t1}-${t2}`;

  // exact 조합 — 카테고리별 3가지 버전
  const exactLove={
    'new-inner-growth':'설레는 만남 뒤 찾아온 고요한 성찰이 지금의 당신을 만들었습니다. 상대를 깊이 이해하게 된 만큼, 이 관계는 더욱 진실해질 것입니다.',
    'new-inner-change':'처음의 설렘이 내면의 질문으로 이어졌고, 이제 그 답이 관계의 변화로 나타납니다. 용기 있게 마음을 표현할 때입니다.',
    'new-change-growth':'빠르게 달려온 감정이 이제 진짜 사랑으로 수렴되고 있습니다. 그 에너지를 믿고 한 걸음 더 다가가세요.',
    'new-emotion-growth':'풍부한 감정이 새로운 만남과 만나 진정한 사랑으로 이어집니다. 마음이 열려있는 지금이 바로 그 순간입니다.',
    'new-conflict-inner':'설레는 출발 뒤 예상치 못한 마찰이 찾아왔지만, 그것이 오히려 서로를 더 깊이 이해하게 만드는 계기가 됩니다.',
    'ending-inner-new':'관계의 한 챕터가 끝났지만, 그 고요함 속에서 더 나은 인연의 방향이 분명해지고 있습니다.',
    'ending-change-new':'오래된 감정의 끝이 변화의 물결과 만나 새로운 사랑의 가능성을 열어줍니다.',
    'ending-emotion-connect':'이별의 아픔이 진정한 인연의 소중함을 일깨워주었습니다. 이제 더 깊은 연결을 받아들일 준비가 되었습니다.',
    'ending-growth-new':'힘겨운 이별이 더 성숙한 사랑을 위한 토대가 되고 있습니다. 끝이 선물인 경우도 있습니다.',
    'shadow-inner-growth':'집착이나 두려움을 직면한 그 용기가 더 건강한 사랑의 토대가 됩니다.',
    'shadow-change-new':'스스로를 옭아매던 감정에서 벗어나 새로운 출발선에 서 있습니다. 자유로운 마음으로 나아가세요.',
    'shadow-emotion-connect':'내면의 그늘을 인정하고 나서야 비로소 진정한 연결이 가능해집니다. 취약함이 오히려 다리가 됩니다.',
    'shadow-conflict-new':'갈등과 두려움의 시간이 지나고 나면 더 자유로운 사랑이 기다리고 있습니다.',
    'connect-choice-growth':'소중한 인연이 지금의 중요한 선택에 영향을 미치고 있습니다. 마음이 이끄는 선택이 진정한 사랑으로 이어질 것입니다.',
    'connect-inner-growth':'관계 속에서 자신을 더 깊이 알게 된 당신, 그 통찰이 이제 더 성숙한 사랑으로 꽃을 피웁니다.',
    'connect-passion-growth':'따뜻한 연결이 열정에 불을 지펴, 지금 가장 풍성한 사랑의 시기로 이어지고 있습니다.',
    'inner-choice-growth':'자신의 마음을 들여다봤다면 이제 선택할 때입니다. 진심에서 나온 그 선택이라면 사랑은 자연스럽게 따라옵니다.',
    'inner-change-new':'깊은 성찰이 관계를 변화시킬 용기를 불러일으키고, 그 끝에 더 진실한 사랑이 기다리고 있습니다.',
    'inner-emotion-connect':'내면의 목소리에 귀 기울인 끝에 진정한 감정적 연결이 찾아옵니다. 조용히 열린 마음이 관계를 풍요롭게 합니다.',
    'change-change-new':'연속된 변화 끝에 완전히 새로운 사랑의 장이 열리고 있습니다. 더 좋은 방향으로 흘러가고 있음을 믿으세요.',
    'change-inner-balance':'관계의 변화 속에서 자신을 돌아보는 지금, 균형 잡힌 사랑을 위한 가장 중요한 시간을 보내고 있습니다.',
    'change-growth-balance':'감정의 변화가 성장을 거쳐 드디어 안정적인 사랑으로 이어지고 있습니다.',
    'change-conflict-inner':'관계의 변화가 갈등을 낳았지만, 그 안에서 진짜 서로를 발견하는 기회가 생겼습니다.',
    'growth-choice-balance':'함께 성장해온 토대 위에서 중요한 선택을 앞두고 있습니다. 이미 충분히 준비된 사랑입니다.',
    'growth-emotion-connect':'함께한 시간이 감정의 깊이를 더하고, 그 풍요로움이 진정한 연결로 꽃을 피웁니다.',
    'growth-inner-balance':'관계의 성장이 내면의 성찰과 만나 진정한 균형을 이룹니다. 가장 원숙한 사랑의 시기입니다.',
    'power-choice-balance':'감정에 흔들리지 않고 중심을 지켜온 당신, 이제 중요한 선택의 기로에 섰습니다.',
    'power-change-growth':'강인한 마음이 관계의 변화를 주도하고, 더 깊고 단단한 사랑이 기다리고 있습니다.',
    'power-conflict-inner':'감정의 갈등 앞에서 내면을 돌아보는 것이 진정한 사랑의 지혜입니다.',
    'balance-inner-new':'관계의 균형을 찾은 성찰 끝에 새로운 사랑의 문이 열립니다.',
    'balance-growth-new':'안정된 관계 위에서 성장이 확인되고, 더 깊은 사랑의 챕터로 나아갈 준비가 됐습니다.',
    'passion-emotion-growth':'열정과 감정이 하나로 만나 진정한 사랑으로 이어집니다. 지금 이 마음을 표현하세요.',
    'passion-conflict-inner':'뜨거운 감정이 갈등과 충돌하며 서로의 진짜 모습을 드러냈습니다. 이 시련이 관계를 더 명확하게 만들어줄 것입니다.',
    'emotion-conflict-inner':'감정의 소용돌이와 갈등을 지나, 이제 서로를 더 잘 이해하게 됩니다. 아픔이 깊이를 만들었습니다.',
    'conflict-inner-new':'갈등과 상처의 시간이 관계를 깊게 만들었고, 이제 그 깊이에서 진짜 새로운 사랑이 태어납니다.',
    'conflict-change-growth':'마찰과 저항이 관계의 변화를 촉발하고, 예상보다 훨씬 더 성숙한 사랑으로 이어집니다.',
    'material-inner-balance':'현실적인 조건을 함께 고민하며 내면의 가치도 성찰한 당신, 진정한 사랑과 균형이 찾아오고 있습니다.',
    'material-growth-connect':'함께 쌓아온 실질적인 토대가 성장을 확인해주고, 그 안정감이 더 깊은 연결로 이어집니다.',
    'persist-change-growth':'어려운 시간을 함께 버텨온 것이 변화를 거쳐 마침내 더 단단한 사랑으로 결실을 맺습니다.',
  };
  const exactWork={
    'new-inner-growth':'새로운 도전 뒤 찾아온 성찰이 지금의 당신을 만들었습니다. 내면을 깊이 들여다본 만큼 앞으로의 성과는 더욱 단단할 것입니다.',
    'new-inner-change':'처음의 열정이 내면의 질문으로 이어졌고, 이제 그 답이 커리어의 변화로 나타납니다. 새로운 방향을 향해 나아갈 때입니다.',
    'new-change-growth':'빠르게 달려온 시간이 이제 진짜 성과로 수렴되고 있습니다. 그 에너지를 믿고 한 걸음 더 나아가세요.',
    'new-emotion-growth':'일에 대한 열정이 새로운 시작과 만나 진정한 성과로 이어집니다. 지금 이 흐름을 놓치지 마세요.',
    'new-conflict-inner':'새로운 도전 뒤 예상치 못한 어려움이 찾아왔지만, 그것이 오히려 자신의 방향을 더 명확히 해줍니다.',
    'ending-inner-new':'한 단계가 마무리됐지만, 그 고요함 속에서 더 맞는 방향이 분명해지고 있습니다.',
    'ending-change-new':'오래된 것의 끝이 변화와 만나 새로운 커리어의 가능성을 열어줍니다.',
    'ending-emotion-connect':'힘겨운 마무리가 진정한 동료의 소중함을 일깨워주었습니다. 더 좋은 환경으로 나아갈 준비가 되었습니다.',
    'ending-growth-new':'힘든 마무리가 더 성장한 출발의 토대가 되고 있습니다. 이 끝이 더 나은 시작의 발판입니다.',
    'shadow-inner-growth':'불안과 두려움을 직면한 그 용기가 더 단단한 성장의 토대가 됩니다.',
    'shadow-change-new':'스스로를 가로막던 것들에서 벗어나 완전히 새로운 출발선에 서 있습니다.',
    'shadow-emotion-connect':'두려움을 인정하고 나서야 비로소 진정한 협력이 가능해집니다. 솔직함이 오히려 강점이 됩니다.',
    'shadow-conflict-new':'갈등과 압박의 시간이 지나고 나면 더 자유롭고 강한 당신이 기다리고 있습니다.',
    'connect-choice-growth':'좋은 동료와의 인연이 지금의 중요한 커리어 선택에 영향을 미치고 있습니다. 함께 성장하는 방향이 정답입니다.',
    'connect-inner-growth':'협업 속에서 자신을 더 깊이 알게 된 당신, 그 통찰이 이제 더 큰 성과로 꽃을 피웁니다.',
    'connect-passion-growth':'좋은 팀워크가 열정에 불을 지펴, 지금 가장 풍성한 성과의 시기로 이어지고 있습니다.',
    'inner-choice-growth':'자신이 원하는 것을 들여다봤다면 이제 결정할 때입니다. 진심에서 나온 그 선택이라면 성장은 자연스럽게 따라옵니다.',
    'inner-change-new':'깊은 성찰이 커리어 변화의 용기를 불러일으키고, 그 끝에 더 맞는 방향이 기다리고 있습니다.',
    'inner-emotion-connect':'내면의 목소리에 귀 기울인 끝에 진정으로 열정을 쏟을 수 있는 일을 찾게 됩니다.',
    'change-change-new':'연속된 변화 끝에 완전히 새로운 커리어의 장이 열리고 있습니다. 더 좋은 방향으로 흘러가고 있음을 믿으세요.',
    'change-inner-balance':'바쁜 변화 속에서 방향을 점검하는 지금, 균형 잡힌 커리어를 위한 가장 중요한 시간입니다.',
    'change-growth-balance':'역동적인 움직임이 성장을 거쳐 드디어 안정적인 성과로 이어지고 있습니다.',
    'change-conflict-inner':'빠른 변화가 갈등을 낳았지만, 그 안에서 진짜 자신의 강점을 발견하는 기회가 생겼습니다.',
    'growth-choice-balance':'꾸준히 쌓아온 실력 위에서 중요한 커리어 선택을 앞두고 있습니다. 이미 충분히 준비되었습니다.',
    'growth-emotion-connect':'성취가 일에 대한 열정을 더하고, 그 풍요로움이 더 좋은 기회로 이어집니다.',
    'growth-inner-balance':'외적 성과가 내면의 성찰과 만나 진정한 균형을 이룹니다. 가장 원숙한 시기입니다.',
    'power-choice-balance':'강한 의지로 이끌어온 커리어에서 이제 중요한 선택의 기로에 섰습니다. 올바른 판단이 더 큰 결실로 이어질 것입니다.',
    'power-change-growth':'강인한 실행력이 변화를 주도하고, 그 결과로 더 크고 단단한 성과가 기다리고 있습니다.',
    'power-conflict-inner':'강한 추진력이 갈등을 만났을 때, 내면을 돌아보는 것이 진정한 리더십입니다.',
    'balance-inner-new':'균형 잡힌 성찰 끝에 새로운 기회의 문이 열립니다. 준비가 됐기에 이번 시작은 어느 때보다 안정적입니다.',
    'balance-growth-new':'안정된 토대 위에서 성장이 확인되고, 이제 완전히 새로운 커리어 챕터로 나아갈 준비가 됐습니다.',
    'passion-emotion-growth':'일에 대한 열정과 감정이 하나로 만나 진정한 성과를 이루어냅니다. 지금이 최적의 타이밍입니다.',
    'passion-conflict-inner':'뜨거운 열정이 갈등과 충돌하며 내면의 진짜 목소리를 드러냈습니다. 이 시련이 당신을 더 명확하게 만들어줄 것입니다.',
    'emotion-conflict-inner':'번아웃과 갈등을 지나, 이제 자신이 진정 원하는 것을 더 잘 이해하게 됩니다.',
    'conflict-inner-new':'갈등과 어려움의 시간이 내면을 깊게 만들었고, 이제 그 깊이에서 진짜 새로운 방향이 태어납니다.',
    'conflict-change-growth':'마찰과 저항이 변화를 촉발하고, 그 변화가 예상보다 훨씬 큰 성장으로 이어집니다.',
    'material-inner-balance':'실질적인 성과를 쌓아오며 방향도 함께 성찰한 당신, 진정한 풍요와 균형이 찾아오고 있습니다.',
    'material-growth-connect':'실질적인 성과가 성장을 확인해주고, 그 안정감이 더 좋은 기회와 인맥으로 이어집니다.',
    'persist-change-growth':'인내하며 지켜온 것들이 변화를 거쳐 마침내 성과로 결실을 맺습니다. 포기하지 않은 것이 옳았습니다.',
  };
  const exactEtc={
    'new-inner-growth':'설레는 출발 뒤 찾아온 고요한 성찰이 지금의 당신을 만들었습니다. 내면을 깊이 들여다본 만큼, 앞으로의 성장은 단단하고 진실할 것입니다.',
    'new-inner-change':'처음의 순수한 열정이 내면의 질문으로 이어졌고, 이제 그 답이 변화로 나타납니다. 당신이 품었던 씨앗이 드디어 싹을 틔울 시간입니다.',
    'new-change-growth':'빠르게 달려온 시간이 이제 진짜 성장으로 수렴되고 있습니다. 에너지를 믿고 한 걸음 더 내딛으세요.',
    'new-emotion-growth':'풍부한 감정이 새로운 시작과 만나 진정한 풍요로 이어집니다. 마음이 열려있는 지금이 바로 그 순간입니다.',
    'new-conflict-inner':'밝은 출발 뒤 예상치 못한 마찰이 찾아왔지만, 그것이 오히려 자신을 더 깊이 들여다보게 만들었습니다.',
    'ending-inner-new':'무언가 끝났지만, 고요함 속에서 새로운 방향이 분명해지고 있습니다.',
    'ending-change-new':'오래된 것의 끝과 변화의 물결이 새로운 가능성을 열어주고 있습니다. 이 흐름이 당신을 더 좋은 곳으로 데려갑니다.',
    'ending-emotion-connect':'상실의 시간이 진정한 인연의 소중함을 일깨워주었습니다. 이제 마음을 열고 연결을 받아들일 준비가 되었습니다.',
    'ending-growth-new':'힘겨운 마무리가 놀랍도록 풍성한 새 출발의 토대가 되고 있습니다. 끝이 선물인 경우도 있습니다.',
    'shadow-inner-growth':'두려움이 발목을 잡던 시기를 지나, 내면을 들여다본 그 용기가 진정한 성장의 토대가 됩니다.',
    'shadow-change-new':'스스로를 옭아매던 것에서 벗어나 변화의 물결을 탄 당신, 이제 전혀 다른 출발선에 서 있습니다.',
    'shadow-emotion-connect':'내면의 그늘을 인정하고 나서야 비로소 진정한 연결이 가능해집니다. 취약함이 오히려 다리가 됩니다.',
    'shadow-conflict-new':'갈등과 억압의 시간이 지나고 나면 더 자유로운 자신이 기다리고 있습니다. 지금의 어둠은 새벽 직전입니다.',
    'connect-choice-growth':'소중한 인연이 지금의 중요한 선택에 영향을 미치고 있습니다. 마음이 이끄는 선택이 진정한 풍요로 이어질 것입니다.',
    'connect-inner-growth':'관계 속에서 자신을 더 깊이 알게 된 당신, 그 통찰이 이제 진정한 성장으로 꽃을 피웁니다.',
    'connect-passion-growth':'따뜻한 연결이 열정에 불을 지펴, 지금 가장 풍성한 결실의 시기로 이어지고 있습니다.',
    'inner-choice-growth':'고요히 내면을 들여다봤다면 이제 선택할 때입니다. 진심에서 나온 그 선택이라면, 성장은 자연스럽게 따라옵니다.',
    'inner-change-new':'깊은 성찰이 변화의 용기를 불러일으키고, 그 끝에 전혀 새로운 자신이 기다리고 있습니다.',
    'inner-emotion-connect':'내면의 목소리에 귀 기울인 끝에 진정한 감정적 연결이 찾아옵니다. 조용히 열린 마음이 관계를 풍요롭게 합니다.',
    'change-change-new':'연속된 변화 끝에 완전히 새로운 장이 열리고 있습니다. 결국 더 좋은 방향으로 흘러가고 있음을 믿으세요.',
    'change-inner-balance':'바쁜 변화 속에서 자신을 돌아보는 지금, 균형 잡힌 미래를 위한 가장 중요한 시간을 보내고 있습니다.',
    'change-growth-balance':'역동적인 움직임이 성장을 거쳐 드디어 안정의 땅에 닿고 있습니다. 흔들렸던 만큼 더 단단한 균형이 찾아옵니다.',
    'change-conflict-inner':'빠른 변화가 갈등을 낳았지만, 그 안에서 더 깊은 자신을 발견하는 기회가 생겼습니다.',
    'growth-choice-balance':'꾸준히 성장해온 토대 위에서 중요한 선택을 앞두고 있습니다. 이미 충분히 준비되었으니, 균형 있게 나아가면 됩니다.',
    'growth-emotion-connect':'성취가 감정의 깊이를 더하고, 그 풍요로움이 진정한 연결로 꽃을 피웁니다.',
    'growth-inner-balance':'풍요로운 외적 성장이 내면의 성찰과 만나 진정한 균형을 이룹니다. 가장 원숙한 시기입니다.',
    'power-choice-balance':'강한 의지로 이끌어온 삶에서 이제 중요한 선택의 기로에 섰습니다. 올바른 판단이 균형 잡힌 결실로 이어질 것입니다.',
    'power-change-growth':'강인한 에너지가 변화를 주도하고, 그 결과로 더 크고 단단한 성장이 기다리고 있습니다.',
    'power-conflict-inner':'강한 힘이 갈등을 만났을 때, 내면을 돌아보는 것이 진정한 지혜입니다.',
    'balance-inner-new':'조화로운 성찰 끝에 새로운 문이 열립니다. 내면의 균형이 잡혔기에 이번 시작은 어느 때보다 안정적입니다.',
    'balance-growth-new':'균형을 이룬 토대 위에서 성장이 확인되고, 이제 완전히 새로운 챕터로 나아갈 준비가 됐습니다.',
    'passion-emotion-growth':'열정과 감정이 하나로 만나 진정한 성장을 이루어냅니다. 불꽃과 물이 합쳐져 생명이 피어나듯이.',
    'passion-conflict-inner':'뜨거운 열정이 갈등과 충돌하며 내면의 진짜 목소리를 드러냈습니다. 이 시련이 당신을 더 명확하게 만들어줄 것입니다.',
    'emotion-conflict-inner':'감정의 소용돌이와 갈등을 지나, 이제 자신의 내면을 더 잘 이해하게 됩니다. 아픔이 깊이를 만들었습니다.',
    'conflict-inner-new':'갈등과 상처의 시간이 내면을 깊게 만들었고, 이제 그 깊이에서 진짜 새로운 시작이 태어납니다.',
    'conflict-change-growth':'마찰과 저항이 변화를 촉발하고, 그 변화가 예상보다 훨씬 큰 성장으로 이어집니다.',
    'material-inner-balance':'물질적 기반을 쌓아오며 내면의 가치도 함께 성찰한 당신, 진정한 풍요와 균형이 찾아오고 있습니다.',
    'material-growth-connect':'실질적인 성과가 성장을 확인해주고, 그 안정감이 더 깊은 인연으로 이어집니다.',
    'persist-change-growth':'인내하며 지켜온 것들이 변화를 거쳐 마침내 성장으로 결실을 맺습니다. 포기하지 않은 것이 옳았습니다.',
  };
  // 카테고리에 맞는 exact 선택
  const exact = catKey==='love' ? exactLove : catKey==='work' ? exactWork : exactEtc;

  // 카테고리별 미래 테마 메시지
  // ── 질문에서 핵심 단어 추출 ──
  const extractKeyword=(q)=>{
    const t=q.trim();

    // ── 1. 질문 의도 파악 (육하원칙) ──
    // 우선순위: 의도 > 상대방 > 상황
    const intent=
      // 비교/양자택일을 가장 먼저 체크 (누구보다 우선)
      /중에|vs|versus|둘 중|둘중|어느 쪽|어느쪽|누가 더|누가더|어떤 게 더|어떤게 더|더 나을|더나을|더 좋|더좋|비교/.test(t) ? 'compare' :
      /언제|얼마나|기다|시기|타이밍|빨리|오래|soon|when/.test(t) ? 'when' :
      /어떻게|어떻게 하|방법|어찌|어떡|how/.test(t) ? 'how' :
      /왜|이유|원인|왜이렇게|why/.test(t) ? 'why' :
      /누구|어떤 사람|어떤사람|어떤 남|어떤 여|who/.test(t) ? 'who' :
      /될까|잘될|가능|성공할|합격할|사귈 수|사귀게|연락올|올까|받을 수|될 수 있/.test(t) ? 'possible' :
      /해야|어떻게 해|어떡해|어찌해|조언|충고|advice/.test(t) ? 'advice' :
      null;

    // ── 2. 상대방 지칭 ──
    const person=[['남자친구','남자친구'],['여자친구','여자친구'],['남친','남자친구'],['여친','여자친구'],
      ['남편','남편'],['아내','아내'],['배우자','배우자'],['썸남','그 사람'],['썸녀','그 사람'],
      ['걔','그 사람'],['쟤','그 사람'],['그 사람','그 사람'],['그사람','그 사람'],
      ['그 남자','그 사람'],['그 여자','그 사람'],['오빠','그 사람'],['언니','그 사람'],
      ['전남친','전 연인'],['전여친','전 연인'],['첫사랑','첫사랑'],['연인','연인']];
    let personWord=null;
    for(const[k,v] of person){ if(t.includes(k)){personWord=v;break;} }

    // 의도가 있으면 의도 + 상대방 조합으로 반환
    if(intent) return{type:'intent_'+intent, word:personWord||'상대방', intent};

    // ── 3. 상황 키워드 ──
    if(personWord) return{type:'love_person',word:personWord};
    if(t.includes('고백')) return{type:'love_action',word:'고백'};
    if(t.includes('이별')||t.includes('헤어')) return{type:'love_end',word:'이별'};
    if(t.includes('결혼')) return{type:'love_action',word:'결혼'};
    if(t.includes('재회')) return{type:'love_action',word:'재회'};
    if(t.includes('짝사랑')) return{type:'love_one',word:'짝사랑'};
    // 직업
    if(t.includes('면접')) return{type:'work_event',word:'면접'};
    if(t.includes('취업')) return{type:'work_goal',word:'취업'};
    if(t.includes('이직')) return{type:'work_goal',word:'이직'};
    if(t.includes('합격')) return{type:'work_goal',word:'합격'};
    if(t.includes('수능')||t.includes('입시')) return{type:'work_exam',word:'수능'};
    if(t.includes('시험')) return{type:'work_exam',word:'시험'};
    if(t.includes('사업')||t.includes('창업')) return{type:'work_goal',word:'사업'};
    if(t.includes('승진')) return{type:'work_goal',word:'승진'};
    if(t.includes('공부')) return{type:'work_exam',word:'공부'};
    return null;
  };

  // 의도별 오버라이드 메시지 (카테고리 무관, 가장 먼저 체크)
  const intentMsg=(kw, t2)=>{
    if(!kw||!kw.intent) return null;
    const w=kw.word;
    const msgs={
      when:{
        love:{
          new:`${w}와 다시 연결될 시기는 카드가 정확히 말해주기 어렵지만, 지금 새로운 에너지가 흐르고 있습니다. 조급해하지 말고 자연스러운 흐름에 맡기세요.`,
          growth:`${w}와의 재회나 만남의 시기는 두 사람이 각자 준비되었을 때 찾아옵니다. 지금은 스스로를 더 성장시키는 시간으로 삼으세요.`,
          change:`타이밍은 강요하기보다 만들어가는 것입니다. ${w}와의 연결이 다시 이루어지려면 작은 변화부터 시작해보세요.`,
          inner:`언제가 아니라 지금 자신이 무엇을 원하는지가 더 중요한 질문입니다. 내면이 명확해질 때 타이밍도 보이기 시작합니다.`,
          ending:`${w}와의 만남이 멀어진 데에는 이유가 있습니다. 그 이유가 해소될 때 자연스럽게 기회가 찾아올 것입니다.`,
          default:`${w}와의 타이밍은 서두른다고 앞당겨지지 않습니다. 지금 당신이 할 수 있는 것에 집중할 때 기회는 자연스럽게 옵니다.`,
        },
        work:{
          new:`기회의 타이밍은 준비된 사람을 기다립니다. 지금 준비하는 시간이 쌓일수록 그 시기는 더 가까워집니다.`,
          growth:`성과가 나타나는 시기는 사람마다 다릅니다. 지금의 노력이 보이지 않아도 분명히 쌓이고 있으니 믿고 나아가세요.`,
          default:`원하는 결과가 언제 올지는 알 수 없지만, 준비하는 사람에게 타이밍은 반드시 찾아옵니다.`,
        },
      },
      how:{
        love:{
          new:`${w}와 가까워지는 방법은 단순합니다. 꾸미지 않은 진심 어린 관심을 보여주세요. 작은 것부터 시작하세요.`,
          growth:`${w}와의 관계를 더 깊게 만드는 방법은 서로를 있는 그대로 받아들이는 것입니다. 완벽하지 않아도 괜찮아요.`,
          shadow:`${w}에게 솔직하게 마음을 표현하는 것을 두려워하지 마세요. 진심은 전달됩니다.`,
          default:`방법을 고민하기보다 지금 솔직한 마음을 표현해보세요. 어떻게보다 왜가 더 중요할 때가 있습니다.`,
        },
        work:{
          new:`지금 당장 완벽한 방법을 찾으려 하기보다, 작은 한 가지를 실행해보세요. 행동이 방법을 만들어냅니다.`,
          growth:`더 잘하고 싶다면 이미 잘하고 있는 것에서 시작하세요. 강점을 키우는 것이 약점을 보완하는 것보다 빠릅니다.`,
          default:`방법은 시도하면서 만들어지는 것입니다. 완벽한 계획보다 불완전한 실행이 훨씬 더 많은 것을 가르쳐줍니다.`,
        },
      },
      why:{
        love:{
          inner:`${w}와의 관계에서 그 이유를 찾으려면 먼저 자신의 감정을 솔직하게 들여다봐야 합니다. 모든 답은 그 안에 있습니다.`,
          shadow:`왜 이런 상황이 됐는지보다, 지금 어떻게 할 것인지가 더 중요합니다. 과거의 이유에 갇히지 마세요.`,
          default:`이유를 알고 싶은 마음은 자연스럽습니다. 하지만 때로는 이유보다 앞으로의 방향이 더 중요한 답이 됩니다.`,
        },
        work:{
          inner:`지금 상황이 왜 이렇게 됐는지 돌아보는 것은 중요하지만, 거기서 멈추면 안 됩니다. 이유를 앎으로써 다음 선택을 더 잘할 수 있어요.`,
          default:`왜라는 질문은 과거를 보지만, 카드는 앞을 봅니다. 이유를 찾는 것과 동시에 다음 걸음도 준비해보세요.`,
        },
      },
      possible:{
        love:{
          new:`${w}와 잘 될 가능성, 카드는 새로운 에너지가 흐르고 있음을 보여줍니다. 가능성은 있습니다. 지금 당신의 행동이 그 가능성을 현실로 만들 수 있어요.`,
          growth:`${w}와 잘 될 수 있습니다. 이 관계는 서로에게 좋은 방향으로 성장하고 있으니, 조급해하지 말고 자연스럽게 이어가세요.`,
          ending:`지금 당장은 어렵더라도 완전히 불가능한 것은 아닙니다. 다만 지금은 서로에게 시간이 필요한 시기일 수 있어요.`,
          inner:`가능성에 대한 답은 상대방이 아닌 당신 안에 있습니다. 자신이 진정 원하는 것이 명확할 때 답도 선명해집니다.`,
          shadow:`가능성이 있지만, 집착이나 두려움이 그 가능성을 스스로 막고 있지는 않은지 돌아보세요.`,
          default:`가능성은 언제나 열려 있습니다. 지금 당신이 어떻게 행동하느냐에 따라 그 가능성이 현실이 될 수 있어요.`,
        },
        work:{
          new:`가능성은 충분합니다. 준비가 조금 더 필요할 수 있지만, 지금 시작하는 것 자체가 이미 절반은 이룬 것입니다.`,
          growth:`할 수 있습니다. 지금까지 쌓아온 것들이 결실을 맺을 준비가 되어 있어요. 자신을 믿으세요.`,
          shadow:`두려움이 가능성을 가리고 있습니다. 스스로를 믿는 것이 먼저입니다. 당신은 생각보다 더 준비되어 있어요.`,
          default:`가능합니다. 카드는 그 방향으로의 흐름을 보여주고 있습니다. 포기하지 말고 계속 나아가세요.`,
        },
      },
      advice:{
        love:{
          inner:`지금 당신에게 필요한 것은 상대방을 바꾸려는 노력이 아니라, 자신의 감정을 명확히 하는 것입니다. 그것이 먼저입니다.`,
          connect:`솔직하게 대화해보세요. 말하지 않으면 상대방은 알 수 없습니다. 용기 있는 한 마디가 관계를 바꿀 수 있습니다.`,
          default:`조언을 구하는 마음 자체가 이미 진지하게 생각하고 있다는 증거입니다. 가장 솔직한 자신의 마음을 따르세요.`,
        },
        work:{
          growth:`지금 할 수 있는 가장 작은 것부터 시작하세요. 완벽한 준비를 기다리기보다 불완전해도 실행하는 것이 더 빠른 길입니다.`,
          inner:`지금 방향이 맞는지 점검해보세요. 열심히 하는 것도 중요하지만, 올바른 방향으로 가고 있는지가 더 중요합니다.`,
          default:`지금 가장 중요한 것 한 가지에 집중하세요. 여러 가지를 동시에 잡으려 할수록 아무것도 잡히지 않을 수 있습니다.`,
        },
      },
      compare:{
        love:{
          inner:`타로는 누가 더 낫다고 직접 말해주지 않습니다. 대신 지금 당신 마음속에 이미 답이 있을 가능성이 높아요. 어느 쪽을 생각할 때 더 편안한가요?`,
          choice:`두 사람을 비교하기보다, 각각의 관계에서 당신이 어떤 감정을 느끼는지 들여다보세요. 설레는 쪽보다 편안한 쪽이 오래가는 경우도 많습니다.`,
          shadow:`비교 자체가 피로하다면, 그 관계들에서 진정으로 행복했는지를 먼저 물어보세요. 더 나은 사람을 고르는 것이 아니라, 당신에게 맞는 사람을 찾는 것이 핵심입니다.`,
          connect:`두 사람 모두 당신의 삶에 의미 있는 존재였겠지만, 지금 당신이 진정으로 연결감을 느끼는 쪽이 어딘지가 더 중요한 기준입니다.`,
          ending:`과거와 현재를 비교하는 것은 자연스럽지만, 타로는 앞을 봅니다. 어느 쪽이 당신의 미래를 더 밝게 만드는지 생각해보세요.`,
          default:`두 사람 중 누가 더 나은지는 카드가 아닌 당신의 마음이 알고 있습니다. 머리가 아닌 가슴이 편안한 쪽을 따라가보세요.`,
        },
        work:{
          choice:`두 가지 선택지를 비교하고 있군요. 단기적인 조건보다 1년 후, 3년 후의 자신을 상상했을 때 더 설레는 쪽이 어딘지 생각해보세요.`,
          inner:`어느 쪽이 더 나은지 따지기 전에, 어느 쪽이 더 자신답게 일할 수 있는 환경인지를 먼저 물어보세요.`,
          default:`두 선택지 모두 장단이 있을 것입니다. 카드는 지금 당신에게 내면의 기준을 더 명확히 하라고 말하고 있어요.`,
        },
      },
      who:{
        love:{
          new:`어떤 사람과 연결될지는 지금 당신이 어떤 사람인지에 달려 있습니다. 자신을 가꾸는 것이 좋은 인연을 만나는 가장 확실한 방법입니다.`,
          default:`좋은 인연은 찾는 것이 아니라 만나게 되는 것입니다. 지금 당신의 삶을 풍요롭게 만드는 데 집중하세요.`,
        },
        work:{
          connect:`함께할 동료나 멘토를 찾고 있다면, 먼저 당신이 어떤 사람이 되고 싶은지를 명확히 해보세요. 비슷한 가치관을 가진 사람은 반드시 나타납니다.`,
          default:`지금 필요한 사람은 이미 주변에 있을 수 있습니다. 조금 더 주의 깊게 살펴보세요.`,
        },
      },
    };
    const catMsgs = msgs[kw.intent]?.[catKey==='love'?'love':'work'];
    if(catMsgs){
      // t2 테마에 맞는 메시지, 없으면 default
      return catMsgs[t2] || catMsgs.default || null;
    }
    return null;
  };

  const kw = extractKeyword(question);
  const byFMap = catKey==='love'?byLove : catKey==='work'?byWork : byEtc;
  // 배열인 경우: [0]=키워드 함수 or 문자열, [1]=일반 문자열 → 키워드 있으면 0번, 없으면 1번
  const resolveMsg=(pool)=>{
    if(!pool) return null;
    if(typeof pool === 'string') return pool;
    if(Array.isArray(pool)){
      const first = pool[0];
      if(typeof first === 'function') return kw ? first(kw) : pool[1];
      return kw ? pool[0] : pool[1] || pool[0];
    }
    return null;
  };
  return intentMsg(kw, t2) || exact[key] || resolveMsg(byFMap[t2]) || `${cards[0].kr}의 흔적 위에 ${cards[1].kr}의 에너지가 더해져, ${cards[2].kr}이 가리키는 방향으로 나아가고 있습니다. 세 카드의 흐름을 신뢰하세요.`;
}
  const byLove={
    new:[
      (w)=>w?.type==='love_person'?`${w.word}와의 새로운 국면이 시작되고 있습니다. 지금 느끼는 설렘을 믿고 먼저 다가가보세요. 당신의 진심은 반드시 전해질 것입니다.`
        :w?.type==='love_one'?`${w.word} 중인 마음이 새로운 전환점을 맞이하고 있습니다. 용기를 내어 한 걸음 가까워져 보세요.`
        :`새로운 만남이나 관계의 시작을 알리는 에너지가 느껴집니다. 마음을 열고 다가가세요. 당신의 진심이 상대에게 닿을 것입니다.`,
      '설레는 감정이 새로운 인연의 문을 열고 있습니다. 지금 이 순간을 놓치지 마세요.',
    ],
    growth:[
      (w)=>w?.type==='love_person'?`${w.word}와의 관계가 서로를 성장시키는 방향으로 흐르고 있습니다. 함께하는 시간이 당신을 더 나은 사람으로 만들어줄 것입니다.`
        :`이 관계는 서로를 성장시키는 방향으로 흐르고 있습니다. 상대와 함께하는 시간이 당신을 더 나은 사람으로 만들어줄 것입니다.`,
      '사랑이 깊어질수록 서로의 모습도 더 풍요로워집니다. 이 관계 안에서 진정한 성장이 일어나고 있습니다.',
    ],
    change:[
      (w)=>w?.type==='love_person'?`${w.word}와의 관계에 변화의 바람이 불고 있습니다. 두렵더라도 솔직한 마음을 표현하는 것이 지금 가장 용감한 선택입니다.`
        :w?.type==='love_action'&&w.word==='고백'?`고백을 앞두고 많은 것이 달라질 것 같은 느낌이 드시나요? 변화가 두렵더라도 진심을 전하는 것이 후회 없는 선택입니다.`
        :`관계에 변화의 바람이 불고 있습니다. 두렵더라도 솔직한 마음을 표현하는 것이 지금 가장 용감한 선택입니다.`,
      '관계의 흐름이 달라지고 있습니다. 변화를 거부하지 말고 그 흐름 속에서 더 진실한 연결을 찾아가세요.',
    ],
    inner:[
      (w)=>w?.type==='love_person'?`${w.word}를 이해하기 전에 먼저 자신의 감정을 들여다볼 필요가 있습니다. 내 마음이 무엇을 원하는지 명확해질 때 관계도 선명해집니다.`
        :`상대를 이해하기 전에 먼저 자신의 감정을 들여다볼 필요가 있습니다. 내 마음이 무엇을 원하는지 명확해질 때 관계도 선명해집니다.`,
      '지금 느끼는 감정의 실체를 직면하는 것이 먼저입니다. 내면이 명확해질수록 관계도 더 건강해집니다.',
    ],
    connect:[
      (w)=>w?.type==='love_person'?`${w.word}와 진정으로 연결되려면 서로를 있는 그대로 받아들이는 것이 필요합니다. 더 솔직하고 따뜻하게 다가가보세요.`
        :`진정한 연결은 서로를 있는 그대로 받아들일 때 깊어집니다. 지금 이 관계에서 더 솔직하고 따뜻하게 다가가보세요.`,
      '마음의 문을 조금 더 열어두세요. 진정한 연결은 완벽한 타이밍이 아니라 솔직한 마음에서 시작됩니다.',
    ],
    choice:[
      (w)=>w?.type==='love_action'?`${w.word}에 대한 결정을 내려야 할 시기입니다. 머리보다 가슴이 이끄는 방향을 믿으세요. 진심은 결코 틀리지 않습니다.`
        :w?.type==='love_person'?`${w.word}와의 관계에서 중요한 결정을 내려야 할 시기입니다. 가슴이 이끄는 방향을 믿으세요.`
        :`관계에서 중요한 결정을 내려야 할 시기입니다. 머리보다 가슴이 이끄는 방향을 믿으세요. 진심은 결코 틀리지 않습니다.`,
      '선택의 기로에 서 있지만, 어느 쪽이든 진심에서 나온 결정이라면 후회하지 않을 것입니다.',
    ],
    ending:[
      (w)=>w?.type==='love_end'?`${w.word}의 아픔 속에서도 더 성숙한 사랑으로 나아갈 힘이 생기고 있습니다. 끝은 동시에 새로운 시작이기도 합니다.`
        :w?.type==='love_person'?`${w.word}와의 관계에서 한 챕터가 마무리되고 있습니다. 아프더라도 그 끝이 더 성숙한 사랑의 시작이 될 수 있습니다.`
        :`관계의 한 챕터가 마무리되고 있습니다. 아프더라도 그 끝이 더 성숙한 사랑의 시작이 될 수 있음을 기억하세요.`,
      '사랑에도 계절이 있습니다. 지금은 한 계절이 지나가는 시간이지만, 새 계절은 반드시 찾아옵니다.',
    ],
    shadow:[
      (w)=>w?.type==='love_person'?`${w.word}에 대한 집착이나 두려움이 관계를 어둡게 만들고 있지는 않은지 돌아보세요. 자유로운 마음에서 진정한 사랑이 피어납니다.`
        :`관계에서 두려움이나 집착이 발목을 잡고 있지는 않은지 돌아보세요. 자유로운 마음에서 진정한 사랑이 피어납니다.`,
      '사랑에서 가장 용감한 행동은 집착을 내려놓는 것입니다. 자유롭게 놓아줄 때 진짜 연결이 남습니다.',
    ],
    balance:[
      (w)=>w?.type==='love_person'?`${w.word}와의 관계에서 주고받는 균형이 중요합니다. 혼자 너무 많이 애쓰지 않아도 괜찮아요.`
        :`이 관계에서 주고받는 균형이 중요합니다. 혼자 너무 많이 애쓰지 않아도 괜찮아요. 균형이 맞을 때 사랑은 오래갑니다.`,
      '사랑은 한쪽이 채우는 것이 아니라 함께 채워가는 것입니다. 균형을 찾을 때 관계는 더 단단해집니다.',
    ],
    power:[
      (w)=>w?.type==='love_person'?`${w.word}에 대한 감정에 흔들리기보다 자신의 중심을 지키세요. 자신을 잃지 않는 사람이 더 깊은 사랑을 받을 수 있습니다.`
        :`감정에 흔들리기보다 자신의 중심을 지키세요. 자신을 잃지 않는 사람이 더 깊은 사랑을 받을 수 있습니다.`,
      '사랑할수록 자신을 더 귀하게 여기세요. 스스로를 존중하는 사람이 더 건강한 사랑을 만들어냅니다.',
    ],
    passion:[
      (w)=>w?.type==='love_action'&&w.word==='고백'?`고백에 대한 설렘과 두려움, 그 감정 자체가 진심의 증거입니다. 망설이지 말고 마음을 표현해보세요.`
        :w?.type==='love_person'?`${w.word}에 대한 감정은 진짜입니다. 망설임 없이 마음을 표현해보세요. 열정은 상대에게도 분명히 전달됩니다.`
        :`지금 이 감정은 진짜입니다. 망설임 없이 마음을 표현해보세요. 열정은 상대에게도 분명히 전달됩니다.`,
      '두근거리는 마음을 억누르지 마세요. 그 설렘이 관계를 더 살아있게 만드는 힘입니다.',
    ],
    emotion:[
      (w)=>w?.type==='love_person'?`${w.word}와의 관계에서 감정이 복잡하게 얽혀있을 수 있습니다. 억누르지 말고 천천히 풀어가세요.`
        :`감정이 복잡하게 얽혀있을 수 있습니다. 그 감정을 억누르지 말고 천천히 풀어가세요. 시간이 많은 것을 정리해줄 것입니다.`,
      '사랑 앞에서 복잡한 감정은 자연스러운 것입니다. 그 감정들을 하나씩 들여다보면 진짜 마음이 보입니다.',
    ],
    conflict:[
      (w)=>w?.type==='love_person'?`${w.word}와의 긴장감은 서로가 그만큼 소중하다는 신호일 수 있습니다. 갈등을 피하지 말고 대화로 풀어가세요.`
        :`지금 관계에서 느끼는 긴장감은 서로가 그만큼 중요하다는 신호일 수 있습니다. 갈등을 피하지 말고 대화로 풀어가세요.`,
      '갈등이 있다는 건 아직 포기하지 않았다는 뜻입니다. 그 에너지를 이해로 전환하면 관계는 더 깊어집니다.',
    ],
    material:[
      (w)=>w?.type==='love_person'?`${w.word}와의 관계를 현실적인 눈으로도 바라볼 필요가 있습니다. 감정만큼 삶의 방향이 맞는지도 중요한 요소입니다.`
        :`관계를 현실적인 눈으로 보는 것도 필요합니다. 감정만큼 서로의 삶의 방향이 맞는지도 중요한 요소입니다.`,
      '사랑은 감정이지만 관계는 현실입니다. 서로의 가치관과 방향이 맞는지 차분히 살펴보세요.',
    ],
    persist:[
      (w)=>w?.type==='love_person'?`${w.word}와의 관계에서 쉽지 않은 시간을 버텨오고 있군요. 그 인내가 이 관계를 더 단단하게 만들고 있습니다.`
        :`쉽지 않은 시간을 버텨오고 있군요. 그 인내가 이 관계를 더 단단하게 만들고 있습니다. 조금만 더 믿어보세요.`,
      '오래 기다려온 마음은 결코 헛되지 않습니다. 진심은 언젠가 반드시 그 자리를 찾아갑니다.',
    ],
  };
  const byWork={
    new:[
      (w)=>w?.type==='work_event'&&w.word==='면접'?`면접이라는 새로운 도전 앞에 서 있군요. 준비해온 것을 믿고 자신 있게 자신을 표현해보세요. 기회는 준비된 사람에게 옵니다.`
        :w?.type==='work_goal'?`${w.word}을 향한 새로운 출발선에 서 있습니다. 준비가 완벽하지 않아도 괜찮아요. 시작하는 용기가 성공의 첫 번째 조건입니다.`
        :`새로운 기회가 문을 두드리고 있습니다. 준비가 완벽하지 않아도 괜찮아요. 시작하는 용기가 성공의 첫 번째 조건입니다.`,
      '지금 이 출발이 훗날 가장 중요한 전환점이 될 수 있습니다. 두려움보다 가능성에 집중하세요.',
    ],
    growth:[
      (w)=>w?.type==='work_goal'?`${w.word}을 향해 꾸준히 쌓아온 노력이 드디어 빛을 발하기 시작합니다. 지금의 성장세를 믿고 더 높은 곳을 향해 나아가세요.`
        :`꾸준히 쌓아온 노력이 드디어 빛을 발하기 시작합니다. 지금의 성장세를 믿고 더 높은 곳을 향해 나아가세요.`,
      '성장은 눈에 보이지 않을 때도 계속되고 있습니다. 지금 이 시간이 내일의 도약을 만들고 있음을 믿으세요.',
    ],
    change:[
      (w)=>w?.type==='work_goal'&&w.word==='이직'?`이직이라는 변화의 기로에 서 있군요. 익숙한 것을 내려놓는 것이 두렵더라도, 더 맞는 곳으로의 이동이 될 수 있습니다.`
        :w?.type==='work_goal'&&w.word==='사업'?`사업이라는 큰 변화를 앞두고 있군요. 불확실성을 두려워하지 말고 준비된 것을 믿고 나아가세요.`
        :`커리어나 환경에 변화가 찾아오고 있습니다. 익숙한 것을 내려놓는 것이 두렵더라도, 변화가 더 나은 미래를 만들어줄 것입니다.`,
      '지금의 변화가 불안하게 느껴질 수 있지만, 흐름을 타는 사람이 결국 더 멀리 갑니다.',
    ],
    inner:[
      (w)=>w?.type==='work_goal'?`정말 ${w.word}이 자신이 원하는 것인지 한 번 더 들여다볼 필요가 있습니다. 내면의 소리에 귀 기울이면 진짜 방향이 보입니다.`
        :`지금 하는 일이 진정 자신이 원하는 것인지 돌아볼 시간입니다. 내면의 소리에 귀 기울이면 진짜 방향이 보입니다.`,
      '열심히 달려왔다면 잠시 멈추고 방향을 점검하세요. 빠르게 가는 것보다 바르게 가는 것이 더 중요합니다.',
    ],
    choice:[
      (w)=>w?.type==='work_goal'?`${w.word}과 관련된 중요한 결정 앞에 서 있습니다. 단기적 이익보다 장기적으로 자신을 성장시킬 선택이 무엇인지 생각해보세요.`
        :`중요한 결정 앞에 서 있습니다. 단기적 이익보다 장기적으로 자신을 성장시킬 선택이 무엇인지 생각해보세요.`,
      '어떤 선택이든 지금의 당신이 내린 결정이 가장 나답습니다. 스스로를 믿고 결단하세요.',
    ],
    ending:[
      (w)=>w?.type==='work_goal'?`${w.word}의 한 단계가 마무리되고 있습니다. 이 끝은 실패가 아니라 더 맞는 곳으로 가기 위한 이동입니다.`
        :`한 단계가 마무리되고 있습니다. 이 끝은 실패가 아니라 더 맞는 곳으로 가기 위한 이동입니다. 두려워하지 마세요.`,
      '마무리가 두렵더라도 끝내야 새로운 시작이 가능합니다. 지금의 마침표가 내일의 문을 열어줍니다.',
    ],
    balance:[
      (w)=>w?.type==='work_exam'?`${w.word} 준비로 지쳐있을 수 있습니다. 일과 휴식의 균형이 오히려 더 좋은 결과를 만들어냅니다.`
        :`일과 삶의 균형을 점검할 때입니다. 지속 가능한 속도로 나아가는 것이 장기적으로 훨씬 더 큰 성과를 만들어냅니다.`,
      '무리하게 달리다 쓰러지는 것보다 꾸준히 나아가는 것이 훨씬 멀리 갑니다. 지금 속도를 조절해보세요.',
    ],
    power:[
      (w)=>w?.type==='work_event'&&w.word==='면접'?`면접장에서 지금까지 쌓아온 실력과 경험을 믿으세요. 당신이 준비한 것은 충분히 빛을 발할 것입니다.`
        :w?.type==='work_goal'?`${w.word}을 위해 쌓아온 실력과 경험이 빛을 발할 시기입니다. 자신감을 갖고 앞으로 나서세요.`
        :`지금까지 쌓아온 실력과 경험이 빛을 발할 시기입니다. 자신감을 갖고 앞으로 나서세요. 당신의 능력은 충분합니다.`,
      '오랫동안 준비해온 것이 결코 헛되지 않습니다. 자신의 능력을 믿고 당당하게 나아가세요.',
    ],
    shadow:[
      (w)=>w?.type==='work_exam'?`${w.word}에 대한 불안이 실력을 가리고 있을 수 있습니다. 두려움을 인정하고 그것과 함께 앞으로 나아가세요.`
        :`두려움이나 자기 의심이 발목을 잡고 있지는 않은가요? 스스로를 믿는 것이 지금 가장 필요한 능력입니다.`,
      '의심은 준비하는 사람에게 찾아오는 자연스러운 감정입니다. 그 의심을 동력으로 삼아 한 걸음 더 나아가세요.',
    ],
    conflict:[
      (w)=>w?.type==='work_goal'?`${w.word} 과정에서 만나는 어려움은 더 단단해지기 위한 과정입니다. 갈등을 피하지 말고 정면으로 마주하세요.`
        :`지금의 마찰과 어려움은 더 단단해지기 위한 과정입니다. 갈등을 피하지 말고 정면으로 마주하세요.`,
      '직장이나 학업에서의 갈등은 성장통입니다. 회피하지 않고 직면하는 것이 결국 더 강한 당신을 만들어냅니다.',
    ],
    connect:[
      '혼자보다 함께할 때 더 큰 성과가 납니다. 주변의 도움을 받아들이고, 좋은 관계 안에서 성장하세요.',
      '함께 성장하는 동료나 멘토가 지금 당신에게 필요한 존재일 수 있습니다. 주변을 살펴보세요.',
    ],
    passion:[
      (w)=>w?.type==='work_goal'?`${w.word}에 대한 열정을 잃지 않는 것이 가장 중요한 자산입니다. 그 불꽃이 있는 한 어떤 어려움도 돌파할 수 있습니다.`
        :`일에 대한 열정을 잃지 않는 것이 가장 중요한 자산입니다. 그 불꽃이 있는 한 어떤 어려움도 돌파할 수 있습니다.`,
      '처음에 이 일을 시작했던 이유를 떠올려보세요. 그 초심이 지금의 에너지를 다시 불러올 것입니다.',
    ],
    material:[
      (w)=>w?.type==='work_goal'?`${w.word}을 위한 현실적인 계획과 꾸준한 실행이 결실을 맺는 시기입니다. 구체적인 목표를 세우고 한 걸음씩 나아가세요.`
        :`현실적인 계획과 꾸준한 실행이 결실을 맺는 시기입니다. 구체적인 목표를 세우고 한 걸음씩 나아가세요.`,
      '거창한 목표보다 오늘 할 수 있는 작은 한 가지에 집중하세요. 그것이 쌓여 큰 결실이 됩니다.',
    ],
    persist:[
      (w)=>w?.type==='work_exam'?`${w.word} 준비로 지쳐있을 수 있지만, 지금까지 버텨온 시간이 결코 헛되지 않았습니다. 마지막 힘을 끌어내세요.`
        :w?.type==='work_goal'?`${w.word}을 향해 버텨온 시간이 결코 헛되지 않았습니다. 포기하지 않는 것 자체가 이미 대단한 성취입니다.`
        :`지금까지 버텨온 시간이 결코 헛되지 않았습니다. 포기하지 않는 것 자체가 이미 대단한 성취입니다.`,
      '오래 걸리는 것이 반드시 잘못된 것은 아닙니다. 진심으로 달려온 사람에게 결과는 반드시 찾아옵니다.',
    ],
    emotion:[
      '감정적으로 지쳐있을 수 있습니다. 잠시 쉬어가는 것도 전략입니다. 회복한 후 더 강하게 나아갈 수 있어요.',
      '번아웃이 올 것 같다면 지금이 바로 멈춰야 할 신호입니다. 잠시 쉬어가는 것이 오히려 더 빠른 길입니다.',
    ],
  };
  const byEtc={
    new:'새로운 시작의 에너지가 감돌고 있습니다. 지나온 길의 흔적들이 이제 새로운 출발의 자양분이 되고 있어요. 두려움보다 설렘을 선택할 때입니다.',
    growth:'과거의 경험과 현재의 노력이 쌓여 진정한 성장으로 이어지고 있습니다. 그 열매는 생각보다 크고 단단할 것입니다.',
    change:'흐름이 바뀌고 있습니다. 유연하게 적응하는 것이 지금 당신에게 가장 강력한 선택입니다.',
    balance:'오랜 여정 끝에 균형의 시간이 찾아오고 있습니다. 지금까지의 모든 경험이 비로소 조화를 이룰 것입니다.',
    inner:'모든 답은 이미 당신 안에 있습니다. 내면의 목소리에 귀 기울이는 것이 지금 가장 필요합니다.',
    connect:'소중한 연결이 앞으로의 여정을 풍요롭게 만들어줄 것입니다. 마음을 열어두세요.',
    power:'지나온 모든 것이 당신을 강하게 만들었습니다. 이제 그 힘을 온전히 발휘할 시간입니다.',
    ending:'끝은 또 다른 시작입니다. 내려놓는 용기가 더 큰 가능성을 열어줄 것입니다.',
    shadow:'두려움을 인식하는 것 자체가 자유를 향한 첫걸음입니다. 사슬은 생각보다 약합니다.',
    choice:'어느 쪽이든 진심에서 나온 결정이라면 그것이 옳은 길입니다. 선택 자체를 두려워하지 마세요.',
    passion:'열정이 앞길을 밝히고 있습니다. 그 불꽃을 믿고 망설임 없이 나아가세요.',
    emotion:'감정이 이끄는 방향에 진실이 있습니다. 마음의 소리를 외면하지 마세요.',
    conflict:'갈등은 성장의 다른 이름입니다. 지금의 마찰이 결국 더 강한 당신을 만들어냅니다.',
    material:'현실적인 토대가 단단해지고 있습니다. 꾸준함이 결국 풍요로 돌아오는 시기입니다.',
    persist:'버텨온 시간이 결코 헛되지 않았습니다. 지금 이 자리가 다음 도약의 발판이 됩니다.',
  };


// ── 질문 분석 ──
function analyzeQuestion(q){
  const t=q.trim();
  if(t.length<4) return{ok:false,reason:'너무 짧아요. 질문을 좀 더 적어주세요.'};
  if(/^[^가-힣a-zA-Z]+$/.test(t)) return{ok:false,reason:'한글이나 영문으로 질문을 입력해주세요.'};
  if(t.replace(/[^가-힣a-zA-Z]/g,'').length<3) return{ok:false,reason:'조금 더 구체적으로 적어주세요.'};
  const love=['사랑','연애','남자친구','여자친구','남친','여친','짝사랑','고백','이별','헤어','결혼','썸','감정','좋아하','사귀','연인','배우자','남편','아내','데이트','설레','마음','호감','재회','이성','관계','만나는','만나고','만남','그 사람','그사람','좋아지','보고싶','보고 싶','플러팅','밀당','잘될','잘 될','오래갈','오래 갈','차였','차이','차일','고백할','프로포즈','우리 사이','우리사이','애인','파트너','연락','답장','카톡','문자','차버','사이','그남자','그여자','그 남자','그 여자','오빠','언니','형','누나','첫사랑','전남친','전여친','전 남친','전 여친','전남자친구','전여자친구',
    '걔','쟤','그 애','그애','이 애','이애','잘되고','잘 되고','함께','같이 있','같이있','사귈','사귀고','사귀고 싶','만나고 싶','만나고싶','보고 싶','보고싶','연락하고','설레는','설레고','두근','떨려','떨린','어떻게 생각','어떻게생각','나를 좋아','나를좋아','좋아할까','좋아하는지','관심','밀어','당겨','밀고 당기','사이 좋','사이좋','더 가까','더가까','친해지','친해질'];
  const work=['취업','직장','회사','알바','이직','승진','사업','창업','시험','공부','학교','대학','입시','수능','자격증','면접','커리어','진로','직업','업무','프로젝트','돈','수입','월급','투자','합격','상사','동료','부하','팀장','팀원','대표','사장','직원','퇴사','퇴직','연봉','계약','인턴','신입','경력','이력서','포트폴리오','스타트업','오피스','재택','출근','야근','워라밸','번아웃','업계','직무','성과','실적','발표','보고','미팅','클라이언트','프리랜서','옮겨','옮길','그만','그만둬','그만두','다닐','다녀','직장인','안맞','안 맞'];
  const lv=love.filter(k=>t.includes(k)).length;
  const wv=work.filter(k=>t.includes(k)).length;
  let cat='기타',badge='🔮',color='rgba(180,150,220,.85)';
  if(wv>0&&wv>=lv){cat='직업 · 학업';badge='📖';color='rgba(120,180,220,.85)';}
  else if(lv>0){cat='연애 · 관계';badge='💫';color='rgba(220,130,160,.85)';}
  return{ok:true,cat,badge,color};
}

export default function App(){
  const[question,setQuestion]=useState('');
  const[phase,setPhase]=useState('input');
  const[cards,setCards]=useState([]);
  const[revealed,setRevealed]=useState([false,false,false]);
  const[qError,setQError]=useState('');
  const[qInfo,setQInfo]=useState(null);
  const[aiMsg,setAiMsg]=useState('');
  const[aiLoading,setAiLoading]=useState(false);
  const[extraCards,setExtraCards]=useState([]);   // 조언+방해물 카드 2장
  const[extraRevealed,setExtraRevealed]=useState([false,false,false]);
  const[extraMsg,setExtraMsg]=useState('');
  const[extraLoading,setExtraLoading]=useState(false);
  const[dark,setDark]=useState(true);

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
    // GA4 이벤트 — 리딩 시작
    const _kw=extractKeyword(question);
    if(window.gtag) window.gtag('event','reading_start',{category:r.cat,keyword:_kw?.word||'없음',intent:_kw?.intent||'없음'});
    // 카드 등장 후 자동으로 AI 리딩 시작
    setTimeout(()=>_aiReadWithCards(d, r),1100);
  }
  async function _aiReadWithCards(cardsArg, qInfoArg){
    setAiLoading(true);
    setAiMsg('');
    const cat = qInfoArg?.cat || '기타';
    const prompt = `당신은 타로 리더입니다. 질문자의 상황에 직접 답하는 타로 메시지를 써주세요.

[질문자의 질문]
"${question}"

[카테고리]
${cat}

[뽑힌 카드]
- 과거: ${cardsArg[0].kr} — ${cardsArg[0].reading}
- 현재: ${cardsArg[1].kr} — ${cardsArg[1].reading}
- 미래: ${cardsArg[2].kr} — ${cardsArg[2].reading}

[작성 규칙]
1. 가장 중요: 질문자가 실제로 궁금해하는 것에 직접 답해야 합니다. 질문의 핵심 상황(회사, 관계, 시험 등)을 메시지에 반드시 반영하세요.
2. 과거→현재→미래 카드의 흐름을 내러티브로 이어주세요.
3. 카드 이름이나 타로 용어는 직접 언급하지 마세요. 카드의 의미를 자연스럽게 녹여주세요.
4. 질문자에게 직접 말하는 2인칭(당신) 어투로 써주세요.
5. 필요하면 의문문을 써도 좋습니다.
6. 감성적이고 따뜻하되, 구체적이고 실질적인 내용을 담아주세요.
7. 3~5문장 이내로 써주세요.
8. 답변 텍스트만 출력하세요. 제목이나 부가 설명 없이.`;

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
    // 기존 3장 제외하고 2장 추가 뽑기
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
    const prompt = `당신은 타로 리더입니다. 기존 3장 리딩에 이어, 조언 카드와 방해물 카드 2장을 추가로 해석해주세요.

[질문]
"${question}" (카테고리: ${cat})

[기존 3장]
- 과거: ${cards[0].kr} — ${cards[0].reading}
- 현재: ${cards[1].kr} — ${cards[1].reading}
- 미래: ${cards[2].kr} — ${cards[2].reading}

[추가 카드]
- 방해물: ${extraCardsArg[0].kr} — ${extraCardsArg[0].reading}
- 상대방/주변환경: ${extraCardsArg[1].kr} — ${extraCardsArg[1].reading}
- 조언: ${extraCardsArg[2].kr} — ${extraCardsArg[2].reading}

[작성 규칙]
1. 기존 3장의 흐름과 맥락을 이어받아 해석해주세요.
2. 방해물 카드 — 지금 앞을 막고 있는 것, 주의해야 할 것을 현실적으로 짚어주세요.
3. 상대방/주변환경 카드 — 지금 주변 상황이나 상대방의 에너지를 읽어주세요.
4. 조언 카드 — 이 상황에서 취해야 할 구체적인 행동 방향으로 마무리해주세요.
5. 질문자의 실제 상황(회사, 관계 등)에 직접 연결해서 써주세요.
6. 카드 이름이나 타로 용어는 절대 언급하지 마세요.
7. 2인칭 어투, 감성적이되 구체적으로, 4~6문장 이내.
8. 답변 텍스트만 출력하세요.`;

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
    // ec[0]=방해물, ec[1]=주변환경, ec[2]=조언
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
    // 마크다운 볼드(**텍스트**) 제거
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
  // 다크/라이트 색상 분기
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
          {/* 다크/라이트 토글 */}
          <div style={{display:'flex',justifyContent:'center',marginTop:8}}>
            <button onClick={()=>setDark(d=>!d)} style={{background:'transparent',border:`1px solid ${borderCol}`,color:gd,fontFamily:'"Outfit",sans-serif',fontSize:'.72rem',letterSpacing:'.18em',padding:'6px 16px',cursor:'pointer',borderRadius:20,transition:'all .3s',textTransform:'uppercase',fontWeight:300}}>
              {dark ? '☀ LIGHT' : '☾ DARK'}
            </button>
          </div>
        </header>
        {phase==='input'&&<div style={{background:bgCard,border:`1px solid ${borderCol}`,borderRadius:8,padding:28}}>
          <div style={{fontFamily:'"Noto Sans KR",sans-serif',fontSize:'.85rem',letterSpacing:'.12em',color:gd,marginBottom:10,fontWeight:400}}>질문을 입력하세요</div>
          <textarea rows={3} value={question} onChange={onQuestionChange} placeholder="마음속에 품은 고민이나 앞날에 대한 궁금증을 적어주세요." style={{width:'100%',background:bgInput,border:`1px solid ${qError?'rgba(220,100,100,.5)':borderCol}`,borderRadius:6,color:iv,fontFamily:'"Noto Sans KR",sans-serif',fontSize:'1rem',lineHeight:1.9,padding:'14px 16px',resize:'none',transition:'border-color .3s',fontWeight:300}}/>
          {/* 에러 메시지 */}
          {qError&&<div style={{fontFamily:'"Noto Sans KR",sans-serif',fontSize:'.85rem',color:'rgba(220,120,120,.9)',marginTop:8,fontWeight:400}}>⚠ {qError}</div>}
          {/* 카테고리 배지 */}
          {qInfo&&!qError&&<div style={{display:'flex',alignItems:'center',gap:8,marginTop:10}}>
            <span style={{fontSize:'.8rem',fontFamily:'"Noto Sans KR",sans-serif',fontWeight:300,color:'rgba(245,238,220,.45)'}}>인식된 주제</span>
            <span style={{fontFamily:'"Noto Sans KR",sans-serif',fontSize:'.82rem',padding:'3px 12px',borderRadius:20,background:`${qInfo.color}22`,border:`1px solid ${qInfo.color}`,color:qInfo.color,fontWeight:500}}>{qInfo.badge} {qInfo.cat}</span>
          </div>}
          <div style={{display:'flex',gap:8,margin:'14px 0 18px',flexWrap:'wrap'}}>{['웨이트 덱 78장','쓰리카드','정방향 해석'].map(t=><span key={t} style={{fontFamily:'"Noto Sans KR",sans-serif',fontSize:'.8rem',padding:'4px 12px',border:'1px solid rgba(226,184,78,.18)',borderRadius:20,color:gd,letterSpacing:'.06em',fontWeight:300}}>{t}</span>)}</div>
          <button className="br" onClick={start} style={{width:'100%',background:'rgba(226,184,78,.08)',border:`1px solid ${gd}`,color:g,fontFamily:'"Outfit",sans-serif',fontSize:'1rem',letterSpacing:'.32em',textTransform:'uppercase',padding:'16px',cursor:'pointer',borderRadius:6,transition:'all .3s',fontWeight:500}}>✦  타로 보기  ✦</button>
        </div>}
        {phase==='result'&&<>

          {/* ── 카드 영역 ── 3열 고정, 추가 카드는 다음 줄 */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:28}}>
            {/* 기본 3장 */}
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
            {/* 조언·방해물 2장 + 빈 칸 1개 */}
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

          {/* ── 해석 영역 ── */}
          {revealed[2]&&<div style={{animation:'fadeUp .65s ease'}}>

            {/* 질문 + 카테고리 */}
            <div style={{textAlign:'center',marginBottom:20}}>
              <div style={{display:'inline-flex',alignItems:'center',gap:8,flexWrap:'wrap',justifyContent:'center'}}>
                {qInfo&&<span style={{fontFamily:'"Noto Sans KR",sans-serif',fontSize:'.78rem',padding:'3px 11px',borderRadius:20,background:`${qInfo.color}18`,border:`1px solid ${qInfo.color}88`,color:qInfo.color,fontWeight:400}}>{qInfo.badge} {qInfo.cat}</span>}
                <span style={{fontFamily:'"Noto Sans KR",sans-serif',fontSize:'1rem',color:textSub,fontWeight:300}}>"{question}"</span>
              </div>
            </div>

            {/* 종합 메시지 — 데이터 유지, UI 숨김 */}
            {false&&<div>{getSynthesis(cards, qInfo?.cat, question)}</div>}

            {/* AI 리딩 */}
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

            {/* 조언·방해물 해석 */}
            {(extraLoading||extraMsg)&&<div style={{background:bgCard,border:`1px solid ${borderCol}`,borderRadius:8,padding:'20px 24px',marginTop:14,animation:'fadeUp .5s ease'}}>
              <div style={{fontFamily:'"Outfit",sans-serif',fontSize:'.92rem',letterSpacing:'.14em',color:g,textAlign:'center',marginBottom:16,textTransform:'uppercase',fontWeight:300}}>조언 듣기</div>
              {extraLoading&&<div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,padding:'16px 0',color:gd,fontFamily:'"Noto Sans KR",sans-serif',fontSize:'.9rem',fontWeight:300}}>
                <span style={{display:'inline-block',width:14,height:14,border:'1.5px solid rgba(226,184,78,.4)',borderTopColor:g,borderRadius:'50%',animation:'spin 0.8s linear infinite',flexShrink:0}}/>
                카드를 읽는 중...
              </div>}
              {extraMsg&&<div style={{fontFamily:'"Noto Sans KR",sans-serif',fontSize:'1rem',lineHeight:2.1,color:textFaint,fontWeight:300,animation:'fadeUp .5s ease'}}>{formatAiMsg(extraMsg)}</div>}
            </div>}

          </div>}

          {/* 하단 버튼 */}
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
