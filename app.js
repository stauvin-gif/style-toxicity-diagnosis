const questions = [
  `If we lose three games in a row, I can genuinely say “GGs” and go do something else without thinking about it.`,
  `If we're keeping score, I want to win. I don't care if it's FIFA, Uno, bowling, or rock-paper-scissors.`,
  `I'll happily play a boring position or role if that's what gives the squad the best chance to win.`,
  `When something keeps going wrong, I want to figure out why instead of just running it back.`,
  `A group chat needs at least one person willing to say something outrageous occasionally or it's going to get boring.`,
  `When several people disagree with me at once, it starts feeling less like disagreement and more like I'm being ganged up on.`,
  `Someone can absolutely cook me in the group chat and, if it's funny enough, I'll laugh too. 😂`,
  `I would rather lose a close, competitive game against good players than destroy people who aren't very good.`,
  `When one teammate is clearly struggling, I naturally start adjusting how I play to help them.`,
  `I notice things like positioning, spacing, tendencies, and repeated mistakes that other people seem to miss.`,
  `Be honest: I enjoy it when I enter the chat and people immediately react to me being there. 😂`,
  `If somebody comes at me disrespectfully, I'm probably responding—even if ignoring them would end the situation faster.`,
  `I'm perfectly capable of playing all night without being the best player, top scorer, loudest person, or center of attention.`,
  `When we lose because somebody made an obviously stupid decision, it is genuinely difficult for me not to say something.`,
  `I'd rather make the pass that wins the game than score the winner myself.`,
  `I've caught myself thinking about formations, lineups, builds, tactics, or strategy when I'm not even playing.`,
  `Half the fun of gaming with friends is the stories, jokes, arguments, memes, and nonsense that happen outside the actual game.`,
  `If three people I respect tell me I'm the one causing the problem, my first thought is probably: “Damn…maybe they're right.”`,
  `A teammate repeatedly making the same mistake bothers me more than losing because the other team was simply better.`,
  `After a heated argument, I can usually let it go without needing the other person to admit that I was right.`
];

const traitRules = {
  'Blinker': [[1,1],[7,1],[13,1],[20,1],[6,-1],[12,-1],[14,-1]],
  'The Sweat': [[2,1],[8,1],[14,1],[19,1],[1,-1]],
  'Unc': [[3,1],[9,1],[15,1],[18,1],[20,1]],
  'The Professor': [[4,1],[10,1],[16,1],[19,1],[18,1]],
  'The Content Creator': [[5,1],[11,1],[17,1],[13,-1]],
  'The Crashout': [[6,1],[12,1],[14,1],[18,-1],[20,-1]]
};

const art = {
  'Blinker':'blinker.png',
  'The Sweat':'sweat.png',
  'Unc':'unc.png',
  'The Professor':'professor.png',
  'The Content Creator':'content-creator.png',
  'The Crashout':'crashout.png'
};

const combos = {};
function pair(a,b,name,description){combos[[a,b].sort().join('|')]={name,description}}
pair('The Sweat','Unc','The Captain','Wants the W, but wants everybody eating.');
pair('The Sweat','The Professor','The FUT Manager','Already diagnosed why you’re losing and would like control of tactics.');
pair('The Sweat','The Crashout','The Controller Replacement Plan','Competition is healthy. This is less so.');
pair('The Sweat','The Content Creator','The Tryhard Influencer','Every match is both competition and an episode.');
pair('The Sweat','Blinker','The Silent Killer','Sweats hard while acting like he doesn’t care.');
pair('Unc','Blinker','The Cookout Unc','Good vibes, keeps everybody together, avoids internet beef.');
pair('Unc','The Professor','Coach Unc','Helpful until the unsolicited halftime speech begins.');
pair('Unc','The Content Creator','The Locker-Room Guy','The squad is objectively less fun without you.');
pair('Unc','The Crashout','Unc Had Enough','Usually reasonable. Unfortunately, they found the limit.');
pair('The Professor','Blinker','The High IQ Casual','Sees everything. Feels no urgent need to yell about it.');
pair('The Professor','The Content Creator','The Pundit','Nobody requested the post-match analysis. It arrived anyway.');
pair('The Professor','The Crashout','The Tactical Meltdown','A 14-message explanation of exactly how you’re wrong.');
pair('The Content Creator','Blinker','The Vibe Merchant','Laughs, clips, memes — approximately 63% required defending.');
pair('The Content Creator','The Crashout','The Group Chat Incident','“Bro…what happened last night?”');
pair('Blinker','The Crashout','The Bad Trip','Usually chilling. Then suddenly nobody is chilling.');

