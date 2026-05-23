/* ══════════════════════════════════════════════════════
   LOGIN
   ══════════════════════════════════════════════════════ */
(function verificarSessao() {
  if (sessionStorage.getItem('jce_auth') === '1') {
    const o = document.getElementById('login-overlay');
    if (o) o.style.display = 'none';
  }
})();

function tentarLogin() {
  const user = (document.getElementById('login-user')?.value || '').trim();
  const pass = (document.getElementById('login-pass')?.value || '').trim();
  const erro = document.getElementById('login-erro');
  if (user === 'jce.adminis' && pass === 'adminis') {
    sessionStorage.setItem('jce_auth', '1');
    const o = document.getElementById('login-overlay');
    o.classList.add('sair');
    setTimeout(() => { o.style.display = 'none'; }, 520);
  } else {
    erro.textContent = 'Usuário ou senha incorretos.';
    document.getElementById('login-pass').value = '';
    document.getElementById('login-pass').focus();
    setTimeout(() => { erro.textContent = ''; }, 3000);
  }
}

/* ══════════════════════════════════════════════════════
   DADOS
   ══════════════════════════════════════════════════════ */
const MESES    = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
const ANO_BASE = new Date().getFullYear();
const DESTAQUE = ['CAVALO','CARRETA 1','CARRETA 2','CARRETA'];

const ITENS = {
  lub: [
    [1,  'Óleo de Motor (examinar nível)'],
    [2,  'Óleo Direção Hidráulica (examinar nível)'],
    [3,  'Fluido de Arrefecimento (examinar nível)']
  ],
  motor: [
    [4,  'Ausência de Vazamentos de Óleo'],
    [5,  'Ruído do Motor'],
    [6,  'Correias']
  ],
  eletrica: [
    [7,  'Farois / Lanternas / Lampadas / Sinalizações']
  ],
  freio_cav: [
    [8,  'Verificar Lonas'],
    [9,  'Verificar Cubos e Rolamentos']
  ],
  cabine: [
    [10, 'Tacógrafo e Computador de Bordo em Perfeito Estado de Funcionamento'],
    [11, 'Adesivo de Tara e Lotação'],
    [12, 'Para-brisa sem Trincas / Limpadores / esguicho de água'],
    [13, { type:'mes', label:'Extintor' }]
  ],
  chassi_cav: [
    [14, 'Longarinas e Travessas (verificar corrosão / trinca / torção / amassado)'],
    [15, 'Para-choque (amassado / Pintura)'],
    [16, 'Placa (Lacre / Iluminação / Pintura)'],
    [17, 'Suporte dos Grampos (verificar: grampos/porcas/feixe de molas/batentes e suportes)'],
    [18, 'Para-Lama / Para-barro (verificar)'],
    [19, 'Quinta-Roda e Gavião (examinar folga) Pino Rei'],
    [20, 'Pneus (avaliar acima de 2,5 mm +/- 0,5 mm) inclusive estepe - aperto de parafusos das rodas'],
    [21, 'Alinhamento e Balanceamento'],
    [22, 'Tanques de combustível sem vazamentos e suporte do tanque'],
    [23, 'Defletor de ar'],
    [24, 'Estofados, capas, cortinas, carpetes e tapetes']
  ],
  gases: [
    [25, 'Verificação opacidade']
  ],
  freio_sr: [
    [26, 'Verificar Lonas'],
    [27, 'Verificar Cubos e Rolamentos']
  ],
  outros: [
    [28, 'Válvulas'],
    [29, 'Acoplamentos'],
    [30, 'Gaxetas / Selos'],
    [31, 'Mangotes e Medidores'],
    [32, 'Unidades de Controle de Temperaturas'],
    [33, 'Equipamentos de Segurança'],
    [34, 'Placas de simbologia'],
    [35, 'Válvulas de Alívio'],
    [36, 'Óleo do Compressor (verificar)'],
    [37, 'Filtro do Compressor (verificar estado)'],
    [38, 'Compressor (Fazer Teste)'],
    [39, 'Motor da Glucose e seus Componentes (Fazer Teste)'],
    [40, 'Bomba Descarga (Fazer Teste)'],
    [41, 'Verificar Parte Elétrica (cabos e caixa elétrica)'],
    [42, { type:'multi_qty', labels:['Cintas','Catracas','Cantoneiras','Réguas'] }],
    [43, 'Lonas laterais, teto e cabo de aço'],
    [44, { type:'mes', label:'Extintor' }]
  ],
  chassi_sr: [
    [45, 'Longarinas e Travessas (verificar corrosão / trinca / torção / amassado)'],
    [46, 'Para-choque (amassado / Pintura)'],
    [47, 'Placa (Lacre / Iluminação / Pintura)'],
    [48, 'Suporte dos Grampos (verificar: grampos/porcas/feixe de molas/batentes e suportes)'],
    [49, 'Para-Lama / Para-barro (verificar)'],
    [50, 'Quinta-Roda (examinar folga)'],
    [51, 'Pneus (avaliar acima de 2,5 mm +/- 0,5 mm) inclusive estepe'],
    [52, 'Reaperto de Parafusos de Rodas'],
    [53, 'Reaperto Rala'],
    [54, 'Reaperto Pistão'],
    [55, 'Reaperto Pés e Conexões'],
    [56, 'Alinhamento e Balanceamento']
  ],
  suspensao: [
    [57, 'Molas, Pinos e Estirantes']
  ],
  carga: [
    [58, 'Lonas de Forração, Cordas, Madeirite e travas (uso somente para baú)']
  ]
};

