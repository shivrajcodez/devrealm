
'use strict';

/* ─── CURSOR ─── */
(()=>{
  const c=document.getElementById('cur'),d=document.getElementById('cur2');
  let mx=0,my=0,cx=0,cy=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;d.style.left=mx+'px';d.style.top=my+'px';});
  (function tr(){cx+=(mx-cx)*0.12;cy+=(my-cy)*0.12;c.style.left=cx+'px';c.style.top=cy+'px';requestAnimationFrame(tr);})();
  const hover=()=>c.classList.add('hov'),unhover=()=>c.classList.remove('hov');
  document.addEventListener('mouseover',e=>{if(e.target.matches('button,a,.chip,.feat,.ms,.ac,.rc,.ach'))hover();else unhover();});
})();

/* ─── BG PARTICLES ─── */
(()=>{
  const cv=document.getElementById('bgc'),ctx=cv.getContext('2d');
  let W,H,pts=[];
  const resize=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight;pts=[];const n=Math.min(70,Math.floor(W*H/15000));for(let i=0;i<n;i++)pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.8+.4,col:['0,255,255','255,0,170','119,0,255'][Math.floor(Math.random()*3)],ph:Math.random()*Math.PI*2});};
  const draw=()=>{ctx.clearRect(0,0,W,H);const t=Date.now()/1000;
    for(let i=0;i<pts.length;i++){for(let j=i+1;j<pts.length;j++){const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<110){ctx.beginPath();ctx.strokeStyle=`rgba(0,255,255,${(1-dist/110)*.1})`;ctx.lineWidth=.5;ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke();}}}
    pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;const o=p.r*.5*(0.4+0.6*Math.sin(t*.8+p.ph));ctx.beginPath();ctx.arc(p.x,p.y,o+.5,0,Math.PI*2);ctx.fillStyle=`rgba(${p.col},${.6})`;ctx.shadowColor=`rgba(${p.col},.9)`;ctx.shadowBlur=5;ctx.fill();ctx.shadowBlur=0;});
    requestAnimationFrame(draw);};
  window.addEventListener('resize',resize);resize();draw();
})();

/* ─── FLOATING RUNES ─── */
(()=>{
  const syms=['⚔','🔮','⚡','🛡','⭐','🗡','🏰','💀','🌀','🔱','✨','🎭','⚗','🧿','🔥'];
  const cont=document.getElementById('runes');
  const spawn=()=>{const el=document.createElement('div');el.className='rune';el.textContent=syms[Math.floor(Math.random()*syms.length)];el.style.cssText=`left:${Math.random()*100}vw;font-size:${16+Math.random()*18}px;animation-duration:${13+Math.random()*15}s;animation-delay:${-Math.random()*15}s;`;cont.appendChild(el);setTimeout(()=>el.remove(),30000);};
  for(let i=0;i<10;i++)spawn();setInterval(()=>{if(cont.children.length<14)spawn();},2500);
})();

/* ─── TICKER ─── */
setTimeout(()=>{
  [[1,'t1',12847],[1,'t2',384291],[1,'t3',9204],[1,'t4','2.1M']].forEach(([,id,val])=>{
    if(typeof val==='string'){document.getElementById(id).textContent=val;return;}
    let n=0;const t=setInterval(()=>{n=Math.min(n+val/60,val);document.getElementById(id).textContent=Math.floor(n).toLocaleString();if(n>=val)clearInterval(t);},16);
  });
},1400);

/* ─── STATE ─── */
let S={user:null,repos:[],langs:{},stars:0,forks:0};

/* ─── LANG MAP ─── */
const CLS={
  'JavaScript':{name:'Shadow Rogue',emoji:'🥷',badge:'⚡',c:'#f7df1e'},
  'TypeScript':{name:'Typed Paladin',emoji:'⚡',badge:'🛡',c:'#3178c6'},
  'Python':{name:'Arcane Mage',emoji:'🧙',badge:'🔮',c:'#4584f5'},
  'Java':{name:'Iron Warrior',emoji:'⚔️',badge:'⚔',c:'#f5c842'},
  'Go':{name:'Concurrent Ranger',emoji:'🏹',badge:'🏹',c:'#00add8'},
  'Rust':{name:'Memory Sentinel',emoji:'🔱',badge:'🔐',c:'#ce412b'},
  'C++':{name:'Low-Level Berserker',emoji:'💀',badge:'💀',c:'#f34b7d'},
  'Ruby':{name:'Elegant Bard',emoji:'💎',badge:'🎭',c:'#cc342d'},
  'Swift':{name:'Apple Druid',emoji:'🦅',badge:'🍎',c:'#fa7343'},
  'Kotlin':{name:'JVM Shaman',emoji:'🌀',badge:'🔮',c:'#7f52ff'},
  'Shell':{name:'Terminal Witch',emoji:'🧟',badge:'🖥',c:'#89e051'},
  'default':{name:'Code Wanderer',emoji:'🧝',badge:'🗺',c:'#00ffff'},
};
const LC={JavaScript:'#f7df1e',TypeScript:'#3178c6',Python:'#4584f5',Java:'#f5c842',Go:'#00add8',Rust:'#ce412b',Ruby:'#cc342d','C++':'#f34b7d','C#':'#9b4f96',PHP:'#8892bf',Swift:'#fa7343',Kotlin:'#7f52ff',Shell:'#89e051',Vue:'#42b883',HTML:'#e34c26',CSS:'#563d7c',Dart:'#0175c2'};
const lc=l=>LC[l]||('#'+Math.abs(hs(l)).toString(16).slice(0,6).padEnd(6,'f'));
const hs=s=>{let h=0;for(let i=0;i<s.length;i++)h=Math.imul(31,h)+s.charCodeAt(i)|0;return h;};

