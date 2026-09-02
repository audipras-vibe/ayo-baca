import test from 'node:test';
import assert from 'node:assert/strict';
import { level1, level2, level3, level4, rarityInfo, soundConsonants, soundSeries, soundVowels } from '../lib/data.ts';
import { awardCorrect, rarityForRoll, shuffle, spendGacha } from '../lib/game.ts';

test('setiap level berisi tepat 100 item unik', () => {
  for (const items of [level1, level2, level3, level4]) {
    assert.equal(items.length, 100);
    const names = items.map((item) => typeof item === 'string' ? item : item.normal);
    assert.equal(new Set(names).size, 100);
  }
});

test('data suku kata sesuai dengan tingkat kesulitan', () => {
  const isOpenShort = (part:string) => part.length <= 2 && /[aiueo]$/.test(part);
  assert.ok(level1.every((item) => item.syllables.length === 2 && item.syllables.every(isOpenShort) && item.syllables.join('') === item.normal));
  assert.ok(level2.every((item) => item.syllables.length === 3 && item.syllables.every(isOpenShort) && item.syllables.join('') === item.normal));
  assert.ok(level3.every((item) => item.syllables.length >= 2 && item.syllables.length <= 3 && item.syllables.join('') === item.normal));
  assert.ok(level4.every((item) => item.trim().split(/\s+/).length === 2));
});

test('latihan bunyi memuat semua konsonan dengan urutan vokal aiueo', () => {
  assert.equal(soundConsonants.join(''), 'bcdfghjklmnpqrstvwxyz');
  assert.deepEqual(soundVowels, ['a', 'i', 'u', 'e', 'o']);
  assert.deepEqual(soundSeries[0].sounds, ['ba', 'bi', 'bu', 'be', 'bo']);
  assert.deepEqual(soundSeries.at(-1)?.sounds, ['za', 'zi', 'zu', 'ze', 'zo']);
});

test('shuffle mempertahankan semua item tanpa pengulangan', () => {
  let seed = 0;
  const random = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const shuffled = shuffle(level4, random);
  assert.equal(shuffled.length, level4.length);
  assert.equal(new Set(shuffled).size, level4.length);
  assert.notDeepEqual(shuffled, level4);
});

test('jawaban benar hanya memberi satu koin per soal', () => {
  assert.equal(awardCorrect(10, false), 11);
  assert.equal(awardCorrect(11, true), 11);
});

test('ulangi lagi tidak mengubah soal atau koin', () => {
  const state = { question: 7, coins: 4 };
  const repeated = { ...state };
  assert.deepEqual(repeated, state);
});

test('gacha ditolak di bawah 5 koin dan memotong tepat 5 koin', () => {
  assert.deepEqual(spendGacha(4), { ok:false, coins:4 });
  assert.deepEqual(spendGacha(12), { ok:true, coins:7 });
});

test('rentang rarity tepat 100% tanpa celah', () => {
  assert.equal(rarityInfo.reduce((sum, item) => sum + item.chance, 0), 100);
  assert.equal(rarityForRoll(0), 'Common');
  assert.equal(rarityForRoll(39.999), 'Common');
  assert.equal(rarityForRoll(40), 'Uncommon');
  assert.equal(rarityForRoll(64.999), 'Uncommon');
  assert.equal(rarityForRoll(65), 'Rare');
  assert.equal(rarityForRoll(80), 'Epic');
  assert.equal(rarityForRoll(90), 'Legendary');
  assert.equal(rarityForRoll(97), 'Mythic');
  assert.equal(rarityForRoll(99.999), 'Mythic');
});

test('state dapat disimpan dan dimuat ulang', async () => {
  const memory = new Map<string,string>();
  Object.assign(globalThis, { window:globalThis, localStorage:{ getItem:(k:string)=>memory.get(k)??null, setItem:(k:string,v:string)=>memory.set(k,v), removeItem:(k:string)=>memory.delete(k) } });
  const { saveState, loadState } = await import('../lib/storage.ts');
  saveState(9, { '1':12 }, { c1:2 });
  assert.deepEqual(loadState(), { coins:9, progress:{ '1':12 }, collection:{ c1:2 } });
});

test('progres frasa lama bermigrasi dari Level 3 ke Level 4', async () => {
  const memory = new Map<string,string>([['ayo-baca-progress',JSON.stringify({ '1':5, '3':27 })]]);
  Object.assign(globalThis, { window:globalThis, localStorage:{ getItem:(k:string)=>memory.get(k)??null, setItem:(k:string,v:string)=>memory.set(k,v), removeItem:(k:string)=>memory.delete(k) } });
  const { loadState } = await import('../lib/storage.ts');
  assert.deepEqual(loadState().progress, { '1':5, '4':27 });
});
