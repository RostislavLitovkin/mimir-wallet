// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PrecacheEntry } from 'workbox-precaching/_types';

export function isDevelopment() {
  return Boolean(
    self.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address
      self.location.hostname === '[::1]' ||
      // 127.0.0.0/8 are considered localhost for IPv4
      self.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  );
}

export function isAppMimir({ hostname }: { hostname: string }): boolean {
  return hostname === 'app.mimir.global';
}

export function isDevMimir({ hostname }: { hostname: string }): boolean {
  return hostname === 'dev.mimir.global';
}

type GroupedEntries = { onDemandEntries: (string | PrecacheEntry)[]; precacheEntries: PrecacheEntry[] };

/**
 * Splits entries into on-demand and precachable entries.
 * Effectively, splits out index.html as the only precachable entry.
 */
export function groupEntries(entries: (string | PrecacheEntry)[]): GroupedEntries {
  return entries.reduce<GroupedEntries>(
    ({ onDemandEntries, precacheEntries }, entry) => {
      console.log(entry);

      if (typeof entry === 'string' || entry.url.includes('/media/')) {
        return { precacheEntries, onDemandEntries: [...onDemandEntries, entry] };
      } else if (entry.revision) {
        // index.html should be the only non-media entry with a revision, as code chunks have a hashed URL.
        return { precacheEntries: [...precacheEntries, entry], onDemandEntries };
      } else {
        return { precacheEntries, onDemandEntries: [...onDemandEntries, entry] };
      }
    },
    { onDemandEntries: [], precacheEntries: [] }
  );
}

export async function deleteUnusedCaches(caches: CacheStorage, { usedCaches }: { usedCaches: string[] }) {
  const cacheKeys = await caches.keys();

  cacheKeys.filter((key) => !usedCaches.includes(key)).forEach((key) => caches.delete(key));
}
