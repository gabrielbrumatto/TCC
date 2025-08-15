// Utilidades rápidas
const $ = (sel)=>document.querySelector(sel);
const $$ = (sel)=>Array.from(document.querySelectorAll(sel));

const terminal = $('#terminal');
const processingBox = $('#processing');
const result = $('#result');
const form = $('#form');
const collapseSwitch = $('#collapseSwitch');

collapseSwitch.addEventListener('change', ()=>{
  document.body.classList.toggle('collapse', collapseSwitch.checked);
});

// Pools de dados (não sensíveis)
const ARCHETYPES = [
  'Navegador de Tendências Latentes',
  'Curador de Micro‑novidades',
  'Otimizador de Rotinas Cotidianas',
  'Explorador de Memes Obsoletos',
  'Colecionador de Abas Eternas',
  'Cartógrafo de Feeds Infinitos',
  'Apreciador de Interfaces Minimalistas',
  'Acumulador de Tutoriais Inacabados',
  'Observador de Fenômenos Virais Lentos',
  'Desbravador de Recomendações Estranhas'
];

const QUIRKS = [
  'abre muitas abas e fecha poucas',
  'clica em “ver depois” e esquece para sempre',
  'prefere 1.25× de velocidade em vídeos',
  'tem quatro listas de tarefas concorrentes',
  'usa modo escuro até ao ar livre',
  'mantém notificações quase sempre silenciadas',
  'não confia em avaliações 5★ perfeitas',
  'recarrega a página em vez de procurar o botão',
  'coleciona apps de produtividade',
  'acompanha trends com duas semanas de atraso'
];

const INTERESTS = [
  'arquitetura brutalista', 'música ambiente', 'fotografia analógica', 'cultura de memes',
  'ficção científica lenta', 'arte generativa', 'tipografia', 'xadrez online',
  'jogos indie', 'documentários', 'design de interação', 'sound design'
];

const TAGS = [
  'latência baixa', 'otimista cauteloso', 'feed-curioso', 'glitch-friendly',
  'noctívago digital', 'offline às vezes', 'anti-spam', 'pro‑privacidade'
];

const RECS = [
  'Assinar uma newsletter que você não vai ler',
  'Reorganizar seus ícones pela quinta vez',
  'Desativar 3 notificações que não fazem falta',
  'Rever um tutorial salvo há 11 meses',
  'Reavaliar senhas com um gerenciador',
  'Silenciar palavras‑gatilho no seu app favorito',
  'Experimentar um dia inteiro desconectado',
  'Voltar para lista de leitura… de 2022'
];

// Helpers
const rand = (n)=>Math.floor(Math.random()*n);
const sample = (arr)=>arr[rand(arr.length)];
const shuffle = (arr)=>arr.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(a=>a[1]);
const pickMany = (arr, k)=>shuffle([...arr]).slice(0, k);

function leetify(name){
  return name
    .normalize('NFD').replace(/\p{Diacritic}/gu,'')
    .replace(/a/gi,'4').replace(/e/gi,'3').replace(/i/gi,'1')
    .replace(/o/gi,'0').replace(/s/gi,'5').replace(/t/gi,'7');
}

function distortName(name){
  const suffixes = ['_v2','_beta','_0x'+rand(256).toString(16).padStart(2,'0'),'‑AI','‑proto'];
  return leetify(name.trim()).replace(/\s+/g,'_') + sample(suffixes);
}

function estimateAge(real){
  const bias = rand(2) ? 5 + rand(18) : -(3 + rand(14));
  const est = Math.max(10, Math.min(99, Number(real) + bias));
  const conf = Math.max(12, Math.min(96, 40 + rand(55)));
  return {est, conf};
}

function makeTags(visibility){
  return [visibility, sample(TAGS), sample(TAGS), sample(ARCHETYPES)];
}

