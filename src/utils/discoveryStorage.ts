/**
 * User discovery and exploration tracking (Client-side private storage)
 * Respects user privacy: 0 telemetry, 100% localStorage.
 */

export type DiscoveryLevel = 'OBSERVING' | 'SEARCHING' | 'CONNECTED' | 'AWAKENED';

export interface DiscoveryState {
  chaptersRead: number[];
  archivesOpened: string[];
  mysteriesViewed: string[];
  sitesVisited: string[];
  secretsFound: string[];
  fragmentsFound: string[];
  userTheories: { questionId: string; theory: string; timestamp: string }[];
  discoveredNamelessSpiral: boolean;
  zeroRoomUnlocked: boolean;
  ciphersSolved: string[];
  investigationPinned: string[];
  introSeen: boolean;
  reducedMotion: boolean;
  audioZone: 'antarctica' | 'sub-ice' | 'spiral' | 'fracture' | 'timeless';
  detectiveMode: boolean;
  atmosphereEnabled: boolean;
  operatorCallsign: string;
}

const STORAGE_KEY = 'spiral_universe_discovery_v1';

const defaultState: DiscoveryState = {
  chaptersRead: [0],
  archivesOpened: [],
  mysteriesViewed: [],
  sitesVisited: ['antarctic_surface'],
  secretsFound: [],
  fragmentsFound: [],
  userTheories: [],
  discoveredNamelessSpiral: false,
  zeroRoomUnlocked: false,
  ciphersSolved: [],
  investigationPinned: [],
  introSeen: false,
  reducedMotion: false,
  audioZone: 'antarctica',
  detectiveMode: false,
  atmosphereEnabled: true,
  operatorCallsign: '',
};

export const calculateDiscoveryLevel = (state: DiscoveryState): DiscoveryLevel => {
  const score =
    state.chaptersRead.length * 2 +
    state.archivesOpened.length +
    state.fragmentsFound.length * 2 +
    state.mysteriesViewed.length +
    state.secretsFound.length * 3 +
    state.ciphersSolved.length * 2 +
    (state.discoveredNamelessSpiral ? 5 : 0) +
    (state.zeroRoomUnlocked ? 5 : 0);

  if (score >= 32) return 'AWAKENED';
  if (score >= 18) return 'CONNECTED';
  if (score >= 8) return 'SEARCHING';
  return 'OBSERVING';
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
  fragmentFound: (fragmentId: string) => {
    const state = getDiscoveryState();
    if (!state.fragmentsFound.includes(fragmentId)) {
      saveDiscoveryState({ fragmentsFound: [...state.fragmentsFound, fragmentId] });
    }
  },
  unlockNamelessSpiral: () => {
    saveDiscoveryState({ discoveredNamelessSpiral: true });
  },
  unlockZeroRoom: () => {
    saveDiscoveryState({ zeroRoomUnlocked: true });
  },
  setCallsign: (callsign: string) => {
    saveDiscoveryState({ operatorCallsign: callsign.trim() });
  },
  toggleDetectiveMode: (force?: boolean) => {
    const state = getDiscoveryState();
    const nextVal = typeof force === 'boolean' ? force : !state.detectiveMode;
    saveDiscoveryState({ detectiveMode: nextVal });
    return nextVal;
  },
  toggleAtmosphere: (force?: boolean) => {
    const state = getDiscoveryState();
    const nextVal = typeof force === 'boolean' ? force : !state.atmosphereEnabled;
    saveDiscoveryState({ atmosphereEnabled: nextVal });
    return nextVal;
  },
  cipherSolved: (cipherId: string) => {
    const state = getDiscoveryState();
    if (!state.ciphersSolved.includes(cipherId)) {
      saveDiscoveryState({ ciphersSolved: [...state.ciphersSolved, cipherId] });
    }
  },
  toggleInvestigationPin: (pinId: string) => {
    const state = getDiscoveryState();
    const exists = state.investigationPinned.includes(pinId);
    const updated = exists
      ? state.investigationPinned.filter((p) => p !== pinId)
      : [...state.investigationPinned, pinId];
    saveDiscoveryState({ investigationPinned: updated });
    return !exists;
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
