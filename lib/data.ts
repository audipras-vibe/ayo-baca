export type WordItem = { normal: string; syllables: string[] };

export const soundVowels = ['a', 'i', 'u', 'e', 'o'] as const;
export const soundConsonants = 'bcdfghjklmnpqrstvwxyz'.split('');
export const soundSeries = soundConsonants.map((consonant) => ({
  consonant,
  sounds: soundVowels.map((vowel) => `${consonant}${vowel}`),
}));

const openTwo = `bu-ku me-ja bo-la sa-pi ku-da to-pi ba-ju ro-ti na-si su-su gi-gi ka-ki ma-ta pi-pi da-hi pa-ku pa-lu ta-li ba-tu be-si ka-ca sa-pu ru-sa la-ba ku-pu du-ku la-bu pe-na pi-ta pe-ta ro-da da-du te-ko sa-ku bu-sa pi-pa fo-to ta-hu to-ge cu-mi te-ri le-le ba-bi ke-ra ku-tu tu-na ku-ra pa-ri hi-u ko-ta de-sa to-ko ta-mu gu-ru ba-yi ma-ma pa-pa i-bu a-pi u-bi a-bu o-li a-ki da-da ba-hu ku-ku bu-lu si-ku ko-pi so-da ke-ju ma-du sa-te so-to na-ga bu-mi ba-ra gu-a ka-li ra-wa pa-gi so-re ha-ri si-ni sa-na ma-na sa-ya ka-mu ki-ta di-a a-yo i-ya a-da a-pa ma-u be-ri be-li ca-ri la-ri ba-ca`.split(' ');

const openThreeCore = `ke-la-pa se-pa-tu pe-pa-ya ke-me-ja ce-la-na bo-ne-ka se-pe-da le-ma-ri bu-a-ya gu-ri-ta ce-ri-a de-li-ma u-da-ra ca-ha-ya du-ni-a ce-ri-ta ba-ha-sa su-a-ra ne-ga-ra pe-ta-ni`.split(' ');
const openThree = [...openThreeCore, ...openTwo.slice(0, 80).map((value) => `${value}-ku`)];

const mixedWords = `ta-ngan ram-but bi-bir mu-lut ka-in a-yam i-kan i-tik be-bek u-lar u-dang ci-cak to-kek se-mut la-lat le-bah ca-cing bu-rung e-lang ga-gak me-rak je-ruk mang-ga na-nas sa-lak jam-bu to-mat ma-kan mi-num ti-dur man-di du-duk tu-lis nya-nyi ma-in lom-pat se-nyum sa-lam ban-tu tu-tup ta-rik do-rong pe-gang li-hat de-ngar be-sar ke-cil me-rah pu-tih hi-tam hi-jau ma-nis a-sam a-sin pa-nas di-ngin ber-sih ba-ik ting-gi pen-dek ker-tas gam-bar ko-tak pin-tu kur-si lam-pu ke-lin-ci ke-pi-ting be-la-lang ke-tu-pat ber-ma-in be-la-jar mem-ba-ca me-nu-lis me-na-ri ber-la-ri ber-ja-lan ter-ta-wa gem-bi-ra ber-sa-ma ber-ba-gi men-ja-ga me-nya-pu men-cu-ci me-ma-sak me-li-hat men-de-ngar me-ma-kai mem-ba-wa mem-bu-ka me-nu-tup me-nyi-ram ha-la-man ta-na-man sa-mu-dra ne-la-yan pe-nu-lis pem-ba-ca pe-ma-in pe-la-jar`.split(' ');

const toWordItems = (values: string[]): WordItem[] => values.map((value) => ({ normal: value.replaceAll('-', ''), syllables: value.split('-') }));

export const level1 = toWordItems(openTwo);
export const level2 = toWordItems(openThree);
export const level3 = toWordItems(mixedWords);

