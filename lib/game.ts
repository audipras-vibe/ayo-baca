import { rarityInfo, rewards } from './data.ts';

export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function rarityForRoll(roll: number) {
  if (roll < 0 || roll >= 100) throw new RangeError('Roll must be 0–99.999');
  let edge = 0;
  for (const rarity of rarityInfo) {
    edge += rarity.chance;
    if (roll < edge) return rarity.name;
  }
  throw new Error('Invalid rarity table');
}

export function drawReward(random = Math.random) {
  const rarity = rarityForRoll(random() * 100);
  const pool = rewards.filter((reward) => reward.rarity === rarity);
  return pool[Math.floor(random() * pool.length)];
}

export function awardCorrect(coins: number, alreadyAwarded: boolean) {
  return alreadyAwarded ? coins : coins + 1;
}

export function spendGacha(coins: number) {
  return coins < 5 ? { ok:false as const, coins } : { ok:true as const, coins:coins - 5 };
}
