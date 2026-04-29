// ── LOGIN ────────────────────────────────────────────────────────────────
(function verificarLogin() {
if (sessionStorage.getItem(‘jce_auth’) === ‘1’) {
const o = document.getElementById(‘login-overlay’);
if (o) o.style.display = ‘none’;
}
})();
function tentarLogin() {
const user = (document.getElementById(‘login-user’)?.value || ‘’).trim();
const pass = (document.getElementById(‘login-pass’)?.value || ‘’).trim();
const erro = document.getElementById(‘login-erro’);
if (user === ‘jce.adminis’ && pass === ‘adminis’) {
sessionStorage.setItem(‘jce_auth’, ‘1’);
const o = document.getElementById(‘login-overlay’);
o.classList.add(‘hide’);
setTimeout(() => o.style.display = ‘none’, 520);
} else {
erro.textContent = ‘Usuário ou senha incorretos.’;
document.getElementById(‘login-pass’).value = ‘’;
document.getElementById(‘login-pass’).focus();
setTimeout(() => erro.textContent = ‘’, 3000);
}
}

// ── DADOS ────────────────────────────────────────────────────────────────
const MESES      = [‘JAN’,‘FEV’,‘MAR’,‘ABR’,‘MAI’,‘JUN’,‘JUL’,‘AGO’,‘SET’,‘OUT’,‘NOV’,‘DEZ’];
const ANO_ATUAL  = new Date().getFullYear();
const PALAVRAS_DESTAQUE = [‘CAVALO’,‘CARRETA 1’,‘CARRETA 2’,‘CARRETA’];

const ITENS = {
lub: [
[1,  “Óleo de Motor (examinar nível)”],
[2,  “Óleo Direção Hidráulica (examinar nível)”],
[3,  “Fluido de Arrefecimento (examinar nível)”]
],
motor: [
[4,  “Ausência de Vazamentos de Óleo”],
[5,  “Ruído do Motor”],
[6,  “Correias”]
],
eletrica: [
[7,  “Farois / Lanternas / Lampadas / Sinalizações”]
],
freio_cav: [
[8,  “Verificar Lonas”],
[9,  “Verificar Cubos e Rolamentos”]
],
cabine: [
[10, “Tacógrafo e Computador de Bordo em Perfeito Estado de Funcionamento”],
[11, “Adesivo de Tara e Lotação”],
[12, “Para-brisa sem Trincas / Limpadores / esguicho de água”],
[13, { type:‘mes’, label:‘Extintor’ }]
],
chassi_cav: [
[14, “Longarinas e Travessas (verificar corrosão / trinca / torção / amassado)”],
[15, “Para-choque (amassado / Pintura)”],
[16, “Placa (Lacre / Iluminação / Pintura)”],
[17, “Suporte dos Grampos (verificar: grampos/porcas/feixe de molas/batentes e suportes)”],
[18, “Para-Lama / Para-barro (verificar)”],
[19, “Quinta-Roda e Gavião (examinar folga) Pino Rei”],
[20, “Pneus (avaliar acima de 2,5 mm +/- 0,5 mm) inclusive estepe - aperto de parafusos das rodas”],
[21, “Alinhamento e Balanceamento”],
[22, “Tanques de combustível sem vazamentos e suporte do tanque”],
[23, “Defletor de ar”],
[24, “Estofados, capas, cortinas, carpetes e tapetes”]
],
gases: [
[25, “Verificação opacidade”]
],
freio_sr: [
[26, “Verificar Lonas”],
[27, “Verificar Cubos e Rolamentos”]
],
outros: [
[28, “Válvulas”],
[29, “Acoplamentos”],
[30, “Gaxetas / Selos”],
[31, “Mangotes e Medidores”],
[32, “Unidades de Controle de Temperaturas”],
[33, “Equipamentos de Segurança”],
[34, “Placas de simbologia”],
[35, “Válvulas de Alívio”],
[36, “Óleo do Compressor (verificar)”],
[37, “Filtro do Compressor (verificar estado)”],
[38, “Compressor (Fazer Teste)”],
[39, “Motor da Glucose e seus Componentes (Fazer Teste)”],
[40, “Bomba Descarga (Fazer Teste)”],
[41, “Verificar Parte Elétrica (cabos e caixa elétrica)”],
[42, { type:‘multi_qty’, labels:[‘Cintas’,‘Catracas’,‘Cantoneiras’,‘Réguas’] }],
[43, “Lonas laterais, teto e cabo de aço”],
[44, { type:‘mes’, label:‘Extintor’ }]
],
chassi_sr: [
[45, “Longarinas e Travessas (verificar corrosão / trinca / torção / amassado)”],
[46, “Para-choque (amassado / Pintura)”],
[47, “Placa (Lacre / Iluminação / Pintura)”],
[48, “Suporte dos Grampos (verificar: grampos/porcas/feixe de molas/batentes e suportes)”],
[49, “Para-Lama / Para-barro (verificar)”],
[50, “Quinta-Roda (examinar folga)”],
[51, “Pneus (avaliar acima de 2,5 mm +/- 0,5 mm) inclusive estepe”],
[52, “Reaperto de Parafusos de Rodas”],
[53, “Reaperto Rala”],
[54, “Reaperto Pistão”],
[55, “Reaperto Pés e Conexões”],
[56, “Alinhamento e Balanceamento”]
],
suspensao: [
[57, “Molas, Pinos e Estirantes”]
],
carga: [
[58, “Lonas de Forração, Cordas, Madeirite e travas (uso somente para baú)”]
]
};