export const level4 = [
  'buku baru','bola merah','kucing tidur','adik makan','kakak baca','ibu masak','ayah duduk','bayi mandi','sapi makan','kuda lari',
  'burung terbang','ikan berenang','bebek mandi','ayam putih','kelinci lucu','semut kecil','gajah besar','ular hijau','kupu cantik','lebah madu',
  'roti manis','susu hangat','nasi putih','sup panas','jeruk manis','mangga muda','jambu merah','pisang matang','kelapa muda','pepaya manis',
  'meja kayu','kursi biru','pintu buka','jendela bersih','lampu terang','kamar rapi','rumah besar','taman hijau','bunga merah','pohon tinggi',
  'baju baru','topi biru','sepatu merah','tas kecil','kain halus','kaus putih','celana pendek','pita merah','saku kecil','payung kuning',
  'adik minum','kakak menulis','ibu membaca','ayah menyapu','bayi tertawa','nenek duduk','kakek berjalan','teman bermain','anak bernyanyi','guru bercerita',
  'buka buku','tutup pintu','ambil bola','bawa tas','pakai topi','cuci tangan','sikat gigi','minum susu','makan roti','baca cerita',
  'langit biru','awan putih','hujan turun','angin sejuk','pagi cerah','malam tenang','bulan bulat','bintang terang','rumput hijau','daun jatuh',
  'mobil jalan','bus besar','kapal laut','perahu kecil','roda bulat','sepeda baru','becak biru','kereta panjang','jalan lurus','jembatan tinggi',
  'pensil tajam','buku gambar','kertas putih','kotak pensil','papan tulis','kapur putih','kelas bersih','bekal sehat','botol minum','lonceng bunyi',
];

export const rewards = [
  { id:'c1', name:'Kucing Ceria', icon:'🐱', rarity:'Common' },{ id:'c2', name:'Apel Manis', icon:'🍎', rarity:'Common' },{ id:'c3', name:'Pensil Pintar', icon:'✏️', rarity:'Common' },{ id:'c4', name:'Bintang Kecil', icon:'⭐', rarity:'Common' },
  { id:'u1', name:'Kelinci Lompat', icon:'🐰', rarity:'Uncommon' },{ id:'u2', name:'Mobil Biru', icon:'🚙', rarity:'Uncommon' },{ id:'u3', name:'Jeruk Segar', icon:'🍊', rarity:'Uncommon' },
  { id:'r1', name:'Panda Peluk', icon:'🐼', rarity:'Rare' },{ id:'r2', name:'Roket Mini', icon:'🚀', rarity:'Rare' },{ id:'r3', name:'Pelangi Cerah', icon:'🌈', rarity:'Rare' },
  { id:'e1', name:'Dino Hijau', icon:'🦕', rarity:'Epic' },{ id:'e2', name:'Kapal Bintang', icon:'⛵', rarity:'Epic' },
  { id:'l1', name:'Singa Emas', icon:'🦁', rarity:'Legendary' },{ id:'l2', name:'Naga Pelangi', icon:'🐲', rarity:'Legendary' },
  { id:'m1', name:'Unicorn Ajaib', icon:'🦄', rarity:'Mythic' },{ id:'m2', name:'Meteor Senyum', icon:'☄️', rarity:'Mythic' },
] as const;

export const rarityInfo = [
  { name:'Common', chance:40, color:'#6f8795' },{ name:'Uncommon', chance:25, color:'#39a66f' },{ name:'Rare', chance:15, color:'#438fe0' },
  { name:'Epic', chance:10, color:'#a263dc' },{ name:'Legendary', chance:7, color:'#e59d21' },{ name:'Mythic', chance:3, color:'#e65b86' },
] as const;

export const levels = [
  { id:1, title:'Dua Suku Kata', example:'bu-ku', note:'Maks. 2 huruf per suku kata', icon:'🐣', items:level1 },
  { id:2, title:'Tiga Suku Kata', example:'ke-la-pa', note:'Maks. 2 huruf per suku kata', icon:'🐢', items:level2 },
  { id:3, title:'Kata Tantangan', example:'ta-ngan', note:'2–3 suku kata • boleh konsonan', icon:'🦊', items:level3 },
  { id:4, title:'Frasa Pendek', example:'buku baru', note:'Gabungan 2 kata', icon:'🐼', items:level4 },
] as const;