const scaleCopy = {
  1:['STRONGLY DISAGREE','Not even a little.'],
  2:['DISAGREE','Mostly no.'],
  3:['NEUTRAL','Depends on the day.'],
  4:['AGREE','Yeah, pretty much.'],
  5:['STRONGLY AGREE','That is absolutely me.']
};

const RESULTS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzZZRCuxWLKpAhSrdDES_Sgi9Hi5acK3FeIDXq466l7fXX75GL4ZN1EWZmuN-xROW_v8g/exec';

let state={name:'',index:0,answers:Array(20).fill(null),submitted:false};
const app=document.querySelector('#app');

function chrome(content){
  return `<div class="app-screen">
    <header class="topbar">
      <img class="small-logo" src="small-logo.png" alt="Style Toxicity Diagnosis" />
      <nav class="toplinks">
        <button onclick="home()">HOME</button>
        <button onclick="startTest()">TAKE THE TEST</button>
        <button class="top-status" onclick="startTest()">♛ KNOW YOUR STATUS</button>
      </nav>
    </header>
    ${content}
  </div>`;
}

function home(){
  window.scrollTo(0,0);
  app.innerHTML=`<main class="landing-shell">
    <div class="poster-wrap">
      <img src="approved-landing.png" alt="Style Toxicity Diagnosis — Know Your Status" />
      <button class="hero-hotspot-top" aria-label="Take the test" onclick="startTest()">Take the test</button>
      <button class="hero-hotspot" aria-label="Take the test" onclick="startTest()">Take the test</button>
      <div class="landing-caption">Entertainment only. Not a medical or psychological diagnosis.</div>
    </div>
  </main>`;
}

function startTest(){
  state.index=0;
  state.answers=Array(20).fill(null);
  state.submitted=false;
  nameScreen();
}

function nameScreen(){
  window.scrollTo(0,0);
  app.innerHTML=chrome(`<main class="page">
    <section class="name-stage">
      <div class="name-art"><img src="brand-lockup.png" alt="Style Toxicity Diagnosis" /></div>
      <div class="name-panel">
        <div class="kicker">☣ PATIENT INTAKE // STYLE CHAT</div>
        <h1>WHO'S GETTING<br><span class="cyan">TESTED?</span></h1>
        <p>Enter the name the group chat knows you by. Twenty questions later, your friends receive ammunition.</p>
        <input id="displayName" maxlength="30" autocomplete="nickname" placeholder="Display name / gamertag" value="${escapeHtml(state.name)}" />
        <button class="cta" onclick="beginQuestions()">BEGIN DIAGNOSIS →</button>
      </div>
    </section>
  </main>`);
  setTimeout(()=>document.querySelector('#displayName')?.focus(),0);
}

function beginQuestions(){
  const value=document.querySelector('#displayName')?.value.trim();
  state.name=value||'Anonymous';
  renderQuestion();
}

function renderQuestion(){
  window.scrollTo({top:0,behavior:'smooth'});
  const i=state.index;
  const selected=state.answers[i];
  app.innerHTML=chrome(`<main class="page">
    <section class="quiz-shell">
      <div class="quiz-head">
        <div>
          <div class="kicker">STYLE TOXICITY DIAGNOSIS</div>
          <div class="qcount">QUESTION <strong>${i+1}</strong> OF 20</div>
        </div>
        <div class="kicker">${escapeHtml(state.name)}</div>
      </div>
      <div class="progress"><i style="width:${((i+1)/20)*100}%"></i></div>
      <div class="question-paper">${questions[i]}</div>
      <div class="scale-list">
        ${[1,2,3,4,5].map(v=>`<button class="scale-choice ${selected===v?'selected':''}" onclick="choose(${v})">
          <div class="scale-num">${v}</div>
          <div class="scale-copy"><strong>${scaleCopy[v][0]}</strong><span>${scaleCopy[v][1]}</span></div>
        </button>`).join('')}
      </div>
      <div class="quiz-nav">
        <button class="ghost" onclick="goBack()">← BACK</button>
        ${selected ? `<button class="cta" onclick="goNext()">${i===19?'GET RESULTS':'NEXT'} →</button>` : ''}
      </div>
    </section>
  </main>`);
}

