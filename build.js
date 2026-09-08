/* =====================================================================
   Sinh index.html từ _source.html
   Chạy:  node build.js
   Sửa nội dung chung (chữ, mục, bố cục) trong _source.html rồi chạy lại.
   ===================================================================== */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const src = fs.readFileSync(path.join(DIR, '_source.html'), 'utf8');

/* ---------- mặt phẳng mờ: nền tối vs nền sáng ---------- */
const DARK = {
  tint: 'rgba(255,255,255,.04)', tintIn: 'rgba(255,255,255,.06)',
  tintFocus: 'rgba(255,255,255,.10)', sheen: 'rgba(255,255,255,.14)',
  ring: 'rgba(255,255,255,.38)'
};

/* =====================================================================
   CẢNH NỀN — mỗi hàm trả về toàn bộ đoạn JS vẽ nền
   ===================================================================== */

const HEAD = (title) => `  /* ==================================================================
     NỀN: ${title}
     ================================================================== */
  var cv = el("bg"), ctx = cv.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
`;

/* ---------- 1. Sông Sài Gòn (4 bản đầu) ---------- */
function sceneRiver(P) {
  return HEAD('sông Sài Gòn lúc hoàng hôn') + `  var W, H, HZ, seed = 21;
  var P = ${JSON.stringify(P)};

  function rnd(){ seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

  function sky(){
    var g = ctx.createLinearGradient(0, 0, 0, HZ);
    g.addColorStop(0, P.sky[0]); g.addColorStop(.42, P.sky[1]);
    g.addColorStop(.78, P.sky[2]); g.addColorStop(1, P.sky[3]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, HZ);
    for(var i = 0; i < 14; i++){
      var x = rnd() * W, y = rnd() * HZ * .85, r = W * (.16 + rnd() * .30);
      var cg = ctx.createRadialGradient(x, y, 0, x, y, r);
      cg.addColorStop(0, "rgba(" + P.cloud + ",.13)");
      cg.addColorStop(1, "rgba(" + P.cloud + ",0)");
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
  }

  var towers = [];
  function skyline(){
    towers = [];
    var x = W * .40;
    while(x < W + 60){
      var w = 16 + rnd() * 40, h = HZ * (.10 + rnd() * .34);
      if(rnd() > .86) h = HZ * (.48 + rnd() * .22);
      towers.push({ x:x, w:w, h:h }); x += w + 3 + rnd() * 10;
    }
    var lx = -20;
    while(lx < W * .30){
      var lw = 14 + rnd() * 30, lh = HZ * (.06 + rnd() * .16);
      towers.push({ x:lx, w:lw, h:lh }); lx += lw + 4 + rnd() * 16;
    }
    towers.forEach(function(t){
      ctx.fillStyle = "rgba(" + P.bld + ",.42)";
      ctx.fillRect(t.x, HZ - t.h, t.w, t.h);
      var cols = Math.max(1, Math.floor(t.w / 8));
      for(var c = 0; c < cols; c++){
        for(var y = HZ - t.h + 6; y < HZ - 6; y += 9){
          if(rnd() > .72){
            ctx.fillStyle = "rgba(" + P.win + "," + (.10 + rnd() * .30).toFixed(2) + ")";
            ctx.fillRect(t.x + 3 + c * 8, y, 3, 4);
          }
        }
      }
    });
  }

  function water(){
    var g = ctx.createLinearGradient(0, HZ, 0, H);
    g.addColorStop(0, P.water[0]); g.addColorStop(.35, P.water[1]); g.addColorStop(1, P.water[2]);
    ctx.fillStyle = g; ctx.fillRect(0, HZ, W, H - HZ);
    towers.forEach(function(t){
      var rg = ctx.createLinearGradient(0, HZ, 0, HZ + t.h * .8);
      rg.addColorStop(0, "rgba(" + P.bld + ",.26)"); rg.addColorStop(1, "rgba(" + P.bld + ",0)");
      ctx.fillStyle = rg; ctx.fillRect(t.x + 1, HZ, t.w - 2, t.h * .8);
    });
    for(var i = 0; i < 130; i++){
      var y = HZ + Math.pow(rnd(), 1.7) * (H - HZ);
      var lw = 12 + rnd() * 110, op = .04 + rnd() * .13;
      ctx.fillStyle = "rgba(" + P.ripple + "," + op.toFixed(3) + ")";
      ctx.fillRect(rnd() * W, y, lw, 1);
    }
    var beam = ctx.createLinearGradient(0, HZ, 0, H);
    beam.addColorStop(0, "rgba(" + P.beam + ",.14)"); beam.addColorStop(1, "rgba(" + P.beam + ",0)");
    ctx.fillStyle = beam; ctx.fillRect(W * .52, HZ, W * .16, H - HZ);
  }

  function paint(){
    seed = 21;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight; HZ = H * .56;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sky(); skyline(); water();
    var big = Math.max(W, H);
    var vg = ctx.createRadialGradient(W/2, H*.46, Math.min(W,H)*.26, W/2, H*.5, big*.78);
    vg.addColorStop(0, "rgba(" + P.vig + ",0)"); vg.addColorStop(1, "rgba(" + P.vig + ",.55)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
    motesInit();
  }

  var motes = [];
  function motesInit(){
    motes = [];
    var n = Math.round(Math.min(W, 620) / 22);
    for(var i = 0; i < n; i++) motes.push(mk(false));
  }
  function mk(below){
    return { x: Math.random()*W, y: below ? H+12 : Math.random()*H,
             r: .8 + Math.random()*2.2, vy: -(.10 + Math.random()*.30),
             vx: (Math.random()-.5)*.16, o: .18 + Math.random()*.42, ph: Math.random()*6.3 };
  }

  var snap;
  function frame(){
    if(!snap){
      snap = document.createElement("canvas");
      snap.width = cv.width; snap.height = cv.height;
      snap.getContext("2d").drawImage(cv, 0, 0);
    }
    ctx.save(); ctx.setTransform(1,0,0,1,0,0); ctx.drawImage(snap,0,0); ctx.restore();
    for(var i = 0; i < motes.length; i++){
      var p = motes[i];
      p.y += p.vy; p.x += p.vx + Math.sin((p.y + p.ph*60)/90)*.18; p.ph += .01;
      if(p.y < -12) motes[i] = mk(true);
      var a = p.o * (.62 + .38*Math.sin(p.ph*1.6));
      ctx.fillStyle = "rgba(" + P.mote + "," + a.toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(frame);
  }

  paint();
  var rt;
  window.addEventListener("resize", function(){
    clearTimeout(rt); rt = setTimeout(function(){ snap = null; paint(); }, 160);
  });
  if(!reduce) frame();
`;
}

