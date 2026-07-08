# Changelog

## 0.7.2
- Fixed settings sheet on installed mobile PWA: tapping the gear (or the wordmark) threw a TypeError because the "Continuous Mic Conversation" select was added to the sheet but never registered on the `els` element map, so `openSettings()` / `saveSettings()` crashed on `els.continuous.value` and the sheet never opened or saved. Registered `els.continuous` and settings works again on installed home-screen apps.
- Service worker switched to network-first for the app shell (index.html, manifest.json, service-worker.js and navigation requests) with cache fallback for offline. Installed PWAs now pick up fixes on the next launch instead of being pinned to whatever cached version they were installed with.
- Version and cache bumped to 0.7.2 so the new service worker actually activates and cleans out the old cache.

## 0.7.1
- New homescreen icon set: "Molten Core," an organic ember-particle burst built from the same randomized spike-angle/length/twinkle math as the live app core (not hand-drawn spokes), with a real bloom/glow pass baked in. Replaces the old two-chevron mark left over from before the Ember Core redesign.
- Regenerated at every size the app uses: favicon, apple-touch-icon, 64/180/192/512, plus a refreshed icon.svg source.
- Service worker cache and manifest version bumped so installed PWAs actually pick up the new icon instead of showing the old cached one.

## 0.7.0
- Renamed the app from Kyo to Winston (easier to say and for speech recognition to catch, which is what prompted it). Updated everywhere user-facing: title, wordmark, aria-labels, status text, persona name, greeting, hands-free wake word ("hey Winston" — with common mishearings like Weston/Winsten/Whinston covered), manifest, README.
- Saved se