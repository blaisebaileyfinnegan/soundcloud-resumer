export function getPositionText() {
  return document.querySelector('.playbackTimeline__timePassed > span:last-child').textContent;
}

export function getDurationText() {
  return document.querySelector('.playbackTimeline__duration > span:last-child').textContent;
}

export function getPlayControlsSongLinkElement() {
  return document.querySelector('a.playbackSoundBadge__title.sc-truncate');
}

export function isPlaying() {
  return Boolean(document.querySelector('header.playing'));
}

export function getWaveformElement() {
  return document.querySelector('div.playbackTimeline__progressWrapper');
}

export function seek(waveformElement, fraction)  {
  const { left, width } = waveformElement.getBoundingClientRect();

  const magicNumber = 5;
  const clientX = left + (width * fraction) + magicNumber;

  const downEvent = new window.MouseEvent('mousedown', { bubbles: true });
  const upEvent = new window.Event('mouseup');
  upEvent.clientX = clientX;

  waveformElement.dispatchEvent(downEvent);
  document.dispatchEvent(upEvent);
}

export function parseTimelineTextToSeconds(text) {
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