const ACHS=[
  {name:'FIRST REPO',desc:'1+ repo',icon:'🌱',fn:d=>d.r>=1},
  {name:'REPO HOARDER',desc:'10+ repos',icon:'📦',fn:d=>d.r>=10},
  {name:'LEGENDARY CODER',desc:'50+ repos',icon:'🏰',fn:d=>d.r>=50},
  {name:'FIRST STAR',desc:'Got a star',icon:'⭐',fn:d=>d.s>=1},
  {name:'STAR COLLECTOR',desc:'100+ stars',icon:'💫',fn:d=>d.s>=100},
  {name:'OS HERO',desc:'1000+ stars',icon:'🌟',fn:d=>d.s>=1000},
  {name:'INFLUENTIAL',desc:'10+ followers',icon:'👥',fn:d=>d.f>=10},
  {name:'POLYGLOT',desc:'5+ languages',icon:'🌐',fn:d=>d.l>=5},
  {name:'FORK MASTER',desc:'50+ forks',icon:'🍴',fn:d=>d.fk>=50},
];

const ROASTS=[
  u=>`Look at ${u.login}. ${u.public_repos} repos and not a single one is "finished". Your GitHub is a digital cemetery of brilliant ideas. The README files are *immaculate*, though.`,
  u=>`${u.login} pushes code the way most people text exes — sporadic, regrettable, and always at 2am. ${u.followers} followers waiting for that next "fix stuff" commit.`,
  u=>`${u.public_repos} repos. Zero of them do what the README says. Your code comments are basically gaslit documentation.`,
  u=>`Bro has ${u.public_repos} repos and the commit frequency of a developer on permanent sabbatical. The dust on your oldest repo has its own GitHub account.`,
  u=>`${u.login}: ${u.public_repos} repos, ${u.followers} followers, and zero excuses. Stack Overflow has more of your code than you do. We did the math.`,
];

const RDEVS=['torvalds','gaearon','yyx990803','sindresorhus','tj','addyosmani','developit','antfu','wesbos','paulirish','getify','mxstbr'];

/* ─── GITHUB FETCH ─── */
async function fetchGH(u){
  const h={'Accept':'application/vnd.github.v3+json'};
  const [ur,rr]=await Promise.all([
    fetch(`https://api.github.com/users/${u}`,{headers:h}),
    fetch(`https://api.github.com/users/${u}/repos?per_page=100&sort=stars`,{headers:h})
  ]);
  if(ur.status===404)throw new Error('USER NOT FOUND');
  if(ur.status===403)throw new Error('RATE LIMITED');
  if(!ur.ok)throw new Error('API ERROR');
  const user=await ur.json();
  const repos=rr.ok?await rr.json():[];
  const langs={};repos.forEach(r=>{if(r.language)langs[r.language]=(langs[r.language]||0)+1;});
  const stars=repos.reduce((s,r)=>s+r.stargazers_count,0);
  const forks=repos.reduce((s,r)=>s+r.forks_count,0);
  return{user,repos,langs,stars,forks};
}

function mockData(u){
  const ls={JavaScript:14,Python:8,TypeScript:10,Go:3,Rust:2};
  const nms=['nova-engine','quantum-cli','pixel-forge','data-rift','nexus-core','void-api','echo-lib','phantom-ui','stellar-kit','orbit-fw'];
  const repos=Array.from({length:20},(_,i)=>({id:i,name:nms[i%10]+'-'+i,description:'Extraordinary open source project born from caffeine and obsession.',stargazers_count:Math.floor(Math.random()**1.5*500),forks_count:Math.floor(Math.random()*70),language:Object.keys(ls)[Math.floor(Math.random()*Object.keys(ls).length)],html_url:'#',updated_at:new Date(Date.now()-Math.random()*400*86400000).toISOString()}));
  const stars=repos.reduce((s,r)=>s+r.stargazers_count,0),forks=repos.reduce((s,r)=>s+r.forks_count,0);
  return{user:{login:u,name:u,avatar_url:`https://api.dicebear.com/7.x/adventurer/svg?seed=${u}`,public_repos:20,followers:Math.floor(Math.random()*700+50),following:Math.floor(Math.random()*250),bio:'Building the future one commit at a time.',created_at:'2017-06-15T00:00:00Z'},repos,langs:ls,stars,forks};
}