const MAP = {
  b_lub:'lub', b_motor:'motor', b_eletrica:'eletrica',
  b_freio_cav:'freio_cav', b_cabine:'cabine', b_chassi_cav:'chassi_cav',
  b_gases:'gases', b_freio_sr:'freio_sr', b_outros:'outros',
  b_chassi_sr:'chassi_sr', b_suspensao:'suspensao', b_carga:'carga'
};

const GRP_CAV = ['lub','motor','eletrica','freio_cav','cabine','chassi_cav','gases'];
const GRP_SR  = ['freio_sr','outros','chassi_sr','suspensao','carga'];

const nokCarreta = {};

/* ══════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════ */
function desc(d)   { return typeof d === 'object' ? (d.type === 'multi_qty' ? d.labels.join(' / ') : d.label) : d; }
function isExt(d)  { return typeof d === 'object' && d.type === 'mes' && d.label === 'Extintor'; }
function isSR(grp) { return GRP_SR.includes(grp); }
function gv(id)    { return (document.getElementById(id) || {}).value || ''; }
function gc(id)    { return !!document.getElementById(id)?.checked; }
function itemDe(n) {
  for (const g of Object.keys(ITENS))
    for (const [num, d] of ITENS[g]) if (num === n) return d;
  return '';
}

/* ══════════════════════════════════════════════════════
   RENDERIZAÇÃO DOS ITENS
   ══════════════════════════════════════════════════════ */
