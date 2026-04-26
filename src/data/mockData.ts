export type DILevel = 'critical' | 'high' | 'moderate' | 'stable';

export interface School {
  id: string; udise: string; name: string; block: string; village: string;
  di: number; level: DILevel; dvs: number; vacancies: { PHY: number; CHM: number; MAT: number; ENG?: number; HIN?: number };
  totalVacancies: number; rteViolation: boolean; pupils: number; teachers: number; ptr: number;
  lat: number; lng: number; lastUpdated: string; medium: string;
}

export interface Teacher {
  id: string; name: string; subject: string; experience: number; currentPosting: string;
  distance: number; matchScore: number; retentionScore: number; languages: string[];
}

const blocks = ['Akkalkuwa', 'Akrani', 'Nandurbar', 'Navapur', 'Shahada', 'Taloda'];
const villages = ['Roshmal', 'Toranmal', 'Dhadgaon', 'Molgi', 'Khaparkheda', 'Dhanora', 'Pimpalner', 'Asali', 'Khondamali', 'Bilgaon', 'Visarwadi', 'Khairwa'];

const subjects = ['PHY', 'CHM', 'MAT'] as const;

function levelFromDI(di: number): DILevel {
  if (di >= 80) return 'critical';
  if (di >= 60) return 'high';
  if (di >= 40) return 'moderate';
  return 'stable';
}