/* ─── FLOW ─── */
async function go(forced){
  const u=(forced||document.getElementById('ui').value||'').trim();
  if(!u){flashErr();return;}
  showLoad();
  try{
    step(t('connecting'),10);await sl(200);
    let data;
    try{data=await fetchGH(u);}
    catch(e){
      if(e.message==='USER NOT FOUND')throw e;
      step(t('api_limit'),40);await sl(400);
      data=mockData(u);toast('⚠ API limited — showing demo data');
    }
    step(t('parsing'),55);await sl(250);
    S={user:data.user,repos:data.repos,langs:data.langs,stars:data.stars,forks:data.forks};
    step(t('building_city'),75);await sl(250);
    buildDash();
    step(t('realm_ready'),100);await sl(150);
    hideLoad();scr('dashboard');
  }catch(e){hideLoad();flashErr('⚠ '+e.message);}
}
const tryU=u=>{document.getElementById('ui').value=u;go(u);};
const randDev=()=>tryU(RDEVS[Math.floor(Math.random()*RDEVS.length)]);

/* ─── BUILD DASH ─── */
function buildDash(){
  const{user,repos,langs,stars,forks}=S;
  const pl=Object.entries(langs).sort((a,b)=>b[1]-a[1])[0]?.[0]||'default';
  const cls=CLS[pl]||CLS.default;
  const lvl=calcLvl(user.public_repos,stars,user.followers);
  const xp=calcXP(user.public_repos,stars,user.followers);
  const title=genTitle(pl,lvl);

  const av=document.getElementById('cav');
  av.src=user.avatar_url;
  av.onerror=()=>{av.src=`https://ui-avatars.com/api/?name=${user.login}&background=030f1e&color=00ffff&size=90`;};

  set('cname',user.name||user.login);
  set('chandle','@'+user.login);
  set('cemoji',cls.emoji);
  set('cclass',cls.name.toUpperCase());
  set('ctitle',title);
  set('clvl',lvl);
  set('calvl',lvl);

  const atk=cap(Math.floor(stars/50+repos.length*.5));
  const def=cap(Math.floor(user.followers/5+forks*.3));
  const spd=cap(Math.floor(repos.length*1.3));
  const mag=cap(Math.floor(Object.keys(langs).length*9+Math.sqrt(stars)*1.5));
  const cha=cap(Math.floor(user.followers/8+Math.sqrt(stars)*.5));
  [['atk',atk],['def',def],['spd',spd],['mag',mag],['cha',cha]].forEach(([k,v])=>{
    set('v'+k,v);setTimeout(()=>{el('b'+k).style.width=v+'%';},200);
  });

  const xpin=xp%1000;
  set('xplbl',`${xpin} / 1000 XP`);
  setTimeout(()=>{el('xpf').style.width=(xpin/10)+'%';},300);

  set('msrp',fmt(user.public_repos));
  set('msst',fmt(stars));
  set('msfl',fmt(user.followers));
  set('msfk',fmt(forks));

  const st=el('stags');st.innerHTML='';
  Object.entries(langs).sort((a,b)=>b[1]-a[1]).slice(0,8).forEach(([l])=>{
    const c=lc(l);st.innerHTML+=`<span class="stag" style="color:${c};border-color:${c}30;background:${c}10">${l}</span>`;
  });

  const ad={r:user.public_repos,s:stars,f:user.followers,l:Object.keys(langs).length,fk:forks};
  const al=el('achl');al.innerHTML='';
  ACHS.forEach(a=>{const lit=a.fn(ad);al.innerHTML+=`<div class="ach ${lit?'lit':''}"><div class="achi">${a.icon}</div><div><div class="achn">${a.name}</div><div class="achd">${a.desc}</div></div></div>`;});

  set('cityname',user.login+"'s " + t('feat1_title'));
  set('citysub',`${repos.length} ${t('bldgs')} · ${Object.keys(langs).length} ${t('districts')}`);
  el('hpop').textContent=`🏙 ${repos.length} ${t('bldgs')}`;

  buildCity();buildAnalytics();buildRepos();
}

/* ─── THREE.JS CITY ─── */
let CITY={renderer:null,scene:null,camera:null,controls:null,animId:null,buildings:[],spinning:true,nightMode:false,raycaster:null,mouse:null};

function destroyCity(){
  if(CITY.animId){cancelAnimationFrame(CITY.animId);CITY.animId=null;}
  if(CITY._resizeHandler){window.removeEventListener('resize',CITY._resizeHandler);CITY._resizeHandler=null;}
  if(CITY.scene){
    CITY.scene.traverse(obj=>{
      if(obj.geometry)obj.geometry.dispose();
      if(obj.material){if(Array.isArray(obj.material))obj.material.forEach(m=>m.dispose());else obj.material.dispose();}
    });
  }
  if(CITY.renderer){CITY.renderer.dispose();if(CITY.renderer.domElement&&CITY.renderer.domElement.parentNode)CITY.renderer.domElement.remove();CITY.renderer=null;}
  CITY.scene=null;CITY.camera=null;CITY.controls=null;CITY.buildings=[];
}

