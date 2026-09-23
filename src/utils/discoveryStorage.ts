/**
 * User discovery and exploration tracking (Client-side private storage)
 * Respects user privacy: 0 telemetry, 100% localStorage.
 */

export interface DiscoveryState {
  chaptersRead: number[];
  archivesOpened: string[];
  mysteriesViewed: string[];
  sitesVisited: string[];
  secretsFound: string[];
  userTheories: { questionId: string; theory: string; timestamp: string }[];
  discoveredNamelessSpiral: boolean;
  introSeen: boolean;
  reducedMotion: boolean;
  audioZone: 'antarctica' | 'sub-ice' | 'spiral' | 'fracture' | 'timeless';
}

const STORAGE_KEY = 'spiral_universe_discovery_v1';

const defaultState: DiscoveryState = {
  chaptersRead: [0],
  archivesOpened: [],
  mysteriesViewed: [],
  sitesVisited: ['antarctic_surface'],
  secretsFound: [],
  userTheories: [],
  discoveredNamelessSpiral: false,
  introSeen: false,
  reducedMotion: false,
  audioZone: 'antarctica',
};

export const getDiscoveryState = (): DiscoveryState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
};

export const saveDiscoveryState = (state: Partial<DiscoveryState>): DiscoveryState => {
  try {
    const current = getDiscoveryState();
    const updated = { ...current, ...state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch custom event for reactive UI updates across components
    window.dispatchEvent(new CustomEvent('spiral_discovery_update', { detail: updated }));
    return updated;
  } catch {
    return defaultState;
  }
};

export const trackDiscovery = {
  chapterRead: (chapterIdx: number) => {
    const state = getDiscoveryState();
    if (!state.chaptersRead.includes(chapterIdx)) {
      saveDiscoveryState({ chaptersRead: [...state.chaptersRead, chapterIdx] });
    }
  },
  archiveOpened: (docId: string) => {
    const state = getDiscoveryState();
    if (!state.archivesOpened.includes(docId)) {
      saveDiscoveryState({ archivesOpened: [...state.archivesOpened, docId] });
    }
  },
  mysteryViewed: (mysteryId: string) => {
    const state = getDiscoveryState();
    if (!state.mysteriesViewed.includes(mysteryId)) {
      saveDiscoveryState({ mysteriesViewed: [...state.mysteriesViewed, mysteryId] });
    }
  },
  siteVisited: (siteId: string) => {
    const state = getDiscoveryState();
    if (!state.sitesVisited.includes(siteId)) {
      saveDiscoveryState({ sitesVisited: [...state.sitesVisited, siteId] });
    }
  },
  secretFound: (secretId: string) => {
    const state = getDiscoveryState();
    if (!state.secretsFound.includes(secretId)) {
      saveDiscoveryState({ secretsFound: [...state.secretsFound, secretId] });
    }
  },
  unlockNamelessSpiral: () => {
    saveDiscoveryState({ discoveredNamelessSpiral: true });
  },
  addTheory: (questionId: string, theory: string) => {
    const state = getDiscoveryState();
    const existing = state.userTheories.filter((t) => t.questionId !== questionId);
    saveDiscoveryState({
      userTheories: [
        ...existing,
        { questionId, theory, timestamp: new Date().toISOString() },
      ],
    });
  },
  resetAll: () => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('spiral_discovery_update', { detail: defaultState }));
  },
};
