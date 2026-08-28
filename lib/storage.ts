export type Progress = Record<string, number>;
export type Collection = Record<string, number>;
const keys = { coins:'ayo-baca-coins', progress:'ayo-baca-progress', collection:'ayo-baca-collection', schema:'ayo-baca-schema' };
function read<T>(key:string, fallback:T):T { if(typeof window==='undefined') return fallback; try { const value=localStorage.getItem(key); return value===null?fallback:JSON.parse(value); } catch { return fallback; } }
export const loadState = () => {
  const coins=read(keys.coins,0);const collection=read<Collection>(keys.collection,{});const progress=read<Progress>(keys.progress,{});const schema=read(keys.schema,1);
  if(schema<2&&typeof window!=='undefined'){
    const migrated={...progress};
    if(migrated['3']!==undefined&&migrated['4']===undefined) migrated['4']=migrated['3'];
    delete migrated['3'];
    localStorage.setItem(keys.progress,JSON.stringify(migrated));localStorage.setItem(keys.schema,'2');
    return { coins,progress:migrated,collection };
  }
  return { coins,progress,collection };
};
export function saveState(coins:number, progress:Progress, collection:Collection){ localStorage.setItem(keys.coins,JSON.stringify(coins));localStorage.setItem(keys.progress,JSON.stringify(progress));localStorage.setItem(keys.collection,JSON.stringify(collection));localStorage.setItem(keys.schema,'2'); }
export function clearState(){ Object.values(keys).forEach((key)=>localStorage.removeItem(key)); }