function makeProfile(){
  const quirks = pickMany(QUIRKS, 3);
  const inter = pickMany(INTERESTS, 3);
  return [
    `Padrão de navegação: ${quirks[0]}.`,
    `Preferências declaradas vs. inferidas: ${inter[0]} ≠ ${inter[1]}.`,
    `Sinais de atenção: ${quirks[1]}, com picos semanais.`,
    `Traço comportamental: ${quirks[2]} (dados escassos).`,
    `Tema recorrente: ${inter[2]} (alvo de recomendações).`
  ];
}

function makeRecs(){
  return pickMany(RECS, 4);
}

// Terminal fake
const LINES = [
  'Coletando vestígios públicos…',
  'Agregando sinais fracos…',
  'Comparando com 1.4 trilhões de perfis…',
  'Calculando índice de colapso real‑digital…',
  'Gerando versão estável da sua identidade…',
  'Aplicando filtros estéticos…',
  'Pronto.'
];

function writeTerminal(lines, cb){
  terminal.innerHTML = '';
  processingBox.classList.add('active');
  let i = 0;
  const tick = ()=>{
    if(i < lines.length){
      const div = document.createElement('div');
      div.className = 'line';
      div.textContent = `> ${lines[i]}`;
      terminal.appendChild(div);
      terminal.scrollTop = terminal.scrollHeight;
      i++;
      setTimeout(tick, 400 + rand(400));
    }else{
      const caret = document.createElement('span');
      caret.className = 'caret';
      terminal.appendChild(caret);
      setTimeout(cb, 500);
    }
  };
  tick();
}

// Avatar preview
const avatarInput = $('#avatar');
const avatarPreview = $('#avatarPreview');
avatarInput.addEventListener('change', () => {
  const file = avatarInput.files?.[0];
  if(!file){ avatarPreview.removeAttribute('src'); return; }
  const reader = new FileReader();
  reader.onload = (e)=>{ avatarPreview.src = String(e.target.result); };
  reader.readAsDataURL(file);
});

// Render de resultado
function renderResult(data){
  $('#nomeDistorcido').textContent = data.nomeDistorcido;
  $('#idadeReal').textContent = `${data.idade} anos`;
  $('#idadeAlg').textContent = `${data.estimada.est} anos`;
  $('#confBar').style.width = `${data.estimada.conf}%`;

  // tags
  const tags = $('#tags');
  tags.innerHTML = '';
  data.tags.forEach(t=>{
    const el = document.createElement('span');
    el.className = 'pill';
    el.textContent = t;
    tags.appendChild(el);
  });

  // perfil
  const perfil = $('#perfil');
  perfil.innerHTML = '';
  data.perfil.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    perfil.appendChild(li);
  });

  // recs
  const recs = $('#recs');
  recs.innerHTML = '';
  data.recs.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    recs.appendChild(li);
  });

  processingBox.classList.remove('active');
  result.classList.add('active');
}

function compute(name, idade, vis){
  const nomeDistorcido = distortName(name);
  const estimada = estimateAge(idade);
  const tags = makeTags(vis);
  const perfil = makeProfile();
  const recs = makeRecs();
  return { nomeDistorcido, idade, estimada, tags, perfil, recs };
}

function runAnalysis(){
  result.classList.remove('active');
  processingBox.classList.add('active');
  writeTerminal(LINES, () => {
    const name = $('#nome').value || 'Visitante';
    const idade = Number($('#idade').value) || 18;
    const vis = $('#visibilidade').value;
    const data = compute(name, idade, vis);
    renderResult(data);
  });
}

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  runAnalysis();
});

$('#again').addEventListener('click', ()=>{
  // reprocessa com mesmos inputs
  runAnalysis();
});

$('#reset').addEventListener('click', ()=>{
  result.classList.remove('active');
  terminal.innerHTML = '';
  processingBox.classList.remove('active');
  form.reset();
  avatarPreview.removeAttribute('src');
  $('#nome').focus();
});