(function renderizar() {
  for (const [bid, grp] of Object.entries(MAP)) {
    const tb = document.getElementById(bid);
    if (!tb) continue;
    ITENS[grp].forEach(([n, d]) => {
      const obj = typeof d === 'object';
      let celula = '';

      if (obj && d.type === 'multi_qty') {
        let ops = '<option value="">—</option>';
        for (let i = 1; i <= 50; i++) ops += `<option value="${i}">${i}</option>`;
        celula = `<div class="qty-linha">${
          d.labels.map((lbl, idx) =>
            `<span class="qty-item">${lbl}:<select id="i${n}_q${idx}" class="sel">${ops}</select></span>`
          ).join('')
        }</div>`;
      } else if (obj && d.type === 'mes') {
        let ops = '<option value="">—</option>';
        for (let a = ANO_BASE; a <= ANO_BASE + 5; a++)
          MESES.forEach(m => { ops += `<option value="${m}/${a}">${m}/${a}</option>`; });
        celula = `${d.label}<span class="extra-bloco"><select id="i${n}_mes" class="sel">${ops}</select></span>`;
      } else {
        celula = String(d);
      }

      const tr = document.createElement('tr');
      tr.dataset.n   = n;
      tr.dataset.grp = grp;
      tr.innerHTML = `
        <td>${n}</td>
        <td>${celula}</td>
        <td><div class="chk-grupo">
          <label class="chk-op"><input type="checkbox" id="i${n}_ok"> OK</label>
          <label class="chk-op"><input type="checkbox" id="i${n}_nok" class="nok-chk"> NOK</label>
          <label class="chk-op"><input type="checkbox" id="i${n}_na"> NA</label>
        </div></td>`;
      tb.appendChild(tr);

      document.getElementById(`i${n}_ok` ).addEventListener('change', () => aoMarcar(n, grp));
      document.getElementById(`i${n}_nok`).addEventListener('change', () => aoMarcar(n, grp));
      document.getElementById(`i${n}_na` ).addEventListener('change', () => aoMarcar(n, grp));
    });
  }
})();

/* ══════════════════════════════════════════════════════
   POPUP CARRETA (callback, sem async/await)
   ══════════════════════════════════════════════════════ */
let _cbCarreta = null;

function pedirCarreta(descricao, cb) {
  _cbCarreta = cb;
  document.getElementById('popup-desc').textContent = descricao;
  document.getElementById('popup-carreta').classList.add('aberto');
}
function resolverCarreta(op) {
  document.getElementById('popup-carreta').classList.remove('aberto');
  if (_cbCarreta) { const cb = _cbCarreta; _cbCarreta = null; cb(op); }
}
function cancelarCarreta() {
  document.getElementById('popup-carreta').classList.remove('aberto');
  if (_cbCarreta) { const cb = _cbCarreta; _cbCarreta = null; cb(null); }
}

/* ══════════════════════════════════════════════════════
   AO MARCAR CHECKBOX
   ══════════════════════════════════════════════════════ */
function aoMarcar(n, grp) {
  const nok = !!document.getElementById(`i${n}_nok`)?.checked;
  const rt  = gc('tipo_rodotrem');
  const tr  = document.querySelector(`tr[data-n="${n}"]`);

  if (tr) tr.classList.toggle('nok', nok);

  if (nok && rt && isSR(grp)) {
    pedirCarreta(desc(itemDe(n)), function(op) {
      if (op) {
        nokCarreta[n] = op;
      } else {
        document.getElementById(`i${n}_nok`).checked = false;
        if (tr) tr.classList.remove('nok');
        delete nokCarreta[n];
      }
      atualizarObs();
    });
    return;
  }

  if (!nok) delete nokCarreta[n];
  atualizarObs();
}

/* ══════════════════════════════════════════════════════
   ESTADO DOS CHECKBOXES E EXTRAS
   ══════════════════════════════════════════════════════ */
function checks(n) {
  const v = [];
  if (document.getElementById(`i${n}_ok`)?.checked)  v.push('OK');
  if (document.getElementById(`i${n}_nok`)?.checked) v.push('NOK');
  if (document.getElementById(`i${n}_na`)?.checked)  v.push('NA');
  return v;
}

function extraSite(n, d) {
  if (typeof d !== 'object') return '';
  if (d.type === 'mes') return document.getElementById(`i${n}_mes`)?.value || '';
  if (d.type === 'multi_qty') {
    return d.labels.map((lbl, i) => {
      const v = document.getElementById(`i${n}_q${i}`)?.value;
      return v ? `${lbl}: ${v}` : null;
    }).filter(Boolean).join('  ');
  }
  return '';
}

