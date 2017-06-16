export function getPositionText() {
  return document.querySelector('.playbackTimeline__timePassed > span:last-child').textContent;
}

export function getDurationText() {
  return document.querySelector('.playbackTimeline__duration > span:last-child').textContent;
}

export function getPlayControlsSongLinkElement() {
  return document.querySelector('a.playbackSoundBadge__titleLink.sc-truncate');
}

export function getWaveformElement() {
  return document.querySelector('div.playbackTimeline__progressWrapper');
}

export function seek(waveformElement, elapsedNormalized)  {
  const { left, width } = waveformElement.getBoundingClientRect();

  const magicNumber = 5;
  const clientX = left + (width * elapsedNormalized) + magicNumber;

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

export function gritter(seconds) {
  const removeGritter = () => {
    const gritter = document.getElementById('soundcloud-remember-position-gritter');
    if (gritter) {
      gritter.parentNode.removeChild(gritter);
    }
  };

  removeGritter();
  
  const pretty = Math.floor(seconds / 60) + ':' + ('0' + (seconds % 60).toString()).slice(-2);
  const gritter =
    `<div id="gritter-notice-wrapper" class="top-right">
      <div id="soundcloud-remember-position-gritter" class="gritter-item-wrapper big-success gritter-trinity-stop">
        <div class="gritter-top"></div>
        <div class="gritter-item">
          <div class="gritter-close"></div>
          <div class="gritter-without-image"><p>Playback was resumed at ${pretty}</p></div>
          <div style="clear:both"></div>
        </div>
        <div class="gritter-bottom"></div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', gritter);
  setTimeout(removeGritter, 5000)
}