const MAP = {
b_lub:‘lub’, b_motor:‘motor’, b_eletrica:‘eletrica’,
b_freio_cav:‘freio_cav’, b_cabine:‘cabine’, b_chassi_cav:‘chassi_cav’,
b_gases:‘gases’, b_freio_sr:‘freio_sr’, b_outros:‘outros’,
b_chassi_sr:‘chassi_sr’, b_suspensao:‘suspensao’, b_carga:‘carga’
};

const GRUPOS_CAVALO = [‘lub’,‘motor’,‘eletrica’,‘freio_cav’,‘cabine’,‘chassi_cav’,‘gases’];
const GRUPOS_SR     = [‘freio_sr’,‘outros’,‘chassi_sr’,‘suspensao’,‘carga’];

// mapa de atribuição de carreta para NOKs do SR quando rodotrem ativo
const nokCarretaMap = {};

function descItem(d) {
if (typeof d !== ‘object’) return d;
if (d.type === ‘multi_qty’) return d.labels.join(’ / ’);
return d.label;
}

function isExtintor(d) {
return typeof d === ‘object’ && d.type === ‘mes’ && d.label === ‘Extintor’;
}

// ── RENDERIZAÇÃO ─────────────────────────────────────────────────────────
(function renderItens() {
for (const [bid, grp] of Object.entries(MAP)) {
const tb = document.getElementById(bid);
if (!tb) continue;
ITENS[grp].forEach(([n, d]) => {
const isObj = typeof d === ‘object’;
let celulaDesc = ‘’;

```
  if (isObj && d.type === 'multi_qty') {
    let opts = '<option value="">—</option>';
    for (let i = 1; i <= 50; i++) opts += `<option value="${i}">${i}</option>`;
    celulaDesc = `<div class="multi-qty-row">${
      d.labels.map((lbl, idx) =>
        `<span class="multi-qty-item">${lbl}: <select id="i${n}_qty${idx}" class="item-select">${opts}</select></span>`
      ).join('')
    }</div>`;
  } else if (isObj && d.type === 'mes') {
    let opts = '<option value="">—</option>';
    for (let a = ANO_ATUAL; a <= ANO_ATUAL + 5; a++)
      MESES.forEach(m => opts += `<option value="${m}/${a}">${m}/${a}</option>`);
    celulaDesc = `${d.label}<span class="item-extra"><select id="i${n}_mes" class="item-select">${opts}</select></span>`;
  } else {
    celulaDesc = String(d);
  }

  const tr = document.createElement('tr');
  tr.setAttribute('data-n', n);
  tr.setAttribute('data-grp', grp);
  tr.innerHTML = `
    <td>${n}</td>
    <td>${celulaDesc}</td>
    <td>
      <div class="chk-group">
        <label class="chk-option"><input type="checkbox" id="i${n}_ok"> OK</label>
        <label class="chk-option"><input type="checkbox" id="i${n}_nok" class="chk-nok"> NOK</label>
        <label class="chk-option"><input type="checkbox" id="i${n}_na"> NA</label>
      </div>
    </td>`;
  tb.appendChild(tr);

  // listeners adicionados via JS para suportar async corretamente
  document.getElementById(`i${n}_ok`) .addEventListener('change', () => onCheck(n, grp));
  document.getElementById(`i${n}_nok`).addEventListener('change', () => onCheck(n, grp));
  document.getElementById(`i${n}_na`) .addEventListener('change', () => onCheck(n, grp));
});
```

}
})();

// ── POPUP CARRETA 1 / CARRETA 2 ──────────────────────────────────────────
// Usando callbacks em vez de Promise para compatibilidade máxima com iOS/Safari
let _popupCallback = null;

function mostrarPopupCarreta(descricao, callback) {
_popupCallback = callback;
document.getElementById(‘popup-item-desc’).textContent = descricao;
document.getElementById(‘popup-carreta’).style.display = ‘flex’;
}

function resolverCarreta(opcao) {
document.getElementById(‘popup-carreta’).style.display = ‘none’;
if (_popupCallback) {
const cb = _popupCallback;
_popupCallback = null;
cb(opcao);
}
}

function cancelarCarreta() {
document.getElementById(‘popup-carreta’).style.display = ‘none’;
if (_popupCallback) {
const cb = _popupCallback;
_popupCallback = null;
cb(null);
}
}

// ── ON CHECK ─────────────────────────────────────────────────────────────
function onCheck(n, grp) {
const nok = document.getElementById(`i${n}_nok`)?.checked;
const rt  = document.getElementById(‘tipo_rodotrem’)?.checked;
const tr  = document.querySelector(`tr[data-n="${n}"]`);

if (tr) tr.classList.toggle(‘nok-row’, !!nok);

if (nok && rt && GRUPOS_SR.includes(grp)) {
// mostra popup e aguarda escolha via callback
const desc = descItem(encontrarItem(n));
mostrarPopupCarreta(desc, function(escolha) {
if (escolha) {
nokCarretaMap[n] = escolha;
} else {
document.getElementById(`i${n}_nok`).checked = false;
if (tr) tr.classList.remove(‘nok-row’);
delete nokCarretaMap[n];
}
atualizarObsNOK();
});
return; // não atualiza obs ainda — aguarda callback
}

if (!nok) delete nokCarretaMap[n];
atualizarObsNOK();
}

function encontrarItem(n) {
for (const grp of Object.keys(ITENS)) {
for (const [num, d] of ITENS[grp]) {
if (num === n) return d;
}
}
return String(n);
}

// ── HELPERS ──────────────────────────────────────────────────────────────
function getChecks(n) {
const v = [];
if (document.getElementById(`i${n}_ok`)?.checked)  v.push(‘OK’);
if (document.getElementById(`i${n}_nok`)?.checked) v.push(‘NOK’);
if (document.getElementById(`i${n}_na`)?.checked)  v.push(‘NA’);
return v;
}

function getExtra(n, d) {
if (typeof d !== ‘object’) return ‘’;
if (d.type === ‘mes’) return document.getElementById(`i${n}_mes`)?.value || ‘’;
if (d.type === ‘multi_qty’) {
return d.labels.map((lbl, idx) => {
const v = document.getElementById(`i${n}_qty${idx}`)?.value;
return v ? `${lbl}: ${v}` : null;
}).filter(Boolean).join(’  ’);
}
return ‘’;
}

function getExtraPDF(n, d) {
if (typeof d !== ‘object’) return ‘’;
if (d.type === ‘mes’) return document.getElementById(`i${n}_mes`)?.value || ‘’;
if (d.type === ‘multi_qty’) {
return d.labels.map((lbl, idx) => {
const v = document.getElementById(`i${n}_qty${idx}`)?.value;
return v ? `Qtd. ${lbl}: ${v}` : null;
}).filter(Boolean).join(’  ’);
}
return ‘’;
}

// ── NOK → OBSERVAÇÕES ────────────────────────────────────────────────────
function coletarNOK(grupos, filtroCarreta) {
const linhas = [];
for (const grp of grupos) {
(ITENS[grp] || []).forEach(([n, d]) => {
if (!document.getElementById(`i${n}_nok`)?.checked) return;
if (filtroCarreta !== undefined) {
const atrib = nokCarretaMap[n];
// inclui se atribuído exatamente ao filtro OU se atribuído como AMBAS
if (atrib !== filtroCarreta && atrib !== ‘AMBAS’) return;
}
let txt = descItem(d).toUpperCase();
const extra = getExtra(n, d);
if (extra) txt += ` ${extra.toUpperCase()}`;
txt += ’ NOK’;
linhas.push(`${n}. ${txt}`);
});
}
return linhas;
}

function atualizarObsNOK() {
const rt = document.getElementById(‘tipo_rodotrem’)?.checked;

const nokCav = coletarNOK(GRUPOS_CAVALO, undefined);
let autoTxt  = ‘’;

if (nokCav.length) autoTxt += ‘CAVALO\n’ + nokCav.join(’\n’) + ‘\n\n’;

if (rt) {
const nok1 = coletarNOK(GRUPOS_SR, ‘CARRETA 1’);
const nok2 = coletarNOK(GRUPOS_SR, ‘CARRETA 2’);
if (nok1.length) autoTxt += ‘CARRETA 1\n’ + nok1.join(’\n’) + ‘\n\n’;
if (nok2.length) autoTxt += ‘CARRETA 2\n’ + nok2.join(’\n’) + ‘\n\n’;
} else {
const nokSR = coletarNOK(GRUPOS_SR, undefined);
if (nokSR.length) autoTxt += ‘CARRETA\n’ + nokSR.join(’\n’) + ‘\n\n’;
}

const obsEl  = document.getElementById(‘observacoes’);
const SEP    = ‘\u200B’;
const atual  = obsEl.value;
const manual = atual.includes(SEP) ? atual.split(SEP)[0].trimEnd() : atual.trimEnd();

let novo = ‘’;
if (manual) novo += manual + ‘\n\n’;
if (autoTxt.trim()) novo += SEP + autoTxt.trimEnd();
obsEl.value = novo.trimStart();
}

// ── FORMATAÇÃO ───────────────────────────────────────────────────────────
function formatarKM(el) {
const v = el.value.replace(/\D/g, ‘’);
el.value = v === ‘’ ? ‘’ : parseInt(v, 10).toLocaleString(‘pt-BR’);
}

function formatarPlaca(el) {
const raw = el.value.toUpperCase().replace(/[^A-Z0-9]/g, ‘’).slice(0, 7);
el.value  = raw.length > 3 ? raw.slice(0, 3) + ‘-’ + raw.slice(3) : raw;
}

function aplicarFormatacaoObs(txt) { return txt.toUpperCase(); }

window.addEventListener(‘DOMContentLoaded’, () => {
const el = document.getElementById(‘data’);
if (el && !el.value) el.value = new Date().toISOString().split(‘T’)[0];
});

// ── CANVAS ───────────────────────────────────────────────────────────────
const DPR   = Math.min(window.devicePixelRatio || 1, 3);
const SIG_W = Math.round(540 * DPR);
const SIG_H = Math.round(160 * DPR);

function initCanvas(id) {
const c = document.getElementById(id);
c.width = SIG_W; c.height = SIG_H;
const ctx = c.getContext(‘2d’);
ctx.fillStyle = ‘#ffffff’; ctx.fillRect(0, 0, SIG_W, SIG_H);
ctx.lineWidth = 2.5 * DPR; ctx.lineCap = ‘round’; ctx.lineJoin = ‘round’; ctx.strokeStyle = ‘#0a0a0a’;
let dr = false;
const pt = e => {
const r = c.getBoundingClientRect(), src = e.touches ? e.touches[0] : e;
return { x: (src.clientX - r.left) * (SIG_W / r.width), y: (src.clientY - r.top) * (SIG_H / r.height) };
};
const start = e => { dr = true; const p = pt(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
const move  = e => { if (!dr) return; const p = pt(e); ctx.lineTo(p.x, p.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
const stop  = () => dr = false;
c.addEventListener(‘mousedown’,  start);
c.addEventListener(‘mousemove’,  move);
c.addEventListener(‘mouseup’,    stop);
c.addEventListener(‘mouseleave’, stop);
c.addEventListener(‘touchstart’, e => { e.preventDefault(); start(e); }, { passive: false });
c.addEventListener(‘touchmove’,  e => { e.preventDefault(); move(e);  }, { passive: false });
c.addEventListener(‘touchend’,   stop);
}
initCanvas(‘canvas_conf’);
initCanvas(‘canvas_mot’);

function limpar(id) {
const c = document.getElementById(id), ctx = c.getContext(‘2d’);
ctx.fillStyle = ‘#ffffff’; ctx.fillRect(0, 0, c.width, c.height);
}

function temAssinatura(id) {
const d = document.getElementById(id).getContext(‘2d’).getImageData(0, 0, SIG_W, SIG_H).data;
for (let i = 0; i < d.length; i += 4) if (d[i] < 200 && d[i+1] < 200 && d[i+2] < 200) return true;
return false;
}

// ── MODAL ────────────────────────────────────────────────────────────────
let etapaAtual = 1;

function abrirModal()  { etapaAtual = 1; atualizarEtapa(); document.getElementById(‘modal-overlay’).classList.add(‘show’); }
function fecharModal() { document.getElementById(‘modal-overlay’).classList.remove(‘show’); }
function irEtapa(n)    { etapaAtual = n; atualizarEtapa(); }

function atualizarEtapa() {
[1,2,3].forEach(i => document.getElementById(`step${i}`).style.display = i === etapaAtual ? ‘’ : ‘none’);
[1,2,3].forEach((*, i) => {
const dot = document.getElementById(`dot${i+1}`);
const lbl = document.getElementById(`lbl${i+1}`);
dot.classList.remove(‘active’,‘done’); lbl.classList.remove(‘active’,‘done’);
if (i+1 < etapaAtual)       { dot.classList.add(‘done’);   lbl.classList.add(‘done’); }
else if (i+1 === etapaAtual) { dot.classList.add(‘active’); lbl.classList.add(‘active’); }
});
[1,2].forEach((*, i) => {
const line = document.getElementById(`line${i+1}`);
line.classList.remove(‘done’);
if (i+1 < etapaAtual) line.classList.add(‘done’);
});
if (etapaAtual === 3) {
document.getElementById(‘prev_conf’).src = document.getElementById(‘canvas_conf’).toDataURL(‘image/png’);
document.getElementById(‘prev_mot’).src  = document.getElementById(‘canvas_mot’).toDataURL(‘image/png’);
}
}

document.getElementById(‘modal-overlay’).addEventListener(‘click’, function(e) {
if (e.target === this) fecharModal();
});

const gv = id => (document.getElementById(id) || {}).value || ‘’;
const gc = id => document.getElementById(id)?.checked || false;

// ── PDF ──────────────────────────────────────────────────────────────────
function gerarPDF() {
const { jsPDF } = window.jspdf;
const doc = new jsPDF({ orientation:‘p’, unit:‘mm’, format:‘a4’ });
const W = 210, ML = 12, cW = 186;
const ROD_Y = 278, ROD_H = 10, SIG_H_PDF = 32;
const SIG_Y = ROD_Y - SIG_H_PDF - 3;
let y = 0, pag = 1;
const AZUL=[26,26,46], CZ=[228,232,242], CZS=[210,218,236];

function cabecalho() {
y = 0;
doc.setFillColor(255,255,255); doc.rect(0,0,W,15,‘F’);
doc.setDrawColor(200); doc.setLineWidth(.3); doc.line(0,15,W,15);
doc.setFontSize(11); doc.setFont(‘helvetica’,‘bold’); doc.setTextColor(20,20,20);
doc.text(‘CHECK LIST DE MANUTENCAO PREVENTIVA’, ML+2, 9.5);
try {
const logo = document.getElementById(‘logo-img-hidden’);
if (logo && logo.complete) doc.addImage(logo, ‘PNG’, W-ML-30, 0.5, 30, 14);
} catch(e) {}
y = 17;
doc.setLineWidth(.25); doc.setDrawColor(160);
doc.rect(ML,y,cW,6);
const c1=[28,18,26,cW-72]; let x=ML;
doc.setFontSize(6.2); doc.setFont(‘helvetica’,‘bold’); doc.setTextColor(50,50,50);
[‘DATA’,‘REVISAO’,‘PAGINA’,‘DEPARTAMENTO’].forEach((h,i)=>{ doc.text(h,x+1,y+2.2); x+=c1[i]; if(i<3) doc.line(x,y,x,y+6); });
x=ML; doc.setFont(‘helvetica’,‘normal’); doc.setTextColor(15,15,15);
[gv(‘data’),gv(‘revisao’)||‘00’,‘1 de 2’,gv(‘departamento’)||‘Frota / Manutencao’].forEach((v,i)=>{ doc.text(v,x+1,y+4.8); x+=c1[i]; });
y+=6.5;
doc.rect(ML,y,cW,6);
doc.setFont(‘helvetica’,‘bold’); doc.setFontSize(6.2); doc.setTextColor(50,50,50);
doc.text(‘TIPO’,ML+1,y+2.2); doc.setFont(‘helvetica’,‘normal’);
const cv=gc(‘tipo_cavalo’),sd=gc(‘tipo_sider’),rt=gc(‘tipo_rodotrem’);
doc.text(`(${cv?'X':' '}) CAVALO  (${sd?'X':' '}) SIDER  (${rt?'X':' '}) RODOTREM`,ML+11,y+2.2);
const dx=ML+cW/2-8;
doc.setFont(‘helvetica’,‘bold’); doc.text(‘DATA’,dx,y+2.2);
doc.setFont(‘helvetica’,‘normal’); doc.text(gv(‘data’),dx+9,y+2.2);
doc.setFont(‘helvetica’,‘bold’); doc.text(‘KM’,ML+cW-22,y+2.2);
doc.setFont(‘helvetica’,‘normal’); doc.text(gv(‘km’),ML+cW-16,y+2.2);
y+=6.5;
doc.rect(ML,y,cW,6);
[cW*.44,cW*.63,cW*.81].forEach(p=>doc.line(ML+p,y,ML+p,y+6));
doc.setFont(‘helvetica’,‘bold’); doc.setFontSize(6.2);
doc.text(‘NOME MOTORISTA’,ML+1,y+2.2); doc.text(‘PLACA CAVALO’,ML+cW*.44+1,y+2.2);
doc.text(‘PLACA SR1’,ML+cW*.63+1,y+2.2); doc.text(‘PLACA SR2’,ML+cW*.81+1,y+2.2);
doc.setFont(‘helvetica’,‘normal’);
doc.text(gv(‘motorista’),ML+1,y+4.8);
doc.text(gv(‘placa_cavalo’),ML+cW*.44+1,y+4.8);
doc.text(gv(‘placa_sr1’),ML+cW*.63+1,y+4.8);
doc.text(gv(‘placa_sr2’),ML+cW*.81+1,y+4.8);
y+=8;
}

function novaPag() { doc.addPage(); pag++; y=8; }
function chk(esp=14) {
if (pag===1 && y>297-esp) { novaPag(); return; }
if (pag===2 && y>SIG_Y-esp) novaPag();
}

function secTit(t) {
chk(); doc.setFillColor(…AZUL); doc.rect(ML,y,cW,4.8,‘F’);
doc.setFontSize(6.8); doc.setFont(‘helvetica’,‘bold’); doc.setTextColor(255,255,255);
doc.text(t.toUpperCase(),ML+2.5,y+3.3); y+=5.5;
}

function subTit(t) {
chk(); doc.setFillColor(…CZS); doc.rect(ML,y,cW,3.8,‘F’);
doc.setFontSize(6.2); doc.setFont(‘helvetica’,‘bold’); doc.setTextColor(…AZUL);
doc.text(t.toUpperCase(),ML+2.5,y+2.7); y+=4.4;
}

function iRow(n, d, par) {
chk(10);
const rh    = 4.0;
const desc  = descItem(d);
const extra = getExtraPDF(n, d);
const nok   = getChecks(n).includes(‘NOK’);
const ext   = isExtintor(d);

```
if (par) { doc.setFillColor(248,249,253); doc.rect(ML,y,cW,rh,'F'); }
doc.setLineWidth(.13); doc.setDrawColor(200);
doc.rect(ML,y,cW,rh); doc.line(ML+9,y,ML+9,y+rh); doc.line(ML+cW-50,y,ML+cW-50,y+rh);
doc.setFontSize(5.8); doc.setFont('helvetica','bold'); doc.setTextColor(140,140,140);
doc.text(String(n),ML+4.5,y+2.7,{align:'center'});
doc.setFont('helvetica','normal'); doc.setTextColor(15,15,15);
let txt = desc;
if (extra) txt += `  ${extra}`;
if (nok)   txt += ' NOK';
if (nok && ext) txt += ' - TROCAR';
doc.text(doc.splitTextToSize(txt, cW-62), ML+10.5, y+2.7);
const checks = getChecks(n);
doc.setFontSize(5.5); doc.setTextColor(15,15,15);
doc.text(`(${checks.includes('OK')?'X':' '}) OK  (${checks.includes('NOK')?'X':' '}) NOK  (${checks.includes('NA')?'X':' '}) NA`, ML+cW-49, y+2.7);
y+=rh;
```

}

function grpRender(k) { ITENS[k].forEach(([n,d],i) => iRow(n,d,i%2===1)); }

function rodapeFinal() {
doc.setPage(2);
doc.setFillColor(…CZ); doc.rect(ML,ROD_Y,cW,ROD_H/2,‘F’);
doc.setLineWidth(.2); doc.setDrawColor(145); doc.rect(ML,ROD_Y,cW,ROD_H/2);
const cs=[28,18,48,48,cW-142]; let rx=ML;
doc.setFontSize(5.8); doc.setFont(‘helvetica’,‘bold’); doc.setTextColor(40,40,80);
[‘DATA’,‘REVISAO’,‘ELABORADO POR’,‘APROVADO POR’,‘PAGINA’].forEach((h,i)=>{
doc.text(h,rx+1,ROD_Y+3); rx+=cs[i]; if(i<4) doc.line(rx,ROD_Y,rx,ROD_Y+ROD_H/2);
});
rx=ML; doc.rect(ML,ROD_Y+ROD_H/2,cW,ROD_H/2);
const ap=gv(‘aprovado’)||‘Andre Cruz’;
[gv(‘data’),‘00’,ap,ap,‘2 de 2’].forEach((v,i)=>{
doc.setFont(‘helvetica’,‘normal’); doc.setFontSize(5.8); doc.setTextColor(15);
doc.text(v,rx+1,ROD_Y+ROD_H/2+3.5); rx+=cs[i];
});
}

function assinaturas() {
doc.setPage(2);
const bW=(cW-8)/2;
doc.setFillColor(…CZS); doc.rect(ML,SIG_Y,cW,4,‘F’);
doc.setFontSize(6.5); doc.setFont(‘helvetica’,‘bold’); doc.setTextColor(…AZUL);
doc.text(‘ASSINATURAS’,ML+2.5,SIG_Y+2.8);
const boxY=SIG_Y+5, boxH=SIG_H_PDF-9;
doc.setFillColor(255,255,255); doc.setDrawColor(160); doc.setLineWidth(.2);
doc.rect(ML,boxY,bW,boxH); doc.rect(ML+bW+8,boxY,bW,boxH);
const imgH=boxH-10;
if (temAssinatura(‘canvas_conf’))
doc.addImage(document.getElementById(‘canvas_conf’).toDataURL(‘image/png’),‘PNG’,ML+2,boxY+1,bW-4,imgH);
if (temAssinatura(‘canvas_mot’))
doc.addImage(document.getElementById(‘canvas_mot’).toDataURL(‘image/png’),‘PNG’,ML+bW+10,boxY+1,bW-4,imgH);
doc.setDrawColor(100); doc.setLineWidth(.3);
doc.line(ML+2,boxY+boxH-7,ML+bW-2,boxY+boxH-7);
doc.line(ML+bW+10,boxY+boxH-7,ML+cW-2,boxY+boxH-7);
doc.setFontSize(6.2); doc.setFont(‘helvetica’,‘normal’); doc.setTextColor(55,55,55);
doc.text(‘Conferente / Vistoriador’,ML+2,boxY+boxH-4.5);
doc.text(’Nome: ’+gv(‘vistoriador’),ML+2,boxY+boxH-1.5);
doc.text(‘Motorista’,ML+bW+10,boxY+boxH-4.5);
doc.text(’Nome: ’+gv(‘motorista’),ML+bW+10,boxY+boxH-1.5);
}

function observacoes() {
if (pag===1) novaPag();
doc.setFontSize(6.8); doc.setFont(‘helvetica’,‘bold’); doc.setTextColor(15,15,15);
doc.text(‘Observacoes:’,ML,y); y+=4;
const obsTop=y, obsH=Math.max(10,SIG_Y-4-obsTop);
doc.setFillColor(255,255,255); doc.setDrawColor(170); doc.setLineWidth(.2);
doc.rect(ML,obsTop,cW,obsH);
for (let i=1; i*4<obsH-2; i++) { doc.setDrawColor(220); doc.line(ML+2,obsTop+i*4,ML+cW-2,obsTop+i*4); }
const SEP    = ‘\u200B’;
const rawObs = gv(‘observacoes’).replace(new RegExp(SEP,‘g’),’’).toUpperCase().trim();
if (rawObs) {
const linhas  = doc.splitTextToSize(rawObs, cW-6);
const palavras = […PALAVRAS_DESTAQUE].sort((a,b)=>b.length-a.length);
let ty = obsTop+4;
for (const linha of linhas) {
if (ty>obsTop+obsH-3) break;
renderLinhaObs(linha,ML+3,ty,palavras); ty+=4;
}
}
}

function renderLinhaObs(linha, x, baseY, palavras) {
const regex  = new RegExp(`(${palavras.map(p=>p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})`, ‘g’);
const tokens = linha.split(regex).filter(t=>t);
let cx = x;
for (const tok of tokens) {
const dest = palavras.includes(tok);
doc.setFont(‘helvetica’, dest?‘bold’:‘normal’);
doc.setFontSize(dest?7.5:6.8);
doc.setTextColor(15,15,15);
doc.text(tok,cx,baseY);
cx+=doc.getTextWidth(tok);
}
doc.setFont(‘helvetica’,‘normal’); doc.setFontSize(6.8);
}

cabecalho();
secTit(‘Cavalo Mecanico’);
subTit(‘Lubrificacao’);     grpRender(‘lub’);
subTit(‘Motor’);            grpRender(‘motor’);
subTit(‘Eletrica’);         grpRender(‘eletrica’);
subTit(‘Freio’);            grpRender(‘freio_cav’);
subTit(‘Cabine’);           grpRender(‘cabine’);
subTit(‘Chassi’);           grpRender(‘chassi_cav’);
subTit(‘Emissao de Gases’); grpRender(‘gases’);
secTit(‘Semi-Reboque’);
subTit(‘Freio’);                  grpRender(‘freio_sr’);
subTit(‘Outros’);                 grpRender(‘outros’);
subTit(‘Chassi’);                 grpRender(‘chassi_sr’);
subTit(‘Suspensao’);              grpRender(‘suspensao’);
subTit(‘Compartimento de Carga’); grpRender(‘carga’);
if (pag===1) novaPag();
y+=6;
observacoes();
assinaturas();
rodapeFinal();
fecharModal();

const placas = [gv(‘placa_cavalo’),gv(‘placa_sr1’),gv(‘placa_sr2’)];
const nome   = (placas.find(p=>p.trim())||‘SEM_PLACA’).replace(/-/g,’’);
const data   = gv(‘data’).replace(/-/g,’’)||‘SDATA’;
const blob   = doc.output(‘blob’);
const url    = URL.createObjectURL(blob);
const win    = window.open(url,’_blank’);
if (win) win.addEventListener(‘load’,()=>{ win.focus(); win.print(); });
doc.save(`Checklist_${nome}_${data}.pdf`);
}