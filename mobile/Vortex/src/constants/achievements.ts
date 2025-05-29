// src/constants/achievements.ts
export interface AchievementDef {
  code: string;
  title: string;
  description: string;
  icon: string; 
  unlocked: boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    code: 'first_fillup',
    title: 'First Fill-up',
    description: 'Complete your first fuel purchase',
    icon: 'gas-station-outline',
    unlocked: false,
  },
  {
    code: 'big_spender',
    title: 'Fixed Success',
    description: 'Buy more than 100 L of any gas at one time',
    icon: 'currency-usd',
    unlocked: false,
  },
  {
    code: 'regular_client',
    title: 'Regular Client',
    description: 'Make 10 or more purchases',
    icon: 'car-outline',
    unlocked: false,
  },
  {
    code: 'rich_player',
    title: 'Rich Player',
    description: 'Buy fuel for 2000 ₴ in total',
    icon: 'cash-multiple',
    unlocked: false,
  },
];