function rand(seed: number) {
  let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

export const SCHOOLS: School[] = (() => {
  const r = rand(42);
  const out: School[] = [];
  // Mostly critical/high to dramatize
  const distribution = [...Array(180).fill('critical'), ...Array(310).fill('high'), ...Array(250).fill('moderate'), ...Array(107).fill('stable')];
  for (let i = 0; i < 847; i++) {
    const cat = distribution[i] as DILevel;
    const di = cat === 'critical' ? 80 + Math.floor(r() * 20) : cat === 'high' ? 60 + Math.floor(r() * 20) : cat === 'moderate' ? 40 + Math.floor(r() * 20) : Math.floor(r() * 40);
    const phy = Math.floor(r() * 3); const chm = Math.floor(r() * 3); const mat = Math.floor(r() * 3);
    const total = phy + chm + mat;
    const pupils = 80 + Math.floor(r() * 320);
    const teachers = Math.max(2, Math.floor(pupils / (25 + r() * 30)) - total);
    const ptr = Math.round(pupils / Math.max(teachers, 1));
    out.push({
      id: `S${1000 + i}`, udise: `27${(16000000 + i).toString()}`,
      name: `${['ZP', 'GP', 'Tribal Ashram', 'Govt Higher', 'Adivasi'][i % 5]} School ${villages[i % villages.length]} ${i + 1}`,
      block: blocks[i % blocks.length], village: villages[i % villages.length],
      di, level: cat, dvs: 50 + Math.floor(r() * 50),
      vacancies: { PHY: phy, CHM: chm, MAT: mat }, totalVacancies: total,
      rteViolation: cat === 'critical' ? r() > 0.2 : cat === 'high' ? r() > 0.6 : false,
      pupils, teachers, ptr,
      lat: 21.37 + (r() - 0.5) * 0.8, lng: 74.24 + (r() - 0.5) * 0.8,
      lastUpdated: cat === 'critical' ? '2024-08-15' : '2025-02-12',
      medium: ['Marathi', 'Hindi', 'Marathi', 'Marathi'][i % 4],
    });
  }
  return out.sort((a, b) => b.di - a.di);
})();

export const STATS = {
  totalSchools: 847,
  vacancies: 200,
  criticalSchools: SCHOOLS.filter(s => s.level === 'critical').length,
  rteViolations: SCHOOLS.filter(s => s.rteViolation).length,
  deploymentsThisWeek: 23,
};

export const TEACHERS: Teacher[] = [
  { id: 'T1', name: 'Priya Deshmukh', subject: 'PHY', experience: 8, currentPosting: 'ZP School Shahada', distance: 12, matchScore: 94, retentionScore: 82, languages: ['mr', 'hi', 'en'] },
  { id: 'T2', name: 'Rajesh Patil', subject: 'PHY', experience: 12, currentPosting: 'Govt School Navapur', distance: 28, matchScore: 88, retentionScore: 76, languages: ['mr', 'hi'] },
  { id: 'T3', name: 'Sunita Pawar', subject: 'PHY', experience: 5, currentPosting: 'Tribal Ashram Akkalkuwa', distance: 8, matchScore: 86, retentionScore: 91, languages: ['mr', 'bhili'] },
  { id: 'T4', name: 'Anil Gavit', subject: 'PHY', experience: 15, currentPosting: 'GP Taloda', distance: 34, matchScore: 79, retentionScore: 48, languages: ['mr', 'hi'] },
  { id: 'T5', name: 'Kavita Mahajan', subject: 'PHY', experience: 6, currentPosting: 'Adivasi School Akrani', distance: 18, matchScore: 75, retentionScore: 88, languages: ['mr'] },
];

export const PENDING_ASSIGNMENTS = SCHOOLS.slice(0, 12).map((s, i) => ({
  id: `A${i}`, school: s, teacher: TEACHERS[i % TEACHERS.length], proposedDate: '2026-05-04',
}));

// Keep single export for backward compat; primary entry point is BRIEFING_TEXTS
export const BRIEFING_TEXT = `Nandurbar district shows acute Physics teacher shortages concentrated in Akkalkuwa and Akrani blocks, where 47 schools have been operating without a single Physics instructor for over 14 months. Tribal Ashram schools in Toranmal and Dhadgaon villages account for 38% of all RTE violations district-wide despite serving only 12% of pupils — a disproportionate burden borne by Bhili-speaking communities.

Three immediate actions will move the needle this quarter:
• Redeploy 12 surplus PHY teachers from Shahada and Taloda blocks (currently at 1:18 PTR) to the 18 critical-DI schools in Akkalkuwa.
• Field-verify UDISE+ data for 67 schools whose enrolment figures haven't been refreshed since August 2024 — preliminary DBT cross-checks suggest pupil counts are understated by ~22%.
• Approve the pending 23 deployments before May 4th to comply with RTE Section 25(1) before the academic session begins.

Retention risk is highest for candidates posted >25 km from home block. Two of the top-ranked candidates (Anil Gavit, Rajesh Patil) score below 55 on retention — recommend pairing with housing allowance under the Tribal Sub-Plan to mitigate attrition.`;

// ── Multi-language, multi-variant briefings for the Regenerate feature ──────
export const BRIEFING_TEXTS: Record<string, string[]> = {
  en: [
    BRIEFING_TEXT,
    `This week's AI analysis highlights Chemistry shortages as the emerging crisis in Navapur and Shahada blocks, where 31 schools have no CHM instructor — up 18% from last quarter. Cross-referencing DBT beneficiary data reveals that 4,200 students in these blocks are at immediate dropout risk due to incomplete teaching coverage.

Priority actions for the next 10 days:
• Fast-track deployment of 8 CHM teachers from Nandurbar urban cluster (PTR currently 1:14 — well below the 1:30 norm).
• Initiate block-level verification camps for 41 schools with enrolment figures predating the 2024-25 academic session.
• Convene a micro-planning meeting with Akkalkuwa and Akrani BEOs to align deployment with mid-year transfers.

Budget note: ₹12.4 lakh in TSP housing allowances remains unspent — allocating this to high-retention-risk teachers (distance >30 km) could cut predicted attrition by 40%.`,
    `Gemini's latest sweep of district records identifies Mathematics as the most acute gap across tribal areas. 62 schools in Akrani and Akkalkuwa have a combined MAT vacancy of 89 posts, meaning 14,300 pupils are receiving no dedicated mathematics instruction.

Three data-backed recommendations:
• The top 15 MAT teachers in the surplus pool (Taloda, Shahada) have an average match score of 87 — immediate redeployment is low-risk and high-impact.
• RTE Section 25(1) violations will rise by an estimated 12% if the May 4th deployment window is missed. Expedite sign-off on the 23 pending assignments.
• UDISE+ refresh is overdue for 67 schools. Inaccurate pupil counts are distorting the DI ranking — correcting these figures may shift up to 14 schools from "moderate" to "critical", unlocking additional central funds.`,
  ],
  mr: [
    `नंदुरबार जिल्ह्यात भौतिकशास्त्र शिक्षकांची तीव्र कमतरता प्रामुख्याने अक्कलकुवा आणि अक्राणी तालुक्यांमध्ये जाणवत आहे. या भागातील ४७ शाळांमध्ये गेल्या १४ महिन्यांपासून एकही भौतिकशास्त्र शिक्षक नाही. तोरणमाळ आणि धडगाव गावांतील आदिवासी आश्रम शाळा जिल्ह्यातील ३८% RTE उल्लंघनांसाठी जबाबदार आहेत, तरीही त्या केवळ १२% विद्यार्थ्यांना सेवा देतात.

या तिमाहीत तात्काळ करायच्या तीन कृती:
• शहादा आणि तळोदा तालुक्यांतून १२ अतिरिक्त PHY शिक्षकांची अक्कलकुव्यातील १८ गंभीर DI शाळांमध्ये पुनर्नियुक्ती करा.
• ऑगस्ट २०२४ पासून ज्यांचे नावनोंदणीचे आकडे अद्ययावत केलेले नाहीत अशा ६७ शाळांसाठी UDISE+ डेटा क्षेत्र-पडताळणी करा.
• RTE कलम २५(१) चे पालन करण्यासाठी ४ मे पूर्वी प्रलंबित २३ नियुक्त्या मंजूर करा.

२५ किमी पेक्षा जास्त अंतरावर नियुक्त उमेदवारांमध्ये टिकाव जोखीम जास्त आहे. अनिल गावित आणि राजेश पाटील यांचे टिकाव गुण ५५ पेक्षा कमी आहेत — त्यांना आदिवासी उपयोजनेंतर्गत गृहनिर्माण भत्ता देण्याची शिफारस आहे.`,
    `या आठवड्याच्या AI विश्लेषणानुसार, नवापूर आणि शहादा तालुक्यांमध्ये रसायनशास्त्र शिक्षकांची कमतरता ही उदयोन्मुख संकट बनत आहे. ३१ शाळांमध्ये एकही CHM शिक्षक नाही — मागील तिमाहीपेक्षा १८% अधिक.

पुढील १० दिवसांसाठी प्राधान्य कृती:
• नंदुरबार शहराच्या समूहातून ८ CHM शिक्षकांची जलद नियुक्ती करा (सध्याचे PTR १:१४ — प्रमाणापेक्षा खूप कमी).
• २०२४-२५ शैक्षणिक वर्षापूर्वीच्या नावनोंदणीच्या आकड्यांसह ४१ शाळांसाठी तालुका-स्तरीय पडताळणी शिबिरे सुरू करा.
• TSP गृहनिर्माण भत्त्यातील ₹१२.४ लाख अखर्चित आहेत — हे उच्च टिकाव-जोखीम शिक्षकांसाठी वापरल्यास अपेक्षित अपघर्षण ४०% कमी होईल.`,
    `Gemini च्या ताज्या जिल्हा अभिलेख तपासणीत गणित हा आदिवासी भागातील सर्वात तीव्र अभाव म्हणून ओळखला गेला आहे. अक्राणी आणि अक्कलकुव्यातील ६२ शाळांमध्ये एकत्रित ८९ MAT पदे रिक्त आहेत.

तीन डेटा-आधारित शिफारसी:
• अतिरिक्त शिक्षक संचातील शीर्ष १५ MAT शिक्षकांचे सरासरी जुळणी गुण ८७ आहेत — त्यांची तात्काळ पुनर्नियुक्ती करा.
• ४ मे ची नियुक्ती खिडकी चुकल्यास RTE कलम २५(१) उल्लंघने अंदाजे १२% वाढतील. २३ प्रलंबित नियुक्त्यांना मंजुरी द्या.
• ६७ शाळांसाठी UDISE+ अद्यतन थकीत आहे. अयोग्य विद्यार्थी संख्या DI क्रमांकाला विकृत करत आहे.`,
  ],
  hi: [
    `नंदुरबार जिले में भौतिक विज्ञान शिक्षकों की गंभीर कमी अक्कलकुवा और अकरानी खंडों में केंद्रित है, जहाँ 47 स्कूल 14 महीनों से बिना भौतिकी प्रशिक्षक के चल रहे हैं। तोरणमाल और धडगाव गाँवों की जनजातीय आश्रम शालाएँ जिले के 38% RTE उल्लंघनों के लिए उत्तरदायी हैं।

इस तिमाही में तत्काल तीन कदम उठाने होंगे:
• शहादा और तालोदा खंडों से 12 अधिशेष PHY शिक्षकों को अक्कलकुवा के 18 गंभीर-DI स्कूलों में पुनः तैनात करें।
• अगस्त 2024 से नामांकन आंकड़े ताज़ा न होने वाले 67 स्कूलों के लिए UDISE+ डेटा की क्षेत्र-जांच करें।
• शैक्षणिक सत्र शुरू होने से पहले RTE धारा 25(1) का अनुपालन करने के लिए 4 मई से पहले 23 लंबित नियुक्तियाँ स्वीकृत करें।

25 किमी से अधिक दूरी पर तैनात अभ्यर्थियों में प्रतिधारण जोखिम सबसे अधिक है। अनिल गावित और राजेश पाटील का प्रतिधारण स्कोर 55 से कम है — जनजातीय उप-योजना के तहत आवास भत्ता देने की सिफारिश की जाती है।`,
    `इस सप्ताह के AI विश्लेषण से पता चलता है कि नवापुर और शहादा खंडों में रसायन विज्ञान की कमी उभरता संकट बन रही है। 31 स्कूलों में कोई CHM प्रशिक्षक नहीं है — पिछली तिमाही से 18% अधिक।

अगले 10 दिनों के लिए प्राथमिकता कार्य:
• नंदुरबार शहरी समूह से 8 CHM शिक्षकों की तेजी से तैनाती करें (वर्तमान PTR 1:14)।
• 2024-25 शैक्षणिक सत्र से पहले के नामांकन आंकड़ों वाले 41 स्कूलों के लिए खंड-स्तरीय सत्यापन शिविर शुरू करें।
• ₹12.4 लाख TSP आवास भत्ता अव्ययित है — इसे उच्च प्रतिधारण-जोखिम शिक्षकों को आवंटित करें।`,
    `Gemini के ताज़ा जिला रिकॉर्ड विश्लेषण में गणित को जनजातीय क्षेत्रों में सबसे तीव्र कमी के रूप में पहचाना गया है। अकरानी और अक्कलकुवा के 62 स्कूलों में संयुक्त रूप से 89 MAT पद रिक्त हैं।

तीन डेटा-समर्थित सिफारिशें:
• अधिशेष पूल के शीर्ष 15 MAT शिक्षकों का औसत मिलान स्कोर 87 है — तत्काल पुनः तैनाती करें।
• 4 मई की तैनाती विंडो चूकने पर RTE उल्लंघन 12% बढ़ेंगे। 23 लंबित नियुक्तियाँ शीघ्र मंजूर करें।
• 67 स्कूलों के लिए UDISE+ अपडेट अतिदेय है। गलत छात्र संख्या DI रैंकिंग को विकृत कर रही है।`,
  ],
  te: [
    `నందుర్బార్ జిల్లాలో భౌతికశాస్త్ర ఉపాధ్యాయుల తీవ్ర కొరత అక్కల్‌కువా మరియు అక్రాని బ్లాకులలో కేంద్రీకృతమై ఉంది. 47 పాఠశాలలు 14 నెలలుగా భౌతిక శాస్త్ర ఉపాధ్యాయుడు లేకుండా నడుస్తున్నాయి.

ఈ త్రైమాసికంలో తక్షణ మూడు చర్యలు:
• షహాడా మరియు తలోడా బ్లాకుల నుండి 12 అదనపు PHY ఉపాధ్యాయులను అక్కల్‌కువా క్రిటికల్-DI పాఠశాలలకు మళ్లించండి.
• 67 పాఠశాలల UDISE+ డేటాను ఫీల్డ్-వెరిఫై చేయండి.
• RTE సెక్షన్ 25(1) కోసం మే 4 కు ముందు 23 పెండింగ్ నియామకాలను ఆమోదించండి.`,
    `ఈ వారం AI విశ్లేషణ నవాపూర్ మరియు షహాడా బ్లాకులలో రసాయన శాస్త్ర కొరత అభివృద్ధి చెందుతున్న సంక్షోభంగా హైలైట్ చేస్తోంది. 31 పాఠశాలలలో CHM ఉపాధ్యాయుడు లేడు.

తక్షణ చర్యలు:
• నందుర్బార్ నగర క్లస్టర్ నుండి 8 CHM ఉపాధ్యాయులను వేగంగా మోహరించండి.
• ₹12.4 లక్షల TSP హౌసింగ్ అలవెన్స్ ఖర్చు కాలేదు — అధిక నిలుపుదల-జోఖిం ఉపాధ్యాయులకు కేటాయించండి.`,
    `Gemini యొక్క జిల్లా రికార్డుల తాజా సర్వేలో గణితం ఆదివాసీ ప్రాంతాలలో అత్యంత తీవ్రమైన లోపంగా గుర్తించబడింది. 62 పాఠశాలలలో 89 MAT ఖాళీలు ఉన్నాయి.

మూడు సిఫారసులు:
• టాప్ 15 MAT ఉపాధ్యాయులను తక్షణం మోహరించండి (సగటు మ్యాచ్ స్కోర్ 87).
• 23 పెండింగ్ నియామకాలను వేగంగా ఆమోదించండి.
• 67 పాఠశాలల UDISE+ నవీకరణ ఆలస్యమైంది.`,
  ],
  kn: [
    `ನಂದುರ್‌ಬಾರ್ ಜಿಲ್ಲೆಯಲ್ಲಿ ಭೌತಶಾಸ್ತ್ರ ಶಿಕ್ಷಕರ ತೀವ್ರ ಕೊರತೆ ಅಕ್ಕಲ್‌ಕುವಾ ಮತ್ತು ಅಕ್ರಾನಿ ಬ್ಲಾಕ್‌ಗಳಲ್ಲಿ ಕೇಂದ್ರೀಕೃತವಾಗಿದೆ. 47 ಶಾಲೆಗಳು 14 ತಿಂಗಳಿನಿಂದ ಒಬ್ಬ ಭೌತಶಾಸ್ತ್ರ ಬೋಧಕರಿಲ್ಲದೆ ನಡೆಯುತ್ತಿವೆ.

ತ್ರೈಮಾಸಿಕದಲ್ಲಿ ತಕ್ಷಣದ ಮೂರು ಕ್ರಮಗಳು:
• ಶಹಾಡಾ ಮತ್ತು ತಾಲೋಡಾ ಬ್ಲಾಕ್‌ಗಳ 12 ಹೆಚ್ಚುವರಿ PHY ಶಿಕ್ಷಕರನ್ನು ಅಕ್ಕಲ್‌ಕುವಾದ 18 ನಿರ್ಣಾಯಕ-DI ಶಾಲೆಗಳಿಗೆ ಮರು-ನಿಯೋಜಿಸಿ.
• 67 ಶಾಲೆಗಳ UDISE+ ಡೇಟಾವನ್ನು ಕ್ಷೇತ್ರ-ಪರಿಶೀಲಿಸಿ.
• ಮೇ 4 ಮೊದಲು 23 ಬಾಕಿ ನಿಯೋಜನೆಗಳನ್ನು ಅನುಮೋದಿಸಿ.`,
    `ಈ ವಾರದ AI ವಿಶ್ಲೇಷಣೆ ನವಾಪುರ ಮತ್ತು ಶಹಾಡಾ ಬ್ಲಾಕ್‌ಗಳಲ್ಲಿ ರಸಾಯನಶಾಸ್ತ್ರ ಕೊರತೆಯನ್ನು ಉದಯೋನ್ಮುಖ ಬಿಕ್ಕಟ್ಟಾಗಿ ಎತ್ತಿ ತೋರಿಸುತ್ತದೆ.

ತಕ್ಷಣದ ಕ್ರಮಗಳು:
• ನಂದುರ್‌ಬಾರ್ ನಗರ ಸಮೂಹದಿಂದ 8 CHM ಶಿಕ್ಷಕರನ್ನು ತ್ವರಿತವಾಗಿ ನಿಯೋಜಿಸಿ.
• ₹12.4 ಲಕ್ಷ TSP ವಸತಿ ಭತ್ಯೆ ಬಳಕೆಯಾಗಿಲ್ಲ — ಉನ್ನತ ಧಾರಣ-ಅಪಾಯದ ಶಿಕ್ಷಕರಿಗೆ ನೀಡಿ.`,
    `Gemini ಕ್ಕೆ ಜಿಲ್ಲಾ ದಾಖಲೆಗಳ ಇತ್ತೀಚಿನ ಸಮೀಕ್ಷೆಯಲ್ಲಿ ಗಣಿತವನ್ನು ಆದಿವಾಸಿ ಪ್ರದೇಶಗಳಲ್ಲಿ ತೀವ್ರ ಕೊರತೆ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ. 62 ಶಾಲೆಗಳಲ್ಲಿ 89 MAT ಹುದ್ದೆಗಳು ಖಾಲಿ ಇವೆ.

ಮೂರು ಶಿಫಾರಸುಗಳು:
• ಉನ್ನತ 15 MAT ಶಿಕ್ಷಕರನ್ನು ತಕ್ಷಣ ಮರು-ನಿಯೋಜಿಸಿ.
• 23 ಬಾಕಿ ನಿಯೋಜನೆಗಳನ್ನು ತ್ವರಿತವಾಗಿ ಅನುಮೋದಿಸಿ.
• 67 ಶಾಲೆಗಳ UDISE+ ನವೀಕರಣ ತಡವಾಗಿದೆ.`,
  ],
  ta: [
    `நந்துர்பார் மாவட்டத்தில் இயற்பியல் ஆசிரியர்களின் தீவிர பற்றாக்குறை அக்கல்குவா மற்றும் அக்ரானி தொகுதிகளில் குவிந்துள்ளது. 47 பள்ளிகளில் 14 மாதங்களாக ஒரு இயற்பியல் ஆசிரியர் கூட இல்லை.

இந்த காலாண்டில் உடனடி மூன்று நடவடிக்கைகள்:
• ஷஹாடா மற்றும் தலோடா தொகுதிகளில் இருந்து 12 மிகுதியான PHY ஆசிரியர்களை அக்கல்குவாவின் 18 முக்கியமான DI பள்ளிகளுக்கு மாற்றுங்கள்.
• 67 பள்ளிகளின் UDISE+ தரவை கள-சரிபார்ப்பு செய்யுங்கள்.
• மே 4 க்கு முன் 23 நிலுவையில் உள்ள நியமனங்களை அங்கீகரியுங்கள்.`,
    `இந்த வாரத்தின் AI பகுப்பாய்வு நவாபூர் மற்றும் ஷஹாடா தொகுதிகளில் வேதியியல் பற்றாக்குறையை வளர்ந்து வரும் நெருக்கடியாக முன்னிலைப்படுத்துகிறது.

உடனடி நடவடிக்கைகள்:
• நந்துர்பார் நகர் கணத்திலிருந்து 8 CHM ஆசிரியர்களை விரைவாக நியமியுங்கள்.
• ₹12.4 லட்சம் TSP வீட்டுக் கொடுப்பனவு செலவழிக்கப்படவில்லை — அதிக தக்கவைப்பு-ஆபத்துள்ள ஆசிரியர்களுக்கு ஒதுக்குங்கள்.`,
    `Gemini இன் மாவட்ட பதிவுகளின் சமீபத்திய ஆய்வு கணிதத்தை பழங்குடியின பகுதிகளில் மிகவும் தீவிரமான இடைவெளியாக அடையாளம் காட்டுகிறது. 62 பள்ளிகளில் 89 MAT காலிப்பணியிடங்கள் உள்ளன.

மூன்று பரிந்துரைகள்:
• மேல் 15 MAT ஆசிரியர்களை உடனடியாக மீண்டும் நியமியுங்கள்.
• 23 நிலுவையில் உள்ள நியமனங்களை விரைவாக அங்கீகரியுங்கள்.
• 67 பள்ளிகளின் UDISE+ புதுப்பிப்பு தாமதமாகிறது.`,
  ],
};
