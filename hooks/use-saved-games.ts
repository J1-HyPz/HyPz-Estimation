'use client';

import { useMemo, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'gametrack:saved-games';
const EMPTY_SNAPSHOT = '[]';
const listeners = new Set<() => void>();

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) ?? EMPTY_SNAPSHOT;
}

function getServerSnapshot() {
  return EMPTY_SNAPSHOT;
}

function subscribe(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      listener();
    }
  };

  listeners.add(listener);
  window.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

function readIds(snapshot: string) {
  try {
    const value = JSON.parse(snapshot) as unknown;
    return Array.isArray(value) &&
      value.every((item) => typeof item === 'string')
      ? value
      : [];
  } catch {
    return [];
  }
}

export function useSavedGames() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const savedGameIds = useMemo(() => readIds(snapshot), [snapshot]);

  const toggleSavedGame = (gameId: string) => {
    const current = readIds(getSnapshot());
    const next = current.includes(gameId)
      ? current.filter((id) => id !== gameId)
      : [...current, gameId];

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    listeners.forEach((listener) => listener());
  };

  return {
    savedGameIds,
    isSaved: (gameId: string) => savedGameIds.includes(gameId),
    toggleSavedGame,
  };
}
