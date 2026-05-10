#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const SYSTEMS = new Set([
  'Ekipman & Makine Güvenliği','İş Kazaları','Fiziksel Riskler & Ergonomi',
  'Acil Durum & İlk Yardım','Yangın Güvenliği','Risk & KKD','Mevzuat & Yaptırımlar',
  'Nöroergonomi','Eğitim & Sertifikasyon','Kurumsal Sağlık','Kurumsal Protokoller',
  'Kimyasal & Toksikoloji','Gürültü & Titreşim','Ergonomi'
]);
const NEURO = new Set([
  'Psikoloji & Ruh Sağlığı','Uyku & Vardiyalı Çalışma','Uyku & Biyolojik Ritim',
  'Tükenmişlik & Stres','Nöroloji & Beyin','Egzersiz & Fiziksel Aktivite',
  'Fiziksel Performans','Bilişsel Performans','Fiziksel Aktivite',
  'Propriyosepsiyon & Motor Kontrol'
]);

// Better altBaslik1 normalization for "Genel Sağlık & Diğer" articles
// using title keywords
function inferSubtopic(title, currentSub) {
  if (currentSub && currentSub !== 'Genel Sağlık & Diğer') return currentSub;
  const t = (title || '').toLowerCase();
  if (/vitamin|mineral|demir|çinko|magnezyum|kalsiyum|fosfor|selenyum|b12|d vitamini|c vitamini/.test(t)) return 'Vitaminler & Mineraller';
  if (/beslen|diyet|kilo|obezite|kalori|protein|karbonhidrat|yağ asidi|omega/.test(t)) return 'Beslenme & Diyet';
  if (/kalp|tansiyon|kan basıncı|kardiyovasküler|damar|kolesterol|trigliserid|atardamar/.test(t)) return 'Kardiyovasküler';
  if (/kan tahlil|hemogram|biyokimya|glukoz|hba1c|ferritin|crp|sedimantasyon/.test(t)) return 'Kan Tahlilleri & Biyokimya';
  if (/uyku|sirkadiyen|melatonin|insomnia|uyukusuzluk/.test(t)) return 'Uyku & Biyolojik Ritim';
  if (/stres|tükenmişlik|anksiyete|depresyon|kaygı|psikoloji/.test(t)) return 'Psikoloji & Ruh Sağlığı';
  if (/egzersiz|spor|yürüyüş|koşu|fiziksel aktivite|antrenman/.test(t)) return 'Egzersiz & Fiziksel Aktivite';
  if (/kanser|tümör|onkoloji|malign/.test(t)) return 'Kanser & Onkoloji';
  if (/enfeksiyon|bakteri|virüs|bağışıklık|immün|covid|grip|aşı/.test(t)) return 'Enfeksiyon & Bağışıklık';
  if (/diyabet|insülin|şeker|glukoz|hba1c|metabolik/.test(t)) return 'Diyabet & İnsülin Direnci';
  if (/tiroid|hipotiroidi|hipertiroidi|tsh/.test(t)) return 'Tiroid Hastalıkları';
  if (/cilt|saç|tırnak|deri|estetik|akne/.test(t)) return 'Cilt & Estetik';
  if (/solunum|akciğer|astım|koah|nefes|pulmoner/.test(t)) return 'Solunum Sistemi';
  if (/sindirim|mide|bağırsak|karaciğer|safra|kolit|gastrit/.test(t)) return 'Sindirim Sistemi';
  if (/yaşlanma|yaşlılık|longevity|ömür|kronik|alzheimer|demans/.test(t)) return 'Yaşlılık & Kronik Hast.';
  if (/ilaç|antibiyotik|antidepresan|farmakoloji|tedavi protokol/.test(t)) return 'İlaçlar & Farmakoloji';
  if (/bitki|bitkisel|doğal|herbal|sarımsak|zeytin|çay|zencefil/.test(t)) return 'Bitkisel & Doğal Sağlık';
  if (/antioksidan|serbest radikal|glutatyon|koenzim|resveratrol/.test(t)) return 'Antioksidanlar';
  if (/hormon|kortizol|östrojen|testosteron|endokrin/.test(t)) return 'Hormonlar & Endokrin';
  if (/yangın|söndürücü|tahliye|acil|ilk yardım|kaza/.test(t)) return 'Acil Durum & İlk Yardım';
  if (/isg|güvenlik|risk|tehlike|kep|koruyucu|ekipman/.test(t)) return 'İSG & Güvenlik';
  if (/eğitim|sertifika|kurs|öğren/.test(t)) return 'Eğitim & Sertifikasyon';
  return 'Genel Sağlık & Tıp';
}

function targetCategory(data) {
  const sub = data.altBaslik1 || '';
  if (SYSTEMS.has(sub)) return 'systems';
  if (NEURO.has(sub)) return 'neuroperformance';
  // title-based for Genel
  const inferred = inferSubtopic(data.title, sub);
  if (NEURO.has(inferred)) return 'neuroperformance';
  if (SYSTEMS.has(inferred)) return 'systems';
  return 'longevity';
}

const cats = ['longevity','systems','neuroperformance'];
let moved = 0, retagged = 0;

cats.forEach(cat => {
  const dir = path.join('content/articles', cat);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));
  files.forEach(f => {
    const fp = path.join(dir, f);
    const raw = fs.readFileSync(fp, 'utf8');
    const parsed = matter(raw);
    const data = parsed.data;

    // Infer better subtopic
    const betterSub = inferSubtopic(data.title, data.altBaslik1);
    const correctCat = targetCategory({...data, altBaslik1: betterSub});

    let changed = false;
    if (betterSub !== data.altBaslik1 && data.altBaslik1 === 'Genel Sağlık & Diğer') {
      data.altBaslik1 = betterSub;
      changed = true;
      retagged++;
    }

    if (correctCat !== cat) {
      // Move file
      const destDir = path.join('content/articles', correctCat);
      fs.mkdirSync(destDir, { recursive: true });
      const destPath = path.join(destDir, f);
      if (!fs.existsSync(destPath)) {
        // Update category in frontmatter
        data.category = correctCat;
        // Also update altBaslik1 if it's systems/neuro
        if (SYSTEMS.has(betterSub)) data.altBaslik1 = betterSub;
        if (NEURO.has(betterSub)) data.altBaslik1 = betterSub;
        const newRaw = matter.stringify(parsed.content, data);
        fs.writeFileSync(destPath, newRaw, 'utf8');
        fs.unlinkSync(fp);
        moved++;
      }
    } else if (changed) {
      data.category = cat;
      const newRaw = matter.stringify(parsed.content, data);
      fs.writeFileSync(fp, newRaw, 'utf8');
    }
  });
});

// Final counts
const final = {};
cats.forEach(cat => {
  final[cat] = fs.readdirSync(path.join('content/articles', cat)).filter(f => f.endsWith('.mdx')).length;
});

console.log(`Moved: ${moved}, Retagged: ${retagged}`);
console.log('Final counts:', final);