/* =====================================================================
   TÔNG MÀU — đen & vàng kim
   ===================================================================== */
const RIVER = {
  black: { sky:["#030304","#0A0B0D","#141519","#262830"], water:["#1E2127","#0D0F13","#020203"],
           cloud:"201,169,97", bld:"0,0,0", win:"255,214,140",
           ripple:"214,196,156", beam:"232,214,170", mote:"226,200,150", vig:"0,0,0" }
};

const THEMES = [
  { file:'index.html', label:'đen & vàng kim · sông Sài Gòn', scheme:'dark', surf:DARK,
    scene: sceneRiver(RIVER.black),
    t:{ bg:'#111214', contrast:'#0A0A0B', accent:'#C9A961',
        glow:'rgba(201,169,97,.18)', aline:'rgba(201,169,97,.40)', cream:'#F5F1E8',
        ink:'#F2EFE7', soft:'rgba(242,239,231,.72)', faint:'rgba(242,239,231,.50)',
        line:'rgba(201,169,97,.28)', glass:'rgba(10,10,12,.44)', glassS:'rgba(8,8,10,.58)',
        glassE:'rgba(201,169,97,.24)', shadow:'rgba(0,0,0,.88)', inner:'rgba(201,169,97,.14)' } },
];

/* ---------- sinh file ---------- */
function tokenBlock(th) {
  const t = th.t, s = th.surf;
  return `  /* ==================================================================
     BẢNG MÀU — ${th.label}
     ================================================================== */
  :root{
    --bg:${t.bg};          --contrast:${t.contrast};
    --accent:${t.accent};      --accent-glow:${t.glow};
    --accent-line:${t.aline};
    --cream:${t.cream};
    --ink:${t.ink};         --ink-soft:${t.soft};  --ink-faint:${t.faint};
    --line:${t.line};
    --glass:${t.glass};   --glass-strong:${t.glassS};   --glass-edge:${t.glassE};
    --shadow:${t.shadow};  --inner:${t.inner};
    --tint:${s.tint};      --tint-in:${s.tintIn};      --tint-focus:${s.tintFocus};
    --sheen:${s.sheen};    --ring:${s.ring};
  }
`;
}

const out = [];
for (const th of THEMES) {
  let html = src
    .replace('/*__TOKENS__*/\n', tokenBlock(th))
    .replace('/*__SCHEME__*/', `color-scheme: ${th.scheme};`)
    .replace('/*__SCENE__*/\n', th.scene);

  for (const p of ['/*__TOKENS__*/', '/*__SCHEME__*/', '/*__SCENE__*/']) {
    if (html.includes(p)) throw new Error(`${th.file}: chưa thay ${p}`);
  }
  fs.writeFileSync(path.join(DIR, th.file), html, 'utf8');
  out.push(`${th.file.padEnd(22)} ${th.label}`);
}
console.log('Đã sinh:\n  ' + out.join('\n  '));
