'use client';

import { useEffect, useRef, useState } from 'react';
import { levels, rarityInfo, rewards, type WordItem } from '../lib/data';
import { awardCorrect, drawReward, shuffle, spendGacha } from '../lib/game';
import { clearState, loadState, saveState, type Collection, type Progress } from '../lib/storage';

type Screen = 'home'|'practice'|'done'|'gacha'|'collection'|'parents';
type PracticeItem = WordItem|string;
const cheers = ['Hebat!','Bagus!','Keren!','Pintar!','Luar biasa!'];
const rarityClass = (name:string) => name.toLowerCase();

export default function Home() {
  const [screen,setScreen] = useState<Screen>('home');
  const [coins,setCoins] = useState(0);
  const [progress,setProgress] = useState<Progress>({});
  const [collection,setCollection] = useState<Collection>({});
  const [levelIndex,setLevelIndex] = useState(0);
  const [queue,setQueue] = useState<PracticeItem[]>([]);
  const [question,setQuestion] = useState(0);
  const [awarded,setAwarded] = useState(false);
  const [cheer,setCheer] = useState('');
  const [notice,setNotice] = useState('');
  const [gachaState,setGachaState] = useState<'idle'|'shaking'|'open'>('idle');
  const [prize,setPrize] = useState<(typeof rewards)[number]|null>(null);
  const [hydrated,setHydrated] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>|null>(null);

  useEffect(()=>{ const saved=loadState();
    // Local storage is available only after the app mounts in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCoins(saved.coins);setProgress(saved.progress);setCollection(saved.collection);setHydrated(true); },[]);
  useEffect(()=>{ if(hydrated) saveState(coins,progress,collection); },[coins,progress,collection,hydrated]);
  useEffect(()=>()=>{ if(timer.current) clearTimeout(timer.current); },[]);

  const go = (next:Screen) => { setNotice('');setCheer('');setScreen(next); };
  const startLevel = (index:number) => { const source=levels[index].items as readonly PracticeItem[];setLevelIndex(index);setQueue(shuffle(source));setQuestion(0);setAwarded(false);setCheer('');setScreen('practice'); };
  const retry = () => { setNotice('Coba pelan-pelan. Kamu pasti bisa!'); };
  const correct = () => {
    if(awarded) return;
    setAwarded(true);setCoins((value)=>awardCorrect(value,false));
    setProgress((value)=>({...value,[String(levelIndex+1)]:Math.max(value[String(levelIndex+1)]??0,question+1)}));
    setCheer(cheers[Math.floor(Math.random()*cheers.length)]);setNotice('');
    timer.current=setTimeout(()=>{ if(question+1>=queue.length){setScreen('done');}else{setQuestion((value)=>value+1);setAwarded(false);setCheer('');} },650);
  };
  const pullGacha = () => {
    if(gachaState==='shaking') return;
    const payment=spendGacha(coins);
    if(!payment.ok){setNotice('Koinmu belum cukup. Yuk, membaca lagi!');return;}
    setCoins(payment.coins);setNotice('');setPrize(null);setGachaState('shaking');
    timer.current=setTimeout(()=>{ const won=drawReward();setPrize(won);setCollection((value)=>({...value,[won.id]:(value[won.id]??0)+1}));setGachaState('open'); },1700);
  };
  const skipGacha = () => { if(timer.current) clearTimeout(timer.current);const won=drawReward();setPrize(won);setCollection((value)=>({...value,[won.id]:(value[won.id]??0)+1}));setGachaState('open'); };
  const reset = () => { if(!window.confirm('Hapus semua koin, progres, dan koleksi? Tindakan ini tidak dapat dibatalkan.')) return;clearState();setCoins(0);setProgress({});setCollection({});setNotice('Progres sudah direset.'); };
  const item=queue[question];

  return <main className="app-shell">
    <header className="topbar">
      <button className="brand button-plain" onClick={()=>go('home')} aria-label="Kembali ke menu utama"><span className="brand-mark">A</span><span>Ayo Baca!</span></button>
      <button className="coin-pill" onClick={()=>go('gacha')} aria-label={`Buka Gacha Hadiah, kamu punya ${coins} koin`}>🪙 <strong>{coins}</strong></button>
    </header>
    {screen==='home'&&<HomeScreen startLevel={startLevel} go={go} progress={progress}/>} 
    {screen==='practice'&&item&&<Practice levelIndex={levelIndex} item={item} number={question+1} total={queue.length} awarded={awarded} cheer={cheer} notice={notice} retry={retry} correct={correct} back={()=>go('home')}/>} 
    {screen==='done'&&<Done levelIndex={levelIndex} replay={()=>startLevel(levelIndex)} home={()=>go('home')}/>} 
    {screen==='gacha'&&<Gacha coins={coins} state={gachaState} prize={prize} notice={notice} pull={pullGacha} skip={skipGacha} closeResult={()=>{setGachaState('idle');setPrize(null)}} home={()=>go('home')}/>} 
    {screen==='collection'&&<CollectionScreen collection={collection} home={()=>go('home')}/>} 
    {screen==='parents'&&<Parents reset={reset} notice={notice} home={()=>go('home')}/>} 
    {screen==='home'&&<footer><button className="parent-link" onClick={()=>go('parents')}>⚙ Area orang tua</button><span>Untuk anak hebat yang sedang belajar membaca 🌈</span></footer>}
  </main>;
}

function HomeScreen({startLevel,go,progress}:{startLevel:(i:number)=>void;go:(s:Screen)=>void;progress:Progress}){
  return <><section className="hero"><div className="mascot" aria-hidden="true">📖</div><p className="eyebrow">BELAJAR SAMBIL BERMAIN</p><h1>Halo, Pembaca Hebat!</h1><p className="subtitle">Pilih petualangan membacamu!</p></section><section className="level-grid" aria-label="Pilih level membaca">{levels.map((level,index)=><button className={`level-card color-${index+1}`} key={level.title} onClick={()=>startLevel(index)}><span className="level-number">LEVEL {index+1}</span><span className="level-icon" aria-hidden="true">{level.icon}</span><strong>{level.title}</strong><span className="level-example">{level.example}</span><span className="level-note">{level.note}</span><span className="level-progress">Terbaik: {progress[String(index+1)]??0}/100</span><span className="play-label">Mulai →</span></button>)}</section><nav className="home-actions" aria-label="Menu hadiah"><button className="action-button gacha" onClick={()=>go('gacha')}>✨ <span><strong>Gacha Hadiah</strong><small>5 koin sekali buka</small></span></button><button className="action-button collection" onClick={()=>go('collection')}>🎒 <span><strong>Koleksiku</strong><small>Lihat hadiahmu</small></span></button></nav></>;
}

function BackButton({onClick}:{onClick:()=>void}){return <button className="back-button" onClick={onClick} aria-label="Kembali ke menu">← Menu</button>}

function Practice({levelIndex,item,number,total,awarded,cheer,notice,retry,correct,back}:{levelIndex:number;item:PracticeItem;number:number;total:number;awarded:boolean;cheer:string;notice:string;retry:()=>void;correct:()=>void;back:()=>void}){
  const syllables=typeof item==='string'?null:item.syllables;
  const phrase=typeof item==='string'?item:item.normal;
  return <section className="scene practice-scene"><div className="scene-head"><BackButton onClick={back}/><div><span className="mini-label">LEVEL {levelIndex+1}</span><h2>{levels[levelIndex].title}</h2></div><span className="counter">{number} dari {total}</span></div><div className="reading-card"><p className="instruction">Baca tulisan ini dengan lantang</p><div className={`reading-text ${levelIndex===3?'phrase':''}`} aria-label={phrase}>{syllables?syllables.map((part,i)=><span key={`${part}-${i}`} className={`syllable s${i%3}`}>{part}{i<syllables.length-1&&<b aria-hidden="true">-</b>}</span>):phrase}</div><div className="feedback" role="status" aria-live="polite">{cheer||notice||' '}</div></div><div className="practice-actions"><button className="retry-button" onClick={retry}>↻ Ulangi Lagi</button><button className="correct-button" onClick={correct} disabled={awarded}>✓ Benar</button></div><p className="helper">Pendamping menekan tombol setelah anak selesai membaca.</p></section>;
}

function Done({levelIndex,replay,home}:{levelIndex:number;replay:()=>void;home:()=>void}){return <section className="scene center-scene"><div className="celebration" aria-hidden="true">🎉</div><p className="eyebrow">LEVEL {levelIndex+1} SELESAI</p><h1>Luar biasa!</h1><p className="big-copy">Kamu berhasil membaca <strong>100 latihan</strong>.</p><div className="stack-actions"><button className="primary-button" onClick={replay}>↻ Main Lagi</button><button className="secondary-button" onClick={home}>Kembali ke Menu</button></div></section>}

function Gacha({coins,state,prize,notice,pull,skip,closeResult,home}:{coins:number;state:string;prize:(typeof rewards)[number]|null;notice:string;pull:()=>void;skip:()=>void;closeResult:()=>void;home:()=>void}){return <section className="scene"><div className="scene-head"><BackButton onClick={home}/><div><span className="mini-label">KEJUTAN MENANTI</span><h2>Gacha Hadiah</h2></div><span className="counter">🪙 {coins}</span></div><div className="gacha-layout"><div className="gacha-stage"><div className={`capsule ${state} ${prize?rarityClass(prize.rarity):''}`} aria-live="polite">{state==='open'&&prize?<><span className="prize-icon">{prize.icon}</span><strong>{prize.name}</strong><span className="rarity-name">{prize.rarity}</span></>:<><span className="capsule-star">★</span><span>{state==='shaking'?'Ada kejutan!':'5 koin'}</span></>}</div>{state==='shaking'?<button className="skip-link" onClick={skip}>Lewati animasi</button>:state==='open'?<button className="primary-button" onClick={closeResult}>Buka Lagi</button>:<button className="primary-button" onClick={pull}>✨ Mulai Gacha</button>}<p className="notice" role="status">{notice}</p></div><aside className="odds-card"><h3>Peluang Hadiah</h3><p>Setiap hadiah punya tingkat kelangkaan.</p><ul>{rarityInfo.map((r)=><li key={r.name}><span className="rarity-dot" style={{background:r.color}}/><strong>{r.name}</strong><span>{r.chance}%</span></li>)}</ul></aside></div></section>}

function CollectionScreen({collection,home}:{collection:Collection;home:()=>void}){const owned=Object.keys(collection).length;return <section className="scene"><div className="scene-head"><BackButton onClick={home}/><div><span className="mini-label">HADIAHMU</span><h2>Koleksiku</h2></div><span className="counter">{owned}/{rewards.length}</span></div>{rarityInfo.map((info)=><section className="collection-group" key={info.name}><h3 style={{color:info.color}}>{info.name}</h3><div className="collection-grid">{rewards.filter((reward)=>reward.rarity===info.name).map((reward)=>{const count=collection[reward.id]??0;return <article className={`reward-card ${count?'owned':'locked'}`} key={reward.id}><span>{count?reward.icon:'?'}</span><strong>{count?reward.name:'Belum didapat'}</strong>{count>0&&<small>Dimiliki ×{count}</small>}</article>})}</div></section>)}</section>}

function Parents({reset,notice,home}:{reset:()=>void;notice:string;home:()=>void}){return <section className="scene center-scene parents"><BackButton onClick={home}/><div className="parent-icon">⚙</div><h2>Area Orang Tua</h2><p>Gunakan tombol Benar setelah anak selesai membaca. Ulangi Lagi tidak mengurangi koin dan tidak mengganti soal.</p><div className="info-box"><strong>Penyimpanan otomatis</strong><span>Koin, progres terbaik, dan koleksi tersimpan di perangkat ini.</span></div><button className="danger-button" onClick={reset}>Reset semua progres</button><p className="notice" role="status">{notice}</p></section>}