function buildCity(){
  destroyCity();
  const repos=S.repos.slice(0,56);
  const container=el('cityc');
  const W=container.clientWidth||900,H=540;

  // ── THREE SETUP ──
  const THREE=window.THREE;
  if(!THREE){console.error('DevRealm: Three.js failed to load from CDN');toast('⚠ 3D engine unavailable — check connection');return;}
  const scene=new THREE.Scene();
  CITY.scene=scene;

  // Fog
  scene.fog=new THREE.FogExp2(0x000810,0.018);
  scene.background=new THREE.Color(0x000810);

  // Camera — isometric-ish perspective
  const camera=new THREE.PerspectiveCamera(45,W/H,0.1,1000);
  camera.position.set(28,22,28);
  camera.lookAt(0,0,0);
  CITY.camera=camera;

  // Renderer
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
  renderer.setSize(W,H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.2;
  container.appendChild(renderer.domElement);
  CITY.renderer=renderer;

  // ── ORBIT CONTROLS (manual, no import needed) ──
  let isDragging=false,prevMX=0,prevMY=0,theta=Math.PI/4,phi=Math.PI/3.5,radius=42;
  const target=new THREE.Vector3(0,0,0);
  function updateCam(){
    camera.position.x=target.x+radius*Math.sin(phi)*Math.sin(theta);
    camera.position.y=target.y+radius*Math.cos(phi);
    camera.position.z=target.z+radius*Math.sin(phi)*Math.cos(theta);
    camera.lookAt(target);
  }
  updateCam();
  CITY.controls={theta:()=>theta,setTheta:(v)=>{theta=v;updateCam();},resetCamera:()=>{theta=Math.PI/4;phi=Math.PI/3.5;radius=42;updateCam();}};

  const canvas=renderer.domElement;
  canvas.addEventListener('mousedown',e=>{isDragging=true;prevMX=e.clientX;prevMY=e.clientY;canvas.style.cursor='grabbing';});
  canvas.addEventListener('mouseup',()=>{isDragging=false;canvas.style.cursor='grab';});
  canvas.addEventListener('mouseleave',()=>{isDragging=false;canvas.style.cursor='grab';});
  canvas.addEventListener('mousemove',e=>{
    if(!isDragging){handleHover(e);return;}
    const dx=e.clientX-prevMX,dy=e.clientY-prevMY;
    theta-=dx*0.01;phi=Math.max(0.2,Math.min(Math.PI/2.1,phi+dy*0.008));
    updateCam();prevMX=e.clientX;prevMY=e.clientY;
  });
  canvas.addEventListener('wheel',e=>{e.preventDefault();radius=Math.max(15,Math.min(80,radius+e.deltaY*0.05));updateCam();},{passive:false});
  canvas.addEventListener('click',handleClick);

  // ── LIGHTING ──
  const ambient=new THREE.AmbientLight(0x112244,0.6);scene.add(ambient);
  CITY.ambient=ambient;

  const sun=new THREE.DirectionalLight(0x8899ff,1.2);
  sun.position.set(20,40,20);
  sun.castShadow=true;
  sun.shadow.mapSize.width=2048;sun.shadow.mapSize.height=2048;
  sun.shadow.camera.near=0.5;sun.shadow.camera.far=200;
  sun.shadow.camera.left=-50;sun.shadow.camera.right=50;
  sun.shadow.camera.top=50;sun.shadow.camera.bottom=-50;
  scene.add(sun);CITY.sun=sun;

  // Neon rim light from below
  const rimLight=new THREE.PointLight(0x00ffff,2,60);
  rimLight.position.set(0,-2,0);scene.add(rimLight);CITY.rimLight=rimLight;

  const rimLight2=new THREE.PointLight(0xff00aa,1.5,50);
  rimLight2.position.set(-20,5,20);scene.add(rimLight2);

  // ── GROUND PLANE ──
  const gridHelper=new THREE.GridHelper(80,40,0x002233,0x001122);
  scene.add(gridHelper);

  // Ground glow plane
  const groundGeo=new THREE.PlaneGeometry(80,80);
  const groundMat=new THREE.MeshStandardMaterial({color:0x000d1a,roughness:1,metalness:0,transparent:true,opacity:0.95});
  const ground=new THREE.Mesh(groundGeo,groundMat);
  ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;
  scene.add(ground);

  // Ground edge glow
  const edgeGeo=new THREE.PlaneGeometry(82,82);
  const edgeMat=new THREE.MeshBasicMaterial({color:0x00ffff,transparent:true,opacity:0.04,side:THREE.DoubleSide});
  const edge=new THREE.Mesh(edgeGeo,edgeMat);edge.rotation.x=-Math.PI/2;edge.position.y=-0.01;
  scene.add(edge);

  // ── STAR FIELD ──
  const starGeo=new THREE.BufferGeometry();
  const starPos=new Float32Array(600*3);
  for(let i=0;i<600;i++){starPos[i*3]=(Math.random()-0.5)*300;starPos[i*3+1]=20+Math.random()*80;starPos[i*3+2]=(Math.random()-0.5)*300;}
  starGeo.setAttribute('position',new THREE.BufferAttribute(starPos,3));
  const starMat=new THREE.PointsMaterial({color:0xaaccff,size:0.3,transparent:true,opacity:0.8});
  scene.add(new THREE.Points(starGeo,starMat));

  // ── ROAD NETWORK ──
  const roadMat=new THREE.MeshBasicMaterial({color:0x001122,transparent:true,opacity:0.6});
  // horizontal roads
  [-8,0,8].forEach(z=>{const g=new THREE.PlaneGeometry(70,1.2);const m=new THREE.Mesh(g,roadMat);m.rotation.x=-Math.PI/2;m.position.set(0,0.01,z);scene.add(m);});
  [-8,0,8].forEach(x=>{const g=new THREE.PlaneGeometry(1.2,70);const m=new THREE.Mesh(g,roadMat);m.rotation.x=-Math.PI/2;m.position.set(x,0.01,0);scene.add(m);});

  // ── BUILDINGS ──
  const maxS=Math.max(...repos.map(r=>r.stargazers_count),1);
  const COLS=Math.ceil(Math.sqrt(repos.length));
  const SPACING=3.2;
  const offset=((COLS-1)*SPACING)/2;

  CITY.buildings=[];
  const buildingMeshes=[];

  repos.forEach((repo,i)=>{
    const col=i%COLS,row=Math.floor(i/COLS);
    const x=(col*SPACING)-offset;
    const z=(row*SPACING)-offset;
    const normH=repo.stargazers_count/maxS;
    const targetH=Math.max(0.8,0.8+normH*12);
    const bW=Math.max(0.8,SPACING*0.72);
    const color=lc(repo.language||t('unknown'));
    const colObj=new THREE.Color(color);

    // Building group
    const group=new THREE.Group();
    group.position.set(x,0,z);

    // Main body
    const geo=new THREE.BoxGeometry(bW,1,bW);
    const mat=new THREE.MeshStandardMaterial({
      color:colObj,
      roughness:0.3,metalness:0.7,
      emissive:colObj,emissiveIntensity:0.08,
    });
    const mesh=new THREE.Mesh(geo,mat);
    mesh.castShadow=true;mesh.receiveShadow=true;
    mesh.scale.y=0.001; // start flat, animate up
    mesh.position.y=0.5;
    group.add(mesh);

    // Window rows (instanced planes)
    const wRows=Math.max(1,Math.floor(targetH/1.2));
    const wGeo=new THREE.PlaneGeometry(0.18,0.22);
    const wMat=new THREE.MeshBasicMaterial({color:0xffffcc,transparent:true,opacity:0.0,side:THREE.DoubleSide});
    for(let wr=0;wr<wRows;wr++){
      for(let side=0;side<4;side++){
        const wNum=Math.floor(bW/0.5);
        for(let wc=0;wc<wNum;wc++){
          if(Math.random()<0.35)continue; // random dark windows
          const wm=wMat.clone();wm.opacity=0.85;
          const wMesh=new THREE.Mesh(wGeo,wm);
          const angle=side*(Math.PI/2);
          const wx=(wc-(wNum-1)/2)*0.48;
          const wy=0.6+wr*1.15;
          wMesh.position.set(
            Math.cos(angle)*(bW/2+0.01)-Math.sin(angle)*wx,
            wy,
            Math.sin(angle)*(bW/2+0.01)+Math.cos(angle)*wx
          );
          wMesh.rotation.y=angle;
          group.add(wMesh);
        }
      }
    }

    // Rooftop glow plane
    const roofGeo=new THREE.PlaneGeometry(bW*0.9,bW*0.9);
    const roofMat=new THREE.MeshBasicMaterial({color:colObj,transparent:true,opacity:0.6,side:THREE.DoubleSide});
    const roof=new THREE.Mesh(roofGeo,roofMat);
    roof.rotation.x=-Math.PI/2;
    roof.position.y=targetH+0.01;
    group.add(roof);

    // Rooftop point light (for starred repos)
    if(repo.stargazers_count>10){
      const pl=new THREE.PointLight(colObj,0.0,8);
      pl.position.y=targetH+0.5;
      group.add(pl);
      mesh.userData.pointLight=pl;
    }

    // Antenna for popular repos
    if(repo.stargazers_count>20){
      const antGeo=new THREE.CylinderGeometry(0.04,0.04,2,6);
      const antMat=new THREE.MeshBasicMaterial({color:colObj});
      const ant=new THREE.Mesh(antGeo,antMat);
      ant.position.y=targetH+1;group.add(ant);

      // Blinking beacon
      const bcnGeo=new THREE.SphereGeometry(0.12,8,8);
      const bcnMat=new THREE.MeshBasicMaterial({color:colObj,transparent:true,opacity:1});
      const bcn=new THREE.Mesh(bcnGeo,bcnMat);
      bcn.position.y=targetH+2.1;
      group.add(bcn);
      mesh.userData.beacon=bcn;
      mesh.userData.beaconMat=bcnMat;
    }

    // District glow ring on ground
    const ringGeo=new THREE.RingGeometry(bW*0.6,bW*0.7,32);
    const ringMat=new THREE.MeshBasicMaterial({color:colObj,transparent:true,opacity:0.25,side:THREE.DoubleSide});
    const ring=new THREE.Mesh(ringGeo,ringMat);
    ring.rotation.x=-Math.PI/2;ring.position.y=0.02;
    group.add(ring);

    scene.add(group);
    buildingMeshes.push(mesh);

    CITY.buildings.push({
      group,mesh,repo,color,targetH,
      animDelay:i*0.04,animDone:false,
      x,z,
    });
  });

  // Raycasting
  CITY.raycaster=new THREE.Raycaster();
  CITY.mouse=new THREE.Vector2();

  function handleHover(e){
    const rect=canvas.getBoundingClientRect();
    CITY.mouse.x=((e.clientX-rect.left)/rect.width)*2-1;
    CITY.mouse.y=-((e.clientY-rect.top)/rect.height)*2+1;
    CITY.raycaster.setFromCamera(CITY.mouse,camera);
    const hits=CITY.raycaster.intersectObjects(buildingMeshes);
    const tip=el('ctip');
    if(hits.length>0){
      const hitMesh=hits[0].object;
      const bld=CITY.buildings.find(b=>b.mesh===hitMesh);
      if(bld){
        canvas.style.cursor='pointer';
        tip.style.display='block';
        const rect2=canvas.getBoundingClientRect();
        let tx=e.clientX-rect2.left+16,ty=e.clientY-rect2.top-10;
        if(tx+180>rect2.width)tx=rect2.width-185;
        tip.style.left=tx+'px';tip.style.top=ty+'px';
        tip.style.borderColor=bld.color;
        tip.style.boxShadow=`0 0 20px ${bld.color}99`;
        set('ctn',bld.repo.name.toUpperCase());
        set('ctstar','⭐ '+bld.repo.stargazers_count+' '+t('stars_lbl'));
        set('ctlang','● '+(bld.repo.language||t('unknown')));
        set('ctfork','🍴 '+bld.repo.forks_count+' '+t('forks_lbl'));
        el('ctclick').style.display=bld.repo.html_url!=='#'?'block':'none';
        return;
      }
    }
    if(!isDragging)canvas.style.cursor='grab';
    tip.style.display='none';
  }

  function handleClick(e){
    const rect=canvas.getBoundingClientRect();
    CITY.mouse.x=((e.clientX-rect.left)/rect.width)*2-1;
    CITY.mouse.y=-((e.clientY-rect.top)/rect.height)*2+1;
    CITY.raycaster.setFromCamera(CITY.mouse,camera);
    const hits=CITY.raycaster.intersectObjects(buildingMeshes);
    if(hits.length>0){
      const bld=CITY.buildings.find(b=>b.mesh===hits[0].object);
      if(bld&&bld.repo.html_url!=='#')window.open(bld.repo.html_url,'_blank','noopener,noreferrer');
    }
  }

  // ── ANIMATE LOOP ──
  let t=0;
  function animate(){
    CITY.animId=requestAnimationFrame(animate);
    t+=0.016;

    // Slow auto-spin
    if(CITY.spinning){theta+=0.003;updateCam();}

    // Build-up animation
    CITY.buildings.forEach((b,i)=>{
      if(b.animDone)return;
      const age=t-b.animDelay;
      if(age<0)return;
      const prog=Math.min(1,age/1.2);
      const ease=1-Math.pow(1-prog,3); // cubic ease out
      b.mesh.scale.y=ease*b.targetH;
      b.mesh.position.y=(ease*b.targetH)/2;
      if(prog>=1)b.animDone=true;
    });

    // Beacon blink
    CITY.buildings.forEach(b=>{
      const bcn=b.mesh.userData.beacon;
      const bcnMat=b.mesh.userData.beaconMat;
      if(bcn&&bcnMat){
        bcnMat.opacity=0.4+0.6*Math.abs(Math.sin(t*2+b.x));
      }
      const pl=b.mesh.userData.pointLight;
      if(pl&&b.animDone){
        pl.intensity=0.5+0.4*Math.sin(t*1.5+b.z);
      }
    });

    // Rim light pulse
    rimLight.intensity=1.5+0.8*Math.sin(t*0.7);

    renderer.render(scene,camera);
  }
  animate();

  // ── LEGEND ──
  const lg=el('cleg');lg.innerHTML='';
  Object.keys(S.langs).slice(0,10).forEach(l=>{lg.innerHTML+=`<div class="leg"><div class="ld" style="background:${lc(l)}"></div>${l}</div>`;});
  el('hpop').textContent=`🏙 ${repos.length} ${t('bldgs')}`;

  // Resize handler
  function onResize(){
    const nW=container.clientWidth;
    camera.aspect=nW/H;camera.updateProjectionMatrix();
    renderer.setSize(nW,H);
  }
  window.addEventListener('resize',onResize);
  CITY._resizeHandler=onResize;
}

/* ─── CITY CONTROLS ─── */
function cityResetCamera(){if(CITY.controls)CITY.controls.resetCamera();}
function cityToggleSpin(){
  CITY.spinning=!CITY.spinning;
  const sb=document.getElementById('spinBtn');if(sb)sb.textContent=CITY.spinning?t('spin'):t('spin_play');
}
function cityToggleNight(){
  CITY.nightMode=!CITY.nightMode;
  if(CITY.scene&&window.THREE){
    CITY.scene.background=new window.THREE.Color(CITY.nightMode?0x000005:0x000810);
    CITY.scene.fog=new window.THREE.FogExp2(CITY.nightMode?0x000005:0x000810,0.018);
    if(CITY.sun)CITY.sun.intensity=CITY.nightMode?0.2:1.2;
    if(CITY.ambient)CITY.ambient.intensity=CITY.nightMode?0.2:0.6;
    if(CITY.rimLight)CITY.rimLight.intensity=CITY.nightMode?4:2;
  }
  const nb=document.getElementById('nightBtn');if(nb)nb.textContent=CITY.nightMode?t('day'):t('night');
}

/* ─── ANALYTICS ─── */
function buildAnalytics(){
  const{user,repos,langs,stars,forks}=S;
  const avgS=repos.length?(stars/repos.length).toFixed(1):0;
  const items=[
    {v:fmt(stars),l:'TOTAL STARS',s:'All-time glory',c:'var(--c1)'},
    {v:fmt(forks),l:'TOTAL FORKS',s:'Community builds',c:'var(--c3)'},
    {v:Object.keys(langs).length,l:'LANGUAGES',s:'Polyglot score',c:'var(--c4)'},
    {v:avgS,l:'AVG STARS',s:'Per repository',c:'var(--c5)'},
    {v:fmt(user.followers),l:'FOLLOWERS',s:'Dev network',c:'var(--c2)'},
    {v:fmt(user.public_repos),l:'REPOS',s:'Public projects',c:'var(--c6)'},
  ];
  el('ag').innerHTML=items.map(it=>`<div class="ac"><div class="acv" style="color:${it.c}">${it.v}</div><div class="acl">${it.l}</div><div class="acs">${it.s}</div></div>`).join('');

  const total=Object.values(langs).reduce((a,b)=>a+b,0)||1;
  const lbarsEl=el('lbars');lbarsEl.innerHTML='';
  Object.entries(langs).sort((a,b)=>b[1]-a[1]).slice(0,10).forEach(([l,n])=>{
    const p=Math.round(n/total*100),c=lc(l);
    const row=document.createElement('div');row.className='lbr';
    const lbl=document.createElement('div');lbl.className='lbl';lbl.textContent=l;
    const lbt=document.createElement('div');lbt.className='lbt';
    const lbf=document.createElement('div');lbf.className='lbf';
    lbf.style.cssText=`width:0%;background:linear-gradient(90deg,${c},${c}88)`;lbf.dataset.w=p;lbf.textContent=p+'%';
    lbt.appendChild(lbf);
    const lbp=document.createElement('div');lbp.className='lbp';lbp.textContent=p+'%';
    row.append(lbl,lbt,lbp);lbarsEl.appendChild(row);
  });
  setTimeout(()=>{document.querySelectorAll('.lbf').forEach(e=>{e.style.width=e.dataset.w+'%';});},300);

  const hm=el('hmap');hm.innerHTML='';
  for(let i=0;i<364;i++){const a=Math.random()>.62,lv=Math.random();let bg='rgba(0,255,255,0.04)';if(a){if(lv>.85)bg='#00ffff';else if(lv>.65)bg='rgba(0,255,255,0.7)';else if(lv>.4)bg='rgba(0,255,255,0.4)';else bg='rgba(0,255,255,0.2)';}hm.innerHTML+=`<div class="hmc" style="background:${bg}"></div>`;}
}

/* ─── REPOS ─── */
function buildRepos(){
  const container=el('rgt');container.innerHTML='';
  S.repos.slice(0,18).forEach(r=>{
    const c=lc(r.language||'default');
    const div=document.createElement('div');div.className='rc';
    if(r.html_url&&r.html_url!=='#')div.addEventListener('click',()=>window.open(r.html_url,'_blank','noopener,noreferrer'));
    const rcn=document.createElement('div');rcn.className='rcn';rcn.textContent='📦 '+(r.name||'').toUpperCase();
    const rcd=document.createElement('div');rcd.className='rcd';rcd.textContent=r.description||t('no_desc');
    const rcm=document.createElement('div');rcm.className='rcm';
    const sp1=document.createElement('span');sp1.style.color=c;sp1.textContent='● '+(r.language||t('unknown'));
    const sp2=document.createElement('span');sp2.textContent='⭐ '+r.stargazers_count;
    const sp3=document.createElement('span');sp3.textContent='🍴 '+r.forks_count;
    const sp4=document.createElement('span');sp4.textContent=tsince(r.updated_at);
    rcm.append(sp1,sp2,sp3,sp4);
    div.append(rcn,rcd,rcm);
    container.appendChild(div);
  });
}

/* ─── ROAST ─── */
function roast(){
  const btn=el('rbt'),box=el('rbox');
  btn.disabled=true;btn.textContent=t('roast_incinerating');
  setTimeout(()=>{
    box.textContent='"'+ROASTS[Math.floor(Math.random()*ROASTS.length)](S.user)+'"';
    box.classList.add('on');btn.disabled=false;btn.textContent=t('roast_again');
    toast(t('roasted'));
  },1800);
}

/* ─── SHARE CARD ─── */
function genCard(){
  const{user,langs,stars}=S;
  const lvl=calcLvl(user.public_repos,stars,user.followers);
  const pl=Object.entries(langs).sort((a,b)=>b[1]-a[1])[0]?.[0]||'default';
  const cls=CLS[pl]||CLS.default;
  const xpPct=Math.round((calcXP(user.public_repos,stars,user.followers)%1000)/10);
  const scavEl=el('scav');scavEl.src=user.avatar_url;
  scavEl.onerror=()=>{scavEl.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(user.login)}&background=030f1e&color=00ffff&size=90`;};
  set('scun',user.name||user.login);
  set('sccl',cls.name.toUpperCase());
  set('sctt',genTitle(pl,lvl));
  set('sclvl',lvl);
  set('scst',fmt(stars));
  set('scrp',user.public_repos);
  el('scxp').style.width=xpPct+'%';
  el('scard').classList.add('on');
  const bc=el('bcpy');bc.classList.add('on');
  toast(t('card_gen'));
}

function cpyCard(){
  const{user,stars}=S;
  const lvl=calcLvl(user.public_repos,stars,user.followers);
  const pl=Object.entries(S.langs).sort((a,b)=>b[1]-a[1])[0]?.[0]||'default';
  const cls=CLS[pl]||CLS.default;
  const txt=`⚔ DEVREALM PROFILE ⚔\n━━━━━━━━━━━━━━━\n👤 ${user.name||user.login} (@${user.login})\n🧙 ${cls.name.toUpperCase()}\n⭐ ${t('lvl')} ${lvl} ${t('dev_title')}\n━━━━━━━━━━━━━━━\n🌟 ${fmt(stars)} ${t('stars_lbl')}\n📦 ${user.public_repos} ${t('repos_lbl')}\n👥 ${fmt(user.followers)} ${t('followers_lbl')}\n━━━━━━━━━━━━━━━\n🌐 github.com/${user.login}\nBuilt with ⚔ DEVREALM.DEV`;
  navigator.clipboard.writeText(txt).then(()=>toast(t('card_copied')));
}

/* ─── RPG CALCS ─── */
const calcLvl=(r,s,f)=>Math.max(1,Math.min(99,Math.floor((r*2+Math.sqrt(s)*3+Math.sqrt(f)*2)/10)+1));
const calcXP=(r,s,f)=>Math.floor(r*50+s*10+f*5);
const cap=n=>Math.max(1,Math.min(99,Math.floor(n)));
function genTitle(lang,lvl){
  const t={JavaScript:{1:'Async Apprentice',10:'DOM Sorcerer',30:'JS Overlord'},TypeScript:{1:'Type Novice',10:'Typed Paladin',30:'Interface Archon'},Python:{1:'Script Squire',10:'Data Shaman',30:'ML High Mage'},Java:{1:'Bean Initiate',10:'JVM Warlord',30:'Enterprise Archon'},Go:{1:'Goroutine Scout',10:'Concurrent Ranger',30:'Gopher Supreme'},Rust:{1:'Borrower',10:'Memory Sentinel',30:'Ownership Oracle'},default:{1:'Code Wanderer',10:'Realm Builder',30:'OS Legend'}};
  const s=t[lang]||t.default;return lvl<10?s[1]:lvl<30?s[10]:s[30];
}

/* ─── UI HELPERS ─── */
function scr(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));el(id).classList.add('active');scrollTo(0,0);}
function stab(n,btn){document.querySelectorAll('.tp').forEach(p=>p.classList.remove('active'));document.querySelectorAll('.tb').forEach(b=>b.classList.remove('on'));el(n+'-panel').classList.add('active');btn.classList.add('on');}
function goBack(){destroyCity();scr('landing');['rbox','scard'].forEach(id=>el(id).classList.remove('on'));el('bcpy').classList.remove('on');const rbt=el('rbt');rbt.textContent=t('roast_btn_text');rbt.disabled=false;el('ui').value='';}
function showLoad(){el('ls').classList.add('on');}
function hideLoad(){el('ls').classList.remove('on');}
function step(m,p){set('lstp',m);el('lbar').style.width=p+'%';}
function flashErr(m){const e=el('err');e.textContent=m||t('error_no_user');e.classList.add('on');setTimeout(()=>e.classList.remove('on'),4000);}
function toast(m){const t=el('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3500);}
const el=id=>document.getElementById(id);
const set=(id,v)=>{const e=el(id);if(e)e.textContent=v;};
const fmt=n=>{n=n||0;if(n>=1e6)return(n/1e6).toFixed(1)+'M';if(n>=1e3)return(n/1e3).toFixed(1)+'k';return String(n);};
function tsince(d){if(!d)return'?';const diff=Date.now()-new Date(d).getTime(),days=Math.floor(diff/86400000);if(days<1)return'TODAY';if(days<7)return days+'D AGO';if(days<30)return Math.floor(days/7)+'W AGO';if(days<365)return Math.floor(days/30)+'MO AGO';return Math.floor(days/365)+'Y AGO';}
const sl=ms=>new Promise(r=>setTimeout(r,ms));

document.getElementById('ui').addEventListener('keydown',e=>{if(e.key==='Enter')go();});
// Resize handled per-instance inside buildCity() via CITY._resizeHandler

window.onLanguageChange = () => {
  if(S && S.user) {
    buildDash(); // Rebuild dash and city to apply new translations if language changes while dashboard is open
  }
};

