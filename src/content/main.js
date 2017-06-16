import URI from 'urijs';
import { storePagePosition, loadPagePosition } from './chrome';
import {
  getPositionText,
  getDurationText,
  getPlayControlsSongLinkElement,
  parseTimelineTextToSeconds
} from './sc';

require('file?name=manifest.json!./../manifest.json');

function load(key) {
  loadPagePosition(key).then(function(elapsedToLoad) {
    if (elapsedToLoad) {
      const duration = parseTimelineTextToSeconds(getDurationText());
      const elapsedToLoadNormalized = elapsedToLoad / duration;
      const isValid = elapsedToLoadNormalized < 1;

      const timeRemaining = duration - elapsedToLoad;
      const shouldSeek = timeRemaining > 10;

      console.log(`timeRemaining: ${timeRemaining} shouldSeek: ${shouldSeek}`);

      if (isValid && shouldSeek) {
        sendSeekMessage({ elapsedToLoadNormalized, elapsedToLoad })
      }
    }
  });
}

function sendSeekMessage(opts) {
  window.postMessage(Object.assign({ extension: 'soundcloud-remember-position' }, opts), '*');
}

function injectScript(url) {
  const s = document.createElement('script');
  s.src = url;
  (document.head || document.documentElement).appendChild(s);
}

injectScript(chrome.extension.getURL('inject.js'));

let lastKey;
function loadOrSave(shouldSave) {
  const controls = getPlayControlsSongLinkElement();
  if (controls) {
    const key = new URI(controls.href).pathname();
    const elapsed = parseTimelineTextToSeconds(getPositionText());
    const duration = parseTimelineTextToSeconds(getDurationText());
    const minDuration = 60;
    if (duration > minDuration) {
      const isPlayingNewTrack = lastKey !== key;
      const remaining = duration - elapsed;
      const shouldLoad = elapsed < 3 && remaining > 5;
      if (isPlayingNewTrack && shouldLoad) {
        console.log("Loading track position (if available)");
        load(key);
      } else if (!isPlayingNewTrack && shouldSave) {
        console.log(`Saving track position key: ${key} seconds: ${elapsed}`);
        storePagePosition(key, elapsed);
      }
    }

    lastKey = key;
  } else {
    lastKey = null;
  }
}

loadOrSave(false);
window.setInterval(loadOrSave.bind(null, true), 1000);

