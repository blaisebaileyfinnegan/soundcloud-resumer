export function getPositionSeconds() {
  return parseInt(
    document.querySelector(".playbackTimeline__progressWrapper").attributes[
      "aria-valuenow"
    ].value
  );
}

export function getDurationSeconds() {
  return parseInt(
    document.querySelector(".playbackTimeline__progressWrapper").attributes[
      "aria-valuemax"
    ].value
  );
}

export function getPlayControlsSongLinkElement() {
  return document.querySelector("a.playbackSoundBadge__titleLink.sc-truncate");
}

export function getProgressBarElement() {
  return document.querySelector("div.playbackTimeline__progressWrapper");
}

export function isPlaying() {
  return document.querySelector("[title='Pause current']") !== null;
}

export function seek(progressBarElement, elapsedNormalized) {
  const { left, width } = progressBarElement.getBoundingClientRect();

  const clientX = left + width * elapsedNormalized;

  const params = {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX,
  };

  const mousedownEvent = new MouseEvent("mousedown", params);
  const mouseupEvent = new MouseEvent("mouseup", params);

  progressBarElement.dispatchEvent(mousedownEvent);
  document.dispatchEvent(mouseupEvent);
}

export function gritter(seconds) {
  const removeGritter = () => {
    const gritter = document.getElementById(
      "soundcloud-remember-position-gritter"
    );
    if (gritter) {
      gritter.parentNode.removeChild(gritter);
    }
  };

  removeGritter();

  const pretty =
    Math.floor(seconds / 60) +
    ":" +
    ("0" + (seconds % 60).toString()).slice(-2);
  const gritter = `<div id="gritter-notice-wrapper" class="top-right">
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

  document.body.insertAdjacentHTML("beforeend", gritter);
  setTimeout(removeGritter, 5000);
}
