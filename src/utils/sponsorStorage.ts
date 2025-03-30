import browser from 'webextension-polyfill';

export const ACTIVATION_MILESTONES = [10, 30, 60, 100, 150, 200, 220, 240, 250, 300, 330, 360, 400, 450, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000, 4100, 4200, 4300, 4400, 4500, 4600, 4700, 4800, 4900, 5000];

interface SponsorStorage {
  debugActivationCount: number;
  shownMilestones: number[];
  lastShownDate?: number;
}

const DEFAULT_STORAGE: SponsorStorage = {
  debugActivationCount: 0,
  shownMilestones: [],
};

interface StorageResult {
  sponsorData?: SponsorStorage;
}

export async function getSponsorStorage(): Promise<SponsorStorage> {
  const result = await browser.storage.local.get('sponsorData') as StorageResult;
  return result.sponsorData || DEFAULT_STORAGE;
}

export async function incrementActivationCount(): Promise<{
  count: number;
  shouldShowOverlay: boolean;
  milestone?: number;
}> {
  const data = await getSponsorStorage();
  data.debugActivationCount += 1;

  // Check if we've hit a new milestone
  const nextMilestone = ACTIVATION_MILESTONES.find(
    milestone => 
      milestone <= data.debugActivationCount && 
      !data.shownMilestones.includes(milestone)
  );

  const shouldShowOverlay = !!nextMilestone && 
    (!data.lastShownDate || Date.now() - data.lastShownDate > 24 * 60 * 60 * 1000); // Don't show more than once per day

  await browser.storage.local.set({ sponsorData: data });

  return {
    count: data.debugActivationCount,
    shouldShowOverlay,
    milestone: nextMilestone
  };
}

export async function markMilestoneShown(milestone: number): Promise<void> {
  const data = await getSponsorStorage();
  if (!data.shownMilestones.includes(milestone)) {
    data.shownMilestones.push(milestone);
  }
  data.lastShownDate = Date.now();
  await browser.storage.local.set({ sponsorData: data });
}

export async function deferOverlay(): Promise<void> {
  const data = await getSponsorStorage();
  data.lastShownDate = Date.now();
  await browser.storage.local.set({ sponsorData: data });
} 