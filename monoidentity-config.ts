const isObsidian = (path: string) =>
  path.startsWith('Obsidian') &&
  !path.includes('.obsidian') &&
  (path.endsWith('.md') || path.endsWith('.excalidraw'));
export const MONOIDENTITY_APP_ID = 'cobblestone';
export const MONOIDENTITY_SYNC_FOR = (path: string) =>
  isObsidian(path) ? { mode: 'debounced', debounceMs: 5000 } : undefined;
