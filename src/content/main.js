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
  loadPagePosition(key).then(function(pos) {
    if (pos) {
      const duration = parseTimelineTextToSeconds(getDurationText());
      const fraction = pos / duration;
      if (fraction < 1) {
        sendSeekMessage(fraction)
      }
    }
  });
}

function sendSeekMessage(fraction) {
  window.postMessage({ extension: 'soundcloud-remember-position', fraction }, '*');
}

function injectScript(url) {
  var s = document.createElement('script');
  s.src = url;
  (document.head || document.documentElement).appendChild(s);
}

injectScript(chrome.extension.getURL('inject.js'));

let lastKey;
function loadOrSave(shouldSave) {
  const controls = getPlayControlsSongLinkElement();
  if (controls) {
    const key = new URI(controls.href).pathname();
    const seconds = parseTimelineTextToSeconds(getPositionText());
    const duration = parseTimelineTextToSeconds(getDurationText());
    const minDuration = 60;
    if (duration > minDuration) {
      if (lastKey !== key && seconds < 3) {
        load(key, controls);
      } else if (shouldSave) {
        storePagePosition(key, seconds);
      }
    }

    lastKey = key;
  } else {
    lastKey = null;
  }
}

loadOrSave(false);
window.setInterval(loadOrSave.bind(null, true), 1000);

