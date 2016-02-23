import URI from 'urijs';
import { storePagePosition, loadPagePosition } from './chrome';
require('file?name=manifest.json!./../manifest.json');

function getPositionText() {
  return document.querySelector('.playbackTimeline__timePassed > span:last-child').textContent;
}

function getDurationText() {
  return document.querySelector('.playbackTimeline__duration > span:last-child').textContent;
}

function getPlayControlsSongLinkElement() {
  return document.querySelector('a.playbackSoundBadge__title.sc-truncate');
}

function parseTextToSeconds(text) {
  const nums = text.split(':')
      .map(function(s) {
        return parseInt(s, 10);
      });

  let hms;
  if (nums.length === 2) {
    const newArr = nums.slice(0);
    newArr.unshift(0);
    hms = newArr;
  } else {
    hms = nums;
  }

  const [hours, mins, secs] = hms;
  return (hours * 60 * 60) + (mins * 60) + secs;
}

window.setInterval(() => {
  const controls = getPlayControlsSongLinkElement();
  if (controls) {
    const key = new URI(controls.href).pathname();
    var seconds = parseTextToSeconds(getPositionText());
    storePagePosition(key, seconds).then(() => {
      return loadPagePosition(key);
    });
  }
}, 1000);

const controls = getPlayControlsSongLinkElement();
if (controls) {
  const key = new URI(controls.href).pathname();
  loadPagePosition(key).then(function (pos) {
    console.log('Last known position was', pos);
    const duration = parseTextToSeconds(getDurationText());
    var s = document.createElement('script');
    s.src = chrome.extension.getURL('inject.js');
    (document.head || document.documentElement).appendChild(s);
    s.onload = function () {
      window.postMessage({extension: 'soundcloud-remember-position', div: pos / duration}, '*');
      s.parentNode.removeChild(s);
    };
  });
}