function choose(value){state.answers[state.index]=value;renderQuestion()}
function goBack(){if(state.index>0){state.index--;renderQuestion()}else{nameScreen()}}
function goNext(){if(!state.answers[state.index])return;if(state.index<19){state.index++;renderQuestion()}else{analyze()}}

function calculate(){
  const scores={};
  for(const [trait,items] of Object.entries(traitRules)){
    let raw=0;
    items.forEach(([q,direction])=>{
      const value=state.answers[q-1];
      raw += direction===1 ? value-1 : 5-value;
    });
    scores[trait]=Math.round(raw/(items.length*4)*100);
  }
  const traitOrder=Object.keys(traitRules);
  const ordered=Object.entries(scores).sort((a,b)=>b[1]-a[1] || traitOrder.indexOf(a[0])-traitOrder.indexOf(b[0]));
  const primary=ordered[0][0];
  const secondary=ordered.find(([name])=>name!==primary)[0];
  return {scores,primary,secondary};
}

function analyze(){
  window.scrollTo(0,0);
  app.innerHTML=chrome(`<main class="analyze-stage">
    <section class="analyze-card">
      <div class="analyze-inner">
        <img src="brand-lockup.png" alt="Style Toxicity Diagnosis" />
        <div class="analyze-title">ANALYZING<br><em>YOUR RESPONSES…</em></div>
        <div class="scan-list">
          <div class="scan-row"><span>SCANNING STYLE</span><span>✓</span></div>
          <div class="scan-row"><span>MEASURING EGO</span><span>✓</span></div>
          <div class="scan-row"><span>CHECKING MINDSET</span><span>✓</span></div>
          <div class="scan-row"><span>DETECTING TOXICITY</span><span>✓</span></div>
          <div class="scan-row"><span>RUNNING DIAGNOSIS</span><span>◌</span></div>
        </div>
      </div>
    </section>
  </main>`);
  setTimeout(renderResults,1350);
}

function toxicityInfo(value){
  if(value<=20)return {band:'ZEN',color:'#5cff5f',desc:'You may actually possess emotional regulation.',treatment:'Continue touching grass as needed.'};
  if(value<=40)return {band:'NORMAL HUMAN',color:'#67f18f',desc:'Occasional salt. Nothing concerning.',treatment:'No intervention required. Salt intake appears normal.'};
  if(value<=60)return {band:'GETTING SPICY',color:'#ffd63d',desc:'Probably safe, but we’ve seen the typing bubble appear and disappear six times.',treatment:'Hydrate, mute the chat for 10 minutes, then reassess.'};
  if(value<=80)return {band:'CHAT ON ALERT',color:'#ff9231',desc:'Screenshots may be required.',treatment:'Put the phone down before screenshots become evidence.'};
  return {band:'FULL CRASHOUT',color:'#ff3148',desc:'Do not engage. Do not quote-reply. Someone please take his phone.',treatment:'DO NOT ENGAGE. Someone please take his phone.'};
}
function sheetStatus(value){
  if(value<=20)return '🟢 Zen';
  if(value<=40)return '🟢 Normal Human';
  if(value<=60)return '🟡 Getting Spicy';
  if(value<=80)return '🟠 Chat on Alert';
  return '🔴 FULL CRASHOUT';
}