function extraPDF(n, d) {
  if (typeof d !== 'object') return '';
  if (d.type === 'mes') return document.getElementById(`i${n}_mes`)?.value || '';
  if (d.type === 'multi_qty') {
    return d.labels.map((lbl, i) => {
      const v = document.getElementById(`i${n}_q${i}`)?.value;
      return v ? `Qtd. ${lbl}: ${v}` : null;
    }).filter(Boolean).join('  ');
  }
  return '';
}

/* ══════════════════════════════════════════════════════
   OBSERVAÇÕES AUTOMÁTICAS (NOK)
   ══════════════════════════════════════════════════════ */
const SEP = '\u200B';

function coletarNOK(grupos, filtro) {
  const linhas = [];
  for (const grp of grupos) {
    (ITENS[grp] || []).forEach(([n, d]) => {
      if (!document.getElementById(`i${n}_nok`)?.checked) return;
      if (filtro !== undefined) {
        const atr = nokCarreta[n];
        if (atr !== filtro && atr !== 'AMBAS') return;
      }
      let txt = desc(d).toUpperCase();
      const ex = extraSite(n, d);
      if (ex) txt += ' ' + ex.toUpperCase();
      txt += ' NOK';
      linhas.push(`${n}. ${txt}`);
    });
  }
  return linhas;
}

function atualizarObs() {
  const rt = gc('tipo_rodotrem');
  const nokCav = coletarNOK(GRP_CAV, undefined);
  let auto = '';
  if (nokCav.length) auto += 'CAVALO\n' + nokCav.join('\n') + '\n\n';

  if (rt) {
    const n1 = coletarNOK(GRP_SR, 'CARRETA 1');
    const n2 = coletarNOK(GRP_SR, 'CARRETA 2');
    if (n1.length) auto += 'CARRETA 1\n' + n1.join('\n') + '\n\n';
    if (n2.length) auto += 'CARRETA 2\n' + n2.join('\n') + '\n\n';
  } else {
    const nSR = coletarNOK(GRP_SR, undefined);
    if (nSR.length) auto += 'CARRETA\n' + nSR.join('\n') + '\n\n';
  }

  const el     = document.getElementById('observacoes');
  const atual  = el.value;
  const manual = atual.includes(SEP) ? atual.split(SEP)[0].trimEnd() : atual.trimEnd();
  el.value = (manual ? manual + '\n\n' : '') + (auto.trim() ? SEP + auto.trimEnd() : '');
  if (el.value.startsWith('\n')) el.value = el.value.trimStart();
}

/* ══════════════════════════════════════════════════════
   FORMATAÇÃO DE CAMPOS
   ══════════════════════════════════════════════════════ */
function fmtKM(el) {
  const v = el.value.replace(/\D/g, '');
  el.value = v ? parseInt(v, 10).toLocaleString('pt-BR') : '';
}

function fmtPlaca(el) {
  const raw = el.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
  el.value  = raw.length > 3 ? raw.slice(0, 3) + '-' + raw.slice(3) : raw;
}

window.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('data');
  if (el && !el.value) el.value = new Date().toISOString().split('T')[0];
});

/* ══════════════════════════════════════════════════════
   CANVAS DE ASSINATURA
   ══════════════════════════════════════════════════════ */
const DPR = Math.min(window.devicePixelRatio || 1, 3);
const SW  = Math.round(500 * DPR);
const SH  = Math.round(150 * DPR);

