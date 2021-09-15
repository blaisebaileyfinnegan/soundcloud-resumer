import { storePagePosition, loadPagePosition } from "./chrome";
import {
  getDurationSeconds,
  getPositionSeconds,
  getPlayControlsSongLinkElement,
  getProgressBarElement,
  seek,
  gritter,
  isPlaying,
} from "./sc";

const MagicTimeout = 1500;
const ThinkInterval = 1000;
const MinDuration = 300;

function attemptSeek(position, secondsElapsed) {
  const progressBarElement = getProgressBarElement();
  if (progressBarElement) {
    const inner = () => {
      seek(progressBarElement, position);
      gritter(secondsElapsed);
    };

    setTimeout(inner, MagicTimeout);
  }
}

function load(key) {
  loadPagePosition(key).then(function (secondsElapsed) {
    if (secondsElapsed) {
      const duration = getDurationSeconds();
      const position = secondsElapsed / duration;
      const isValid = position < 1;

      const timeRemaining = duration - secondsElapsed;
      const shouldSeek = timeRemaining > 10;

      console.log(`elapsed: ${secondsElapsed} shouldSeek: ${shouldSeek}`);

      if (isValid && shouldSeek) {
        attemptSeek(position, secondsElapsed);
      }
    }
  });
}

/**
 * Poll for the current track name every second, triggering a load if the detected track changes
 *
 * @param previousState output from last think call
 */
function think(previousState) {
  const { lastLoadedTrackKey } = previousState;
  const controls = getPlayControlsSongLinkElement();
  let finalState;

  // control bar must be present
  if (controls) {
    const currentTrackKey = new URL(controls.href).pathname;

    const elapsed = getPositionSeconds();
    const duration = getDurationSeconds();

    const songQualifies = duration > MinDuration;
    // Song must be >5 min long
    if (songQualifies) {
      const isNewTrack = lastLoadedTrackKey !== currentTrackKey;
      if (isNewTrack) {
        // Load the track
        console.log(`Loading track position for ${currentTrackKey}`);
        load(currentTrackKey);

        finalState = {
          lastLoadedTrackKey: currentTrackKey,
        };
      } else if (isPlaying()) {
        // Save the current track's position
        console.log(
          `Saving track position key: ${currentTrackKey} seconds: ${elapsed}`
        );
        storePagePosition(currentTrackKey, elapsed);

        finalState = {
          lastLoadedTrackKey,
        };
      } else {
        finalState = {
          lastLoadedTrackKey,
        };
      }
    } else {
      finalState = { lastLoadedTrackKey: null };
    }
  } else {
    finalState = { lastLoadedTrackKey: null };
  }

  window.setTimeout(think.bind(null, finalState), ThinkInterval);
}

function init() {
  window.setTimeout(think.bind(null, { lastLoadedTrackKey: null }), 1000);
}

init();