function submitResult(r,tox,combo){
  if(state.submitted)return;
  state.submitted=true;

  const toxicity=r.scores['The Crashout'];

  const payload={
    name:state.name,
    answers:[...state.answers],
    scores:{
      blinker:r.scores['Blinker'],
      sweat:r.scores['The Sweat'],
      unc:r.scores['Unc'],
      professor:r.scores['The Professor'],
      contentCreator:r.scores['The Content Creator'],
      crashout:r.scores['The Crashout']
    },
    primary:r.primary,
    secondary:r.secondary,
    diagnosis:combo.name,
    diagnosisText:combo.description,
    toxicity:toxicity,
    status:sheetStatus(toxicity),
    treatment:tox.treatment
  };

  fetch(RESULTS_ENDPOINT,{
    method:'POST',
    mode:'no-cors',
    headers:{'Content-Type':'text/plain;charset=utf-8'},
    body:JSON.stringify(payload),
    keepalive:true
  }).catch(err=>{
    console.warn('STD result capture failed:',err);
    state.submitted=false;
  });
}
function renderResults(){
  window.scrollTo(0,0);
  const r=calculate();
  const toxicity=r.scores['The Crashout'];
  const tox=toxicityInfo(toxicity);
  const combo=combos[[r.primary,r.secondary].sort().join('|')] || {name:r.primary,description:'Your dominant Style Chat condition.'};
  const comboWords=combo.name.split(' ');
  const comboMarkup=comboWords.length>1 ? `${comboWords.slice(0,-1).join(' ')} <em>${comboWords.at(-1)}</em>` : `<em>${combo.name}</em>`;

  app.innerHTML=chrome(`<main class="results-page">
    <section class="results-title">
      <div class="kicker">🧪 ${escapeHtml(state.name)} // YOUR S.T.D. RESULTS ARE IN</div>
      <div class="brush">YOUR <span class="cyan">DIAGNOSIS</span></div>
      <p>Official enough to screenshot. Not official enough to show a doctor.</p>
    </section>

    <section class="diag-grid">
      <div class="diagnosis-card">
        <div class="primary-wrap">
          <img class="primary-art" src="${art[r.primary]}" alt="${r.primary}" />
          <div>
            <div class="diag-label">OFFICIAL STYLE CHAT DIAGNOSIS</div>
            <div class="combo-name">${comboMarkup}</div>
            <div class="diag-copy">${combo.description}</div>
            <div class="trait-pair">
              <div class="trait-pill"><span>PRIMARY ARCHETYPE</span><b>${r.primary}</b></div>
              <div class="trait-pill"><span>SECONDARY ARCHETYPE</span><b>${r.secondary}</b></div>
            </div>
          </div>
        </div>
      </div>

      <aside class="tox-card">
        <div class="tox-label">☣ TOXICITY LEVEL</div>
        <div class="tox-num" style="color:${tox.color}">${toxicity}%</div>
        <div class="tox-band" style="color:${tox.color}">${tox.band}</div>
        <div class="tox-desc">${tox.desc}</div>
      </aside>
    </section>

    <section class="breakdown">
      <div class="section-head"><h2>THE 6 DIAGNOSES</h2></div>
      <div class="stat-grid">
        ${Object.entries(r.scores).map(([name,value])=>`<div class="stat-card ${name===r.primary?'primary':name===r.secondary?'secondary':''}">
          <img src="${art[name]}" alt="${name}" />
          <div class="stat-score">${value}%</div>
        </div>`).join('')}
      </div>
      <div class="bars">
        ${Object.entries(r.scores).map(([name,value])=>`<div class="bar-row"><b>${name}</b><div class="bar-track"><div class="bar-fill" style="width:${value}%"></div></div><div class="bar-val">${value}%</div></div>`).join('')}
      </div>
    </section>

    <section class="treatment">
      <div class="treatment-icon">💊</div>
      <div><b>RECOMMENDED TREATMENT</b><p>${tox.treatment}</p></div>
    </section>

    <div class="result-actions">
      <button class="cta" onclick="shareResult()">↗ SHARE RESULTS</button>
      <button class="ghost" onclick="startTest()">↻ RETAKE TEST</button>
      <button class="ghost" onclick="home()">⌂ HOME</button>
    </div>
    <div class="disclaimer">Entertainment purposes only. This is a gaming personality quiz, not a medical or psychological diagnosis.</div>
  </main>`);
  submitResult(r,tox,combo);
}

async function shareResult(){
  const r=calculate();
  const toxicity=r.scores['The Crashout'];
  const combo=combos[[r.primary,r.secondary].sort().join('|')];
  const text=`☣️ MY S.T.D. RESULTS ARE IN\nDiagnosis: ${combo?.name||r.primary}\nPrimary: ${r.primary}\nSecondary: ${r.secondary}\nToxicity: ${toxicity}%\n\nKNOW YOUR STATUS.`;
  try{
    if(navigator.share){await navigator.share({title:'Style Toxicity Diagnosis',text});}
    else if(navigator.clipboard){await navigator.clipboard.writeText(text);alert('Results copied. Go infect the group chat.');}
    else{prompt('Copy your results:',text)}
  }catch(e){/* user cancelled share */}
}

function escapeHtml(value=''){
  return value.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

home();