function initCanvas(id) {
  const c   = document.getElementById(id);
  c.width   = SW; c.height = SH;
  const ctx = c.getContext('2d');
  ctx.fillStyle   = '#ffffff'; ctx.fillRect(0, 0, SW, SH);
  ctx.lineWidth   = 2.5 * DPR;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  ctx.strokeStyle = '#0a0a0a';
  let dr = false;
  const pt = e => {
    const r = c.getBoundingClientRect(), s = e.touches ? e.touches[0] : e;
    return { x: (s.clientX - r.left) * (SW / r.width), y: (s.clientY - r.top) * (SH / r.height) };
  };
  const ini  = e => { dr = true; const p = pt(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const mover= e => { if (!dr) return; const p = pt(e); ctx.lineTo(p.x, p.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const fim  = () => dr = false;
  c.addEventListener('mousedown',  ini);
  c.addEventListener('mousemove',  mover);
  c.addEventListener('mouseup',    fim);
  c.addEventListener('mouseleave', fim);
  c.addEventListener('touchstart', e => { e.preventDefault(); ini(e); },  { passive: false });
  c.addEventListener('touchmove',  e => { e.preventDefault(); mover(e); }, { passive: false });
  c.addEventListener('touchend',   fim);
}
initCanvas('canvas_conf');
initCanvas('canvas_mot');

function limparCanvas(id) {
  const c = document.getElementById(id), ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, c.width, c.height);
}

function temTraco(id) {
  const d = document.getElementById(id).getContext('2d').getImageData(0, 0, SW, SH).data;
  for (let i = 0; i < d.length; i += 4) if (d[i] < 200 && d[i+1] < 200 && d[i+2] < 200) return true;
  return false;
}

/* ══════════════════════════════════════════════════════
   MODAL DE ASSINATURAS
   ══════════════════════════════════════════════════════ */
let etapa = 1;

function abrirModal()  { etapa = 1; sincEtapa(); document.getElementById('modal-bg').classList.add('aberto'); }
function fecharModal() { document.getElementById('modal-bg').classList.remove('aberto'); }
function irEtapa(n)    { etapa = n; sincEtapa(); }

function sincEtapa() {
  [1, 2, 3].forEach(i => {
    document.getElementById(`etapa${i}`).style.display = i === etapa ? '' : 'none';
  });
  [1, 2, 3].forEach(i => {
    const dot = document.getElementById(`dot${i}`);
    const lbl = document.getElementById(`lbl${i}`);
    dot.classList.remove('active','feito');
    lbl.classList.remove('ativo','feito');
    if (i < etapa)       { dot.classList.add('feito');  lbl.classList.add('feito'); }
    else if (i === etapa){ dot.classList.add('active'); lbl.classList.add('ativo'); }
  });
  [1, 2].forEach(i => {
    document.getElementById(`bar${i}`).classList.toggle('feito', i < etapa);
  });
  if (etapa === 3) {
    document.getElementById('prev_conf').src = document.getElementById('canvas_conf').toDataURL('image/png');
    document.getElementById('prev_mot').src  = document.getElementById('canvas_mot').toDataURL('image/png');
  }
}

document.getElementById('modal-bg').addEventListener('click', function(e) {
  if (e.target === this) fecharModal();
});

/* ══════════════════════════════════════════════════════
   GERAÇÃO DO PDF
   ══════════════════════════════════════════════════════ */
function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const W = 210, ML = 12, cW = 186;
  const ROD_Y = 278, ROD_H = 10, SIG_TOTAL = 32;
  const SIG_Y = ROD_Y - SIG_TOTAL - 3;
  let y = 0, pag = 1;
  const AZUL = [26,26,46], CZ = [228,232,242], CZS = [210,218,236];

  function cabecalho() {
    y = 0;
    doc.setFillColor(255,255,255); doc.rect(0,0,W,15,'F');
    doc.setDrawColor(200); doc.setLineWidth(.3); doc.line(0,15,W,15);
    doc.setFontSize(11); doc.setFont('helvetica','bold'); doc.setTextColor(20,20,20);
    doc.text('CHECK LIST DE MANUTENCAO PREVENTIVA', ML+2, 9.5);
    try {
      const lg = document.getElementById('logo-pdf');
      if (lg && lg.complete) doc.addImage(lg,'PNG',W-ML-30,0.5,30,14);
    } catch(_) {}
    y = 17;
    doc.setLineWidth(.25); doc.setDrawColor(160);
    doc.rect(ML,y,cW,6);
    const c1=[28,18,26,cW-72]; let x=ML;
    doc.setFontSize(6.2); doc.setFont('helvetica','bold'); doc.setTextColor(50,50,50);
    ['DATA','REVISAO','PAGINA','DEPARTAMENTO'].forEach((h,i)=>{
      doc.text(h,x+1,y+2.2); x+=c1[i]; if(i<3) doc.line(x,y,x,y+6);
    });
    x=ML; doc.setFont('helvetica','normal'); doc.setTextColor(15,15,15);
    [gv('data'),gv('revisao')||'00','1 de 2',gv('departamento')||'Frota / Manutencao'].forEach((v,i)=>{
      doc.text(v,x+1,y+4.8); x+=c1[i];
    });
    y+=6.5;
    doc.rect(ML,y,cW,6);
    doc.setFont('helvetica','bold'); doc.setFontSize(6.2); doc.setTextColor(50,50,50);
    doc.text('TIPO',ML+1,y+2.2); doc.setFont('helvetica','normal');
    const cv=gc('tipo_cavalo'),sd=gc('tipo_sider'),rt=gc('tipo_rodotrem');
    doc.text(`(${cv?'X':' '}) CAVALO  (${sd?'X':' '}) SIDER  (${rt?'X':' '}) RODOTREM`,ML+11,y+2.2);
    const dx=ML+cW/2-8;
    doc.setFont('helvetica','bold'); doc.text('DATA',dx,y+2.2);
    doc.setFont('helvetica','normal'); doc.text(gv('data'),dx+9,y+2.2);
    doc.setFont('helvetica','bold'); doc.text('KM',ML+cW-22,y+2.2);
    doc.setFont('helvetica','normal'); doc.text(gv('km'),ML+cW-16,y+2.2);
    y+=6.5;
    doc.rect(ML,y,cW,6);
    [cW*.44,cW*.63,cW*.81].forEach(p=>doc.line(ML+p,y,ML+p,y+6));
    doc.setFont('helvetica','bold'); doc.setFontSize(6.2);
    doc.text('NOME MOTORISTA',ML+1,y+2.2);
    doc.text('PLACA CAVALO',ML+cW*.44+1,y+2.2);
    doc.text('PLACA SR1',ML+cW*.63+1,y+2.2);
    doc.text('PLACA SR2',ML+cW*.81+1,y+2.2);
    doc.setFont('helvetica','normal');
    doc.text(gv('motorista'),ML+1,y+4.8);
    doc.text(gv('placa_cavalo'),ML+cW*.44+1,y+4.8);
    doc.text(gv('placa_sr1'),ML+cW*.63+1,y+4.8);
    doc.text(gv('placa_sr2'),ML+cW*.81+1,y+4.8);
    y+=8;
  }

  function novaPag() { doc.addPage(); pag++; y=8; }
  function chk(esp) {
    esp = esp||14;
    if (pag===1 && y>297-esp) { novaPag(); return; }
    if (pag>=2  && y>SIG_Y-esp) novaPag();
  }

  function secTit(t) {
    chk(16);
    doc.setFillColor(...AZUL); doc.rect(ML,y,cW,4.8,'F');
    doc.setFontSize(6.8); doc.setFont('helvetica','bold'); doc.setTextColor(255,255,255);
    doc.text(t.toUpperCase(),ML+2.5,y+3.3); y+=5.5;
  }

  function subTit(t) {
    chk(12);
    doc.setFillColor(...CZS); doc.rect(ML,y,cW,3.8,'F');
    doc.setFontSize(6.2); doc.setFont('helvetica','bold'); doc.setTextColor(...AZUL);
    doc.text(t.toUpperCase(),ML+2.5,y+2.7); y+=4.4;
  }

  function iRow(n, d, par) {
    chk(10);
    const rh  = 4.0;
    const tx  = desc(d);
    const ex  = extraPDF(n,d);
    const nok = checks(n).includes('NOK');
    const ext = isExt(d);
    if (par) { doc.setFillColor(248,249,253); doc.rect(ML,y,cW,rh,'F'); }
    doc.setLineWidth(.13); doc.setDrawColor(200);
    doc.rect(ML,y,cW,rh);
    doc.line(ML+9,y,ML+9,y+rh);
    doc.line(ML+cW-50,y,ML+cW-50,y+rh);
    doc.setFontSize(5.8); doc.setFont('helvetica','bold'); doc.setTextColor(140,140,140);
    doc.text(String(n),ML+4.5,y+2.7,{align:'center'});
    doc.setFont('helvetica','normal'); doc.setTextColor(15,15,15);
    let linha = tx;
    if (ex)        linha += '  '+ex;
    if (nok)       linha += ' NOK';
    if (nok&&ext)  linha += ' - TROCAR';
    doc.text(doc.splitTextToSize(linha,cW-62),ML+10.5,y+2.7);
    const ck=checks(n);
    doc.setFontSize(5.5); doc.setTextColor(15,15,15);
    doc.text(`(${ck.includes('OK')?'X':' '}) OK  (${ck.includes('NOK')?'X':' '}) NOK  (${ck.includes('NA')?'X':' '}) NA`,ML+cW-49,y+2.7);
    y+=rh;
  }

  function grupo(k) { ITENS[k].forEach(([n,d],i)=>iRow(n,d,i%2===1)); }

  function rodape() {
    doc.setPage(2);
    doc.setFillColor(...CZ); doc.rect(ML,ROD_Y,cW,ROD_H/2,'F');
    doc.setLineWidth(.2); doc.setDrawColor(145); doc.rect(ML,ROD_Y,cW,ROD_H/2);
    const cs=[28,18,48,48,cW-142]; let rx=ML;
    doc.setFontSize(5.8); doc.setFont('helvetica','bold'); doc.setTextColor(40,40,80);
    ['DATA','REVISAO','ELABORADO POR','APROVADO POR','PAGINA'].forEach((h,i)=>{
      doc.text(h,rx+1,ROD_Y+3); rx+=cs[i]; if(i<4) doc.line(rx,ROD_Y,rx,ROD_Y+ROD_H/2);
    });
    rx=ML; doc.rect(ML,ROD_Y+ROD_H/2,cW,ROD_H/2);
    const ap=gv('aprovado')||'Andre Cruz';
    [gv('data'),'00',ap,ap,'2 de 2'].forEach((v,i)=>{
      doc.setFont('helvetica','normal'); doc.setFontSize(5.8); doc.setTextColor(15);
      doc.text(v,rx+1,ROD_Y+ROD_H/2+3.5); rx+=cs[i];
    });
  }

  function assinaturas() {
    doc.setPage(2);
    const bW=(cW-8)/2;
    doc.setFillColor(...CZS); doc.rect(ML,SIG_Y,cW,4,'F');
    doc.setFontSize(6.5); doc.setFont('helvetica','bold'); doc.setTextColor(...AZUL);
    doc.text('ASSINATURAS',ML+2.5,SIG_Y+2.8);
    const bY=SIG_Y+5, bH=SIG_TOTAL-9;
    doc.setFillColor(255,255,255); doc.setDrawColor(160); doc.setLineWidth(.2);
    doc.rect(ML,bY,bW,bH); doc.rect(ML+bW+8,bY,bW,bH);
    const iH=bH-10;
    if (temTraco('canvas_conf'))
      doc.addImage(document.getElementById('canvas_conf').toDataURL('image/png'),'PNG',ML+2,bY+1,bW-4,iH);
    if (temTraco('canvas_mot'))
      doc.addImage(document.getElementById('canvas_mot').toDataURL('image/png'),'PNG',ML+bW+10,bY+1,bW-4,iH);
    doc.setDrawColor(100); doc.setLineWidth(.3);
    doc.line(ML+2,bY+bH-7,ML+bW-2,bY+bH-7);
    doc.line(ML+bW+10,bY+bH-7,ML+cW-2,bY+bH-7);
    doc.setFontSize(6.2); doc.setFont('helvetica','normal'); doc.setTextColor(55,55,55);
    doc.text('Conferente / Vistoriador',ML+2,bY+bH-4.5);
    doc.text('Nome: '+gv('vistoriador'),ML+2,bY+bH-1.5);
    doc.text('Motorista',ML+bW+10,bY+bH-4.5);
    doc.text('Nome: '+gv('motorista'),ML+bW+10,bY+bH-1.5);
  }

  function observacoes() {
    if (pag===1) novaPag();
    doc.setFontSize(6.8); doc.setFont('helvetica','bold'); doc.setTextColor(15,15,15);
    doc.text('Observacoes:',ML,y); y+=4;
    const oTop=y, oH=Math.max(10,SIG_Y-4-oTop);
    doc.setFillColor(255,255,255); doc.setDrawColor(170); doc.setLineWidth(.2);
    doc.rect(ML,oTop,cW,oH);
    for (let i=1;i*4<oH-2;i++) { doc.setDrawColor(220); doc.line(ML+2,oTop+i*4,ML+cW-2,oTop+i*4); }
    const rawObs=gv('observacoes').replace(new RegExp(SEP,'g'),'').toUpperCase().trim();
    if (rawObs) {
      const linhas  = doc.splitTextToSize(rawObs,cW-6);
      const palavras = [...DESTAQUE].sort((a,b)=>b.length-a.length);
      let ty=oTop+4;
      for (const ln of linhas) {
        if (ty>oTop+oH-3) break;
        renderObs(ln,ML+3,ty,palavras); ty+=4;
      }
    }
  }

  function renderObs(linha,x,baseY,palavras) {
    const re  = new RegExp(`(${palavras.map(p=>p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})`, 'g');
    const tok = linha.split(re).filter(t=>t);
    let cx=x;
    for (const t of tok) {
      const dest=palavras.includes(t);
      doc.setFont('helvetica',dest?'bold':'normal');
      doc.setFontSize(dest?7.5:6.8);
      doc.setTextColor(15,15,15);
      doc.text(t,cx,baseY);
      cx+=doc.getTextWidth(t);
    }
    doc.setFont('helvetica','normal'); doc.setFontSize(6.8);
  }

  cabecalho();
  secTit('Cavalo Mecanico');
  subTit('Lubrificacao');     grupo('lub');
  subTit('Motor');            grupo('motor');
  subTit('Eletrica');         grupo('eletrica');
  subTit('Freio');            grupo('freio_cav');
  subTit('Cabine');           grupo('cabine');
  subTit('Chassi');           grupo('chassi_cav');
  subTit('Emissao de Gases'); grupo('gases');
  secTit('Semi-Reboque');
  subTit('Freio');                  grupo('freio_sr');
  subTit('Outros');                 grupo('outros');
  subTit('Chassi');                 grupo('chassi_sr');
  subTit('Suspensao');              grupo('suspensao');
  subTit('Compartimento de Carga'); grupo('carga');

  if (pag===1) novaPag();
  y+=6;
  observacoes();
  assinaturas();
  rodape();
  fecharModal();

  const placas = [gv('placa_cavalo'),gv('placa_sr1'),gv('placa_sr2')];
  const placa  = (placas.find(p=>p.trim())||'SEM_PLACA').replace(/-/g,'');
  const data   = gv('data').replace(/-/g,'')||'SDATA';
  const nome   = `Checklist_${placa}_${data}.pdf`;
  const blob   = doc.output('blob');
  const url    = URL.createObjectURL(blob);
  const win    = window.open(url,'_blank');
  if (win) win.addEventListener('load',()=>{ win.focus(); win.print(); });
  doc.save(nome);
}
