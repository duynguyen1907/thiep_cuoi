/* =====================================================================
   Sinh 8 file thiệp từ _source.html
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
const LIGHT = {
  tint: 'rgba(255,255,255,.55)', tintIn: 'rgba(255,255,255,.74)',
  tintFocus: 'rgba(255,255,255,.94)', sheen: 'rgba(255,255,255,.90)',
  ring: 'rgba(0,0,0,.16)'
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

/* ---------- 2. Vườn hoa màu nước ---------- */
function sceneFloral(P) {
  return HEAD('vườn hoa màu nước — hoa hồng, cúc hoạ mi, lá xanh') + `  var W, H, seed = 21;
  var P = ${JSON.stringify(P)};

  function rnd(){ seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

  function blob(x, y, r, c1, c2){
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, c1); g.addColorStop(1, c2);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
  }
  function leaf(x, y, len, ang, col){
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    var g = ctx.createLinearGradient(0, 0, len, 0);
    g.addColorStop(0, col); g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.bezierCurveTo(len*.3, -len*.35, len*.75, -len*.3, len, 0);
    ctx.bezierCurveTo(len*.75, len*.3, len*.3, len*.35, 0, 0);
    ctx.fill(); ctx.restore();
  }
  function rose(x, y, r, col, core){
    // nền loang mềm
    var g0 = ctx.createRadialGradient(x, y, 0, x, y, r);
    g0.addColorStop(0, core); g0.addColorStop(.5, col); g0.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g0; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
    // các cánh lệch tâm, xoay dần — tránh tạo vân tròn đồng tâm
    for(var i = 0; i < 5; i++){
      var rr = r * (.80 - i*.13);
      var a  = i*2.3 + rnd()*.8;
      var ox = Math.cos(a)*r*.20, oy = Math.sin(a)*r*.20;
      var g = ctx.createRadialGradient(x+ox, y+oy, 0, x+ox, y+oy, rr);
      g.addColorStop(0, core); g.addColorStop(.62, col); g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g; ctx.beginPath();
      ctx.ellipse(x+ox, y+oy, rr, rr*(.78 + rnd()*.34), a, 0, Math.PI*2);
      ctx.fill();
    }
  }
  function daisy(x, y, r){
    ctx.save(); ctx.translate(x, y); ctx.rotate(rnd()*Math.PI);
    for(var i = 0; i < 6; i++){
      ctx.rotate(Math.PI/3);
      ctx.fillStyle = P.petal;
      ctx.beginPath(); ctx.ellipse(0, -r, r*.42, r*.85, 0, 0, Math.PI*2); ctx.fill();
    }
    ctx.fillStyle = P.pollen; ctx.beginPath(); ctx.arc(0, 0, r*.36, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }

  function paint(){
    seed = 21;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W*dpr; cv.height = H*dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var base = ctx.createLinearGradient(0, 0, W, H);
    base.addColorStop(0, P.base[0]); base.addColorStop(.5, P.base[1]); base.addColorStop(1, P.base[2]);
    ctx.fillStyle = base; ctx.fillRect(0, 0, W, H);

    var big = Math.max(W, H);
    for(var i = 0; i < 22; i++) blob(rnd()*W, rnd()*H, big*(.12+rnd()*.22), P.wash[0], P.wash[1]);
    for(var i = 0; i < 16; i++) blob(rnd()*W, rnd()*H, big*(.08+rnd()*.16), P.wash[2], P.wash[3]);
    for(var i = 0; i < 42; i++) leaf(rnd()*W, rnd()*H, big*(.08+rnd()*.14), rnd()*Math.PI*2, P.leafA);
    for(var i = 0; i < 28; i++) leaf(rnd()*W, rnd()*H, big*(.05+rnd()*.10), rnd()*Math.PI*2, P.leafB);
    for(var i = 0; i < 7;  i++) rose(rnd()*W, rnd()*H, big*(.05+rnd()*.06), P.roseA[0], P.roseA[1]);
    for(var i = 0; i < 6;  i++) rose(rnd()*W, rnd()*H, big*(.06+rnd()*.07), P.roseB[0], P.roseB[1]);
    for(var i = 0; i < 30; i++) daisy(rnd()*W, rnd()*H, 4 + rnd()*6);

    var vg = ctx.createRadialGradient(W/2, H/2, Math.min(W,H)*.30, W/2, H/2, big*.80);
    vg.addColorStop(0, "rgba(" + P.vig + ",0)"); vg.addColorStop(1, "rgba(" + P.vig + ",.28)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
    petalsInit();
  }

  var petals = [];
  function petalsInit(){
    petals = [];
    var n = Math.round(Math.min(W, 600)/40);
    for(var i = 0; i < n; i++) petals.push(mk(false));
  }
  function mk(top){
    return { x: Math.random()*W, y: top ? -20 : Math.random()*H,
             r: 4 + Math.random()*5, vy: .25 + Math.random()*.45,
             vx: (Math.random()-.5)*.25, a: Math.random()*6.3,
             va: (Math.random()-.5)*.02, o: .5 + Math.random()*.4 };
  }

  var snap;
  function frame(){
    if(!snap){
      snap = document.createElement("canvas");
      snap.width = cv.width; snap.height = cv.height;
      snap.getContext("2d").drawImage(cv, 0, 0);
    }
    ctx.save(); ctx.setTransform(1,0,0,1,0,0); ctx.drawImage(snap,0,0); ctx.restore();
    for(var i = 0; i < petals.length; i++){
      var p = petals[i];
      p.y += p.vy; p.x += p.vx + Math.sin(p.y/70)*.2; p.a += p.va;
      if(p.y > H + 20) petals[i] = mk(true);
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
      ctx.fillStyle = "rgba(" + P.fall + "," + p.o.toFixed(2) + ")";
      ctx.beginPath(); ctx.ellipse(0, 0, p.r*.55, p.r, 0, 0, Math.PI*2); ctx.fill();
      ctx.restore();
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

/* ---------- 3. Sóng biển lớp lớp ---------- */
function sceneWaves(P) {
  return HEAD('sóng biển lớp lớp — chuyển động liên tục') + `  var W, H, dpr = 1, t = 0;
  var P = ${JSON.stringify(P)};

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W*dpr; cv.height = H*dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function crest(base, amp, ph, f1, f2, step){
    for(var x = 0; x <= W + step; x += step){
      var y = base + Math.sin(x*f1 + ph)*amp + Math.sin(x*f2 - ph*1.4)*amp*.34;
      if(x === 0) ctx.moveTo(0, y); else ctx.lineTo(x, y);
    }
  }

  function draw(){
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, P.sky[0]); g.addColorStop(.46, P.sky[1]); g.addColorStop(1, P.sky[2]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    // vầng trăng
    var mx = W*.74, my = H*.17, mr = Math.min(W, H)*.36;
    var mg = ctx.createRadialGradient(mx, my, 0, mx, my, mr);
    mg.addColorStop(0, "rgba(" + P.glow + ",.26)"); mg.addColorStop(1, "rgba(" + P.glow + ",0)");
    ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "rgba(" + P.glow + ",.50)";
    ctx.beginPath(); ctx.arc(mx, my, Math.min(W, H)*.042, 0, Math.PI*2); ctx.fill();

    var N = P.layers.length, step = W > 700 ? 8 : 5;
    for(var i = 0; i < N; i++){
      var base = H*(.38 + i*(.66/N));
      var amp  = Math.max(6, (24 - i*2.2) * (W/420));
      var ph   = t*(.55 + i*.16) + i*1.9;
      var f1   = (1.1 + i*.33) * Math.PI*2 / W;
      var f2   = (2.4 + i*.48) * Math.PI*2 / W;

      ctx.beginPath();
      crest(base, amp, ph, f1, f2, step);
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      ctx.fillStyle = P.layers[i]; ctx.fill();

      ctx.beginPath();
      crest(base, amp, ph, f1, f2, step);
      ctx.strokeStyle = "rgba(" + P.foam + "," + Math.max(.04, .22 - i*.025).toFixed(3) + ")";
      ctx.lineWidth = 1; ctx.stroke();
    }

    var vg = ctx.createRadialGradient(W/2, H*.44, Math.min(W,H)*.28, W/2, H*.5, Math.max(W,H)*.8);
    vg.addColorStop(0, "rgba(" + P.vig + ",0)"); vg.addColorStop(1, "rgba(" + P.vig + ",.52)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  }

  function frame(){ t += .006; draw(); requestAnimationFrame(frame); }

  resize(); draw();
  var rt;
  window.addEventListener("resize", function(){
    clearTimeout(rt); rt = setTimeout(function(){ resize(); draw(); }, 160);
  });
  if(!reduce) frame();
`;
}

/* ---------- 4. Trời đêm đầy sao ---------- */
function sceneStars(P) {
  return HEAD('trời đêm đầy sao — dải ngân hà, trăng lưỡi liềm, sao băng') + `  var W, H, seed = 21;
  var P = ${JSON.stringify(P)};

  function rnd(){ seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

  var stars = [], shots = [], snap;

  function milkyway(){
    ctx.save();
    ctx.translate(W*.52, H*.44);
    ctx.rotate(-0.62);
    var len = Math.max(W, H)*1.5;
    var g = ctx.createLinearGradient(0, -len*.22, 0, len*.22);
    g.addColorStop(0,   "rgba(" + P.band + ",0)");
    g.addColorStop(.45, "rgba(" + P.band + ",.16)");
    g.addColorStop(.55, "rgba(" + P.band + ",.16)");
    g.addColorStop(1,   "rgba(" + P.band + ",0)");
    ctx.fillStyle = g; ctx.fillRect(-len/2, -len*.22, len, len*.44);
    for(var i = 0; i < 260; i++){
      var x = (rnd()-.5)*len, y = (rnd()-.5)*len*.30;
      ctx.fillStyle = "rgba(" + P.dust + "," + (.10 + rnd()*.35).toFixed(2) + ")";
      ctx.beginPath(); ctx.arc(x, y, .4 + rnd()*1.1, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }

  function moon(){
    var mx = W*.79, my = H*.115, r = Math.min(W, H)*.070;
    var g = ctx.createRadialGradient(mx, my, 0, mx, my, r*6);
    g.addColorStop(0, "rgba(" + P.moon + ",.20)"); g.addColorStop(1, "rgba(" + P.moon + ",0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mx, my, r*6, 0, Math.PI*2); ctx.fill();
    // Lưỡi liềm vẽ trên canvas phụ rồi khoét bằng destination-out.
    // Không dùng hai ctx.arc() trong cùng một path: lần arc thứ hai tự nối
    // một đoạn thẳng từ điểm cuối, làm sai winding và ra hình vành khuyên.
    var box = Math.ceil(r*3), c = box/2;
    var mcv = document.createElement("canvas");
    mcv.width = box; mcv.height = box;
    var mc = mcv.getContext("2d");
    mc.fillStyle = "rgba(" + P.moon + ",.88)";
    mc.beginPath(); mc.arc(c, c, r, 0, Math.PI*2); mc.fill();
    mc.globalCompositeOperation = "destination-out";
    mc.beginPath(); mc.arc(c + r*.58, c - r*.05, r*1.15, 0, Math.PI*2); mc.fill();
    ctx.drawImage(mcv, mx - c, my - c);
  }

  function paint(){
    seed = 21;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W*dpr; cv.height = H*dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var g = ctx.createLinearGradient(0, 0, W*.3, H);
    g.addColorStop(0, P.sky[0]); g.addColorStop(.40, P.sky[1]);
    g.addColorStop(.72, P.sky[2]); g.addColorStop(1, P.sky[3]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    for(var i = 0; i < 7; i++){
      var x = rnd()*W, y = rnd()*H, r = Math.max(W,H)*(.18+rnd()*.26);
      var ng = ctx.createRadialGradient(x, y, 0, x, y, r);
      ng.addColorStop(0, "rgba(" + P.neb + ",.11)"); ng.addColorStop(1, "rgba(" + P.neb + ",0)");
      ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
    }

    milkyway();
    moon();

    var vg = ctx.createRadialGradient(W/2, H*.46, Math.min(W,H)*.26, W/2, H*.5, Math.max(W,H)*.82);
    vg.addColorStop(0, "rgba(" + P.vig + ",0)"); vg.addColorStop(1, "rgba(" + P.vig + ",.55)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);

    stars = [];
    var n = Math.round(Math.min(W*H/2600, 420));
    for(var i = 0; i < n; i++){
      stars.push({ x: rnd()*W, y: rnd()*H, r: .4 + Math.pow(rnd(), 2.4)*2.0,
                   o: .30 + rnd()*.60, ph: rnd()*6.3, sp: .010 + rnd()*.045 });
    }
    shots = [];
  }

  function frame(){
    if(!snap){
      snap = document.createElement("canvas");
      snap.width = cv.width; snap.height = cv.height;
      snap.getContext("2d").drawImage(cv, 0, 0);
    }
    ctx.save(); ctx.setTransform(1,0,0,1,0,0); ctx.drawImage(snap,0,0); ctx.restore();

    for(var i = 0; i < stars.length; i++){
      var s = stars[i];
      s.ph += s.sp;
      var a = s.o * (.55 + .45*Math.sin(s.ph));
      ctx.fillStyle = "rgba(" + P.star + "," + a.toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
      if(s.r > 1.5){
        ctx.strokeStyle = "rgba(" + P.star + "," + (a*.35).toFixed(3) + ")";
        ctx.lineWidth = .7; ctx.beginPath();
        ctx.moveTo(s.x - s.r*3, s.y); ctx.lineTo(s.x + s.r*3, s.y);
        ctx.moveTo(s.x, s.y - s.r*3); ctx.lineTo(s.x, s.y + s.r*3);
        ctx.stroke();
      }
    }

    if(Math.random() < .0035 && shots.length < 2){
      shots.push({ x: Math.random()*W*.8, y: Math.random()*H*.45,
                   vx: 5 + Math.random()*4, vy: 2 + Math.random()*2, life: 1 });
    }
    for(var j = shots.length - 1; j >= 0; j--){
      var sh = shots[j];
      sh.x += sh.vx; sh.y += sh.vy; sh.life -= .014;
      if(sh.life <= 0 || sh.x > W + 60){ shots.splice(j, 1); continue; }
      var tg = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx*14, sh.y - sh.vy*14);
      tg.addColorStop(0, "rgba(" + P.star + "," + (sh.life*.85).toFixed(3) + ")");
      tg.addColorStop(1, "rgba(" + P.star + ",0)");
      ctx.strokeStyle = tg; ctx.lineWidth = 1.6; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(sh.x - sh.vx*14, sh.y - sh.vy*14); ctx.stroke();
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

/* ---------- 5. Art deco hình học ---------- */
function sceneDeco(P) {
  return HEAD('art deco — vòm cong, nan quạt và đường kẻ mảnh') + `  var W, H, seed = 21;
  var P = ${JSON.stringify(P)};

  function rnd(){ seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

  function diamond(x, y, r, fill){
    ctx.beginPath();
    ctx.moveTo(x, y - r); ctx.lineTo(x + r*.62, y);
    ctx.lineTo(x, y + r); ctx.lineTo(x - r*.62, y);
    ctx.closePath();
    if(fill){ ctx.fillStyle = fill; ctx.fill(); } else ctx.stroke();
  }

  function paint(){
    seed = 21;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W*dpr; cv.height = H*dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var g = ctx.createLinearGradient(0, 0, W*.4, H);
    g.addColorStop(0, P.base[0]); g.addColorStop(.55, P.base[1]); g.addColorStop(1, P.base[2]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    var cx = W/2, S = Math.min(W, H);

    // nan quạt toả từ đáy — hiện rõ hai bên tấm thiệp
    ctx.save();
    ctx.strokeStyle = "rgba(" + P.gold + ",.26)"; ctx.lineWidth = 1;
    for(var i = 0; i <= 30; i++){
      var a = Math.PI + (i/30)*Math.PI;
      ctx.beginPath(); ctx.moveTo(cx, H*1.02);
      ctx.lineTo(cx + Math.cos(a)*S*1.5, H*1.02 + Math.sin(a)*S*1.5); ctx.stroke();
    }
    ctx.restore();

    // cung tròn quét ngang phần trên, tâm nằm ngoài khung nên không bị thiệp che
    for(var k = 0; k < 4; k++){
      ctx.strokeStyle = "rgba(" + P.gold + "," + (k % 2 ? .22 : .38) + ")";
      ctx.lineWidth = k % 2 ? .9 : 1.5;
      ctx.beginPath();
      ctx.arc(cx, -H*.22, S*(.52 + k*.11), Math.PI*.24, Math.PI*.76);
      ctx.stroke();
    }

    // hoạ tiết bậc thang bốn góc
    function corner(px, py, sx, sy){
      for(var c = 0; c < 3; c++){
        var o = 16 + c*14, len = 78 - c*18;
        ctx.strokeStyle = "rgba(" + P.gold + "," + (.42 - c*.09).toFixed(2) + ")";
        ctx.lineWidth = 1.5 - c*.3;
        ctx.beginPath();
        ctx.moveTo(px + sx*o, py + sy*(o + len));
        ctx.lineTo(px + sx*o, py + sy*o);
        ctx.lineTo(px + sx*(o + len), py + sy*o);
        ctx.stroke();
      }
    }
    corner(0, 0, 1, 1); corner(W, 0, -1, 1);
    corner(0, H, 1, -1); corner(W, H, -1, -1);

    // đường kẻ đôi sát mép
    ctx.strokeStyle = "rgba(" + P.gold + ",.30)"; ctx.lineWidth = 1;
    [9, 14].forEach(function(d){
      ctx.beginPath(); ctx.moveTo(d, 0); ctx.lineTo(d, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W - d, 0); ctx.lineTo(W - d, H); ctx.stroke();
    });

    // cột kim cương hai bên
    ctx.strokeStyle = "rgba(" + P.gold + ",.40)"; ctx.lineWidth = 1;
    for(var d = 0; d < 8; d++){
      var dy = H*(.16 + d*.096);
      diamond(11.5, dy, 7, null);
      diamond(W - 11.5, dy, 7, null);
    }

    // hạt vàng rải nhẹ
    for(var s = 0; s < 44; s++){
      ctx.fillStyle = "rgba(" + P.gold + "," + (.08 + rnd()*.18).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(rnd()*W, rnd()*H, .8 + rnd()*1.6, 0, Math.PI*2); ctx.fill();
    }

    var vg = ctx.createRadialGradient(cx, H*.44, S*.30, cx, H*.5, Math.max(W,H)*.85);
    vg.addColorStop(0, "rgba(" + P.vig + ",0)"); vg.addColorStop(1, "rgba(" + P.vig + ",.22)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);

    driftInit();
  }

  var drift = [];
  function driftInit(){
    drift = [];
    var n = Math.round(Math.min(W, 600)/48);
    for(var i = 0; i < n; i++) drift.push(mk(false));
  }
  function mk(below){
    return { x: Math.random()*W, y: below ? H + 14 : Math.random()*H,
             r: 3 + Math.random()*4, vy: -(.06 + Math.random()*.16),
             vx: (Math.random()-.5)*.10, a: Math.random()*6.3,
             va: (Math.random()-.5)*.008, o: .10 + Math.random()*.22 };
  }

  var snap;
  function frame(){
    if(!snap){
      snap = document.createElement("canvas");
      snap.width = cv.width; snap.height = cv.height;
      snap.getContext("2d").drawImage(cv, 0, 0);
    }
    ctx.save(); ctx.setTransform(1,0,0,1,0,0); ctx.drawImage(snap,0,0); ctx.restore();
    for(var i = 0; i < drift.length; i++){
      var p = drift[i];
      p.y += p.vy; p.x += p.vx + Math.sin(p.y/110)*.10; p.a += p.va;
      if(p.y < -14) drift[i] = mk(true);
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
      diamond(0, 0, p.r, "rgba(" + P.gold + "," + p.o.toFixed(2) + ")");
      ctx.restore();
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
   8 TÔNG
   ===================================================================== */
const RIVER = {
  teal:  { sky:["#05323F","#0C5568","#177C8E","#3FA0AE"], water:["#2E8595","#125E70","#052936"],
           cloud:"190,226,232", bld:"6,44,56", win:"232,240,214",
           ripple:"214,240,244", beam:"230,246,248", mote:"226,244,247", vig:"2,26,34" },
  green: { sky:["#132C1B","#295232","#4C7D4A","#8FB27C"], water:["#6E9463","#3A6038","#12261A"],
           cloud:"222,238,208", bld:"14,34,20", win:"240,238,206",
           ripple:"224,242,214", beam:"238,250,228", mote:"230,246,216", vig:"8,24,12" },
  red:   { sky:["#33080F","#6E1620","#A83828","#DE7040"], water:["#B3583A","#6E2A22","#280A0C"],
           cloud:"246,208,178", bld:"40,8,12", win:"255,224,170",
           ripple:"250,222,198", beam:"255,236,214", mote:"250,226,196", vig:"26,4,8" },
  black: { sky:["#030304","#0A0B0D","#141519","#262830"], water:["#1E2127","#0D0F13","#020203"],
           cloud:"201,169,97", bld:"0,0,0", win:"255,214,140",
           ripple:"214,196,156", beam:"232,214,170", mote:"226,200,150", vig:"0,0,0" }
};

const THEMES = [
  { file:'index.html', label:'teal · sông Sài Gòn', scheme:'dark', surf:DARK,
    scene: sceneRiver(RIVER.teal),
    t:{ bg:'#0B4553', contrast:'#062A36', accent:'#7FC1CB',
        glow:'rgba(127,193,203,.16)', aline:'rgba(127,193,203,.35)', cream:'#F6FAFB',
        ink:'#F1F8F9', soft:'rgba(241,248,249,.72)', faint:'rgba(241,248,249,.52)',
        line:'rgba(214,233,236,.30)', glass:'rgba(9,58,71,.34)', glassS:'rgba(8,52,64,.46)',
        glassE:'rgba(190,224,230,.28)', shadow:'rgba(0,20,28,.82)', inner:'rgba(214,233,236,.12)' } },

  { file:'thiep-xanh-la.html', label:'xanh lá · sông Sài Gòn', scheme:'dark', surf:DARK,
    scene: sceneRiver(RIVER.green),
    t:{ bg:'#2A5434', contrast:'#122A18', accent:'#BCD3A6',
        glow:'rgba(188,211,166,.18)', aline:'rgba(188,211,166,.38)', cream:'#F7FBF4',
        ink:'#F2F8EE', soft:'rgba(242,248,238,.74)', faint:'rgba(242,248,238,.54)',
        line:'rgba(219,236,210,.30)', glass:'rgba(20,48,26,.36)', glassS:'rgba(17,42,23,.50)',
        glassE:'rgba(198,224,186,.28)', shadow:'rgba(6,22,10,.82)', inner:'rgba(219,236,210,.12)' } },

  { file:'thiep-do.html', label:'đỏ hoàng hôn · sông Sài Gòn', scheme:'dark', surf:DARK,
    scene: sceneRiver(RIVER.red),
    t:{ bg:'#6E1620', contrast:'#2C0A0C', accent:'#EDBB8E',
        glow:'rgba(237,187,142,.18)', aline:'rgba(237,187,142,.38)', cream:'#FDF6F0',
        ink:'#FBF1EA', soft:'rgba(251,241,234,.74)', faint:'rgba(251,241,234,.54)',
        line:'rgba(240,215,196,.30)', glass:'rgba(56,12,16,.38)', glassS:'rgba(48,10,14,.52)',
        glassE:'rgba(232,192,166,.26)', shadow:'rgba(24,4,6,.84)', inner:'rgba(240,215,196,.12)' } },

  { file:'thiep-den.html', label:'đen & vàng kim · sông Sài Gòn', scheme:'dark', surf:DARK,
    scene: sceneRiver(RIVER.black),
    t:{ bg:'#111214', contrast:'#0A0A0B', accent:'#C9A961',
        glow:'rgba(201,169,97,.18)', aline:'rgba(201,169,97,.40)', cream:'#F5F1E8',
        ink:'#F2EFE7', soft:'rgba(242,239,231,.72)', faint:'rgba(242,239,231,.50)',
        line:'rgba(201,169,97,.28)', glass:'rgba(10,10,12,.44)', glassS:'rgba(8,8,10,.58)',
        glassE:'rgba(201,169,97,.24)', shadow:'rgba(0,0,0,.88)', inner:'rgba(201,169,97,.14)' } },

  { file:'thiep-hoa.html', label:'nền sáng · vườn hoa màu nước', scheme:'light', surf:LIGHT,
    scene: sceneFloral({
      base:["#F6F9F0","#E3EDD8","#C7D9BA"],
      wash:["rgba(122,150,110,.40)","rgba(122,150,110,0)","rgba(255,255,255,.60)","rgba(255,255,255,0)"],
      leafA:"rgba(92,120,82,.32)", leafB:"rgba(158,186,140,.42)",
      roseA:["rgba(226,176,180,.60)","rgba(248,230,232,.85)"],
      roseB:["rgba(252,250,244,.68)","rgba(255,255,255,.90)"],
      petal:"rgba(255,255,255,.92)", pollen:"#E8D48B",
      fall:"255,255,255", vig:"92,112,82" }),
    t:{ bg:'#E6EEDC', contrast:'#FFFFFF', accent:'#5F7A52',
        glow:'rgba(95,122,82,.16)', aline:'rgba(95,122,82,.36)', cream:'#35452F',
        ink:'#3D4A37', soft:'rgba(53,69,47,.78)', faint:'rgba(53,69,47,.56)',
        line:'rgba(53,69,47,.22)', glass:'rgba(255,255,255,.46)', glassS:'rgba(255,255,255,.68)',
        glassE:'rgba(255,255,255,.85)', shadow:'rgba(60,80,52,.38)', inner:'rgba(53,69,47,.10)' } },

  { file:'thiep-song.html', label:'xanh navy · sóng biển động', scheme:'dark', surf:DARK,
    scene: sceneWaves({
      sky:["#03192B","#06304C","#0A4A6B"],
      layers:["rgba(10,74,107,.92)","rgba(8,62,92,.92)","rgba(7,52,79,.93)",
              "rgba(6,43,66,.94)","rgba(5,34,53,.95)","rgba(4,26,41,.96)","rgba(3,19,30,.98)"],
      foam:"175,219,235", glow:"196,228,240", vig:"1,12,22" }),
    t:{ bg:'#072438', contrast:'#04121D', accent:'#8FC7DC',
        glow:'rgba(143,199,220,.18)', aline:'rgba(143,199,220,.38)', cream:'#F2F9FC',
        ink:'#EAF4F8', soft:'rgba(234,244,248,.74)', faint:'rgba(234,244,248,.54)',
        line:'rgba(200,228,240,.28)', glass:'rgba(6,32,50,.40)', glassS:'rgba(5,26,42,.55)',
        glassE:'rgba(160,204,224,.26)', shadow:'rgba(0,12,22,.86)', inner:'rgba(200,228,240,.12)' } },

  { file:'thiep-sao.html', label:'tím đêm · trời đầy sao', scheme:'dark', surf:DARK,
    scene: sceneStars({
      sky:["#04050E","#0A0B1E","#161034","#221A44"],
      neb:"120,96,190", band:"196,192,236", dust:"226,224,248",
      star:"248,246,238", moon:"250,244,226", vig:"2,2,8" }),
    t:{ bg:'#0A0A18', contrast:'#07060F', accent:'#E3C97F',
        glow:'rgba(227,201,127,.18)', aline:'rgba(227,201,127,.40)', cream:'#F5F2E9',
        ink:'#EFEDE4', soft:'rgba(239,237,228,.72)', faint:'rgba(239,237,228,.50)',
        line:'rgba(227,201,127,.26)', glass:'rgba(10,10,26,.44)', glassS:'rgba(8,8,20,.58)',
        glassE:'rgba(227,201,127,.22)', shadow:'rgba(0,0,0,.88)', inner:'rgba(227,201,127,.13)' } },

  { file:'thiep-deco.html', label:'kem & vàng đồng · art deco', scheme:'light', surf:LIGHT,
    scene: sceneDeco({
      base:["#FCF8F0","#F5EEE0","#EBE0CB"],
      gold:"150,116,52", vig:"120,96,52" }),
    t:{ bg:'#F6F0E4', contrast:'#FFFFFF', accent:'#8A6A2A',
        glow:'rgba(138,106,42,.16)', aline:'rgba(138,106,42,.36)', cream:'#2E2A22',
        ink:'#37322A', soft:'rgba(46,42,34,.78)', faint:'rgba(46,42,34,.56)',
        line:'rgba(138,106,42,.30)', glass:'rgba(255,255,255,.48)', glassS:'rgba(255,253,248,.70)',
        glassE:'rgba(198,168,112,.45)', shadow:'rgba(90,70,40,.34)', inner:'rgba(138,106,42,.16)' } }
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
console.log('Đã sinh ' + THEMES.length + ' file:\n  ' + out.join('\n  '));
