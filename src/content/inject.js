import { 
  getWaveformElement,
  getPositionText,
  parseTimelineTextToSeconds,
  seek,
  gritter
} from './sc';

if (process.env.NODE_ENV !== 'production') {
  window.seek = function(fraction) {
    seek(getWaveformElement(), fraction);
  };
}

const handleMessage = function(event) {
  const { extension, elapsedToLoadNormalized, elapsedToLoad } = event.data;
  if (extension === 'soundcloud-remember-position') {
    const waveformElement = getWaveformElement();
    if (waveformElement) {
      const magicNumber = 500;
      const code = () => {
        const currentElapsed = parseTimelineTextToSeconds(getPositionText());
        if (currentElapsed < elapsedToLoad) {
          seek(waveformElement, elapsedToLoadNormalized);
          setTimeout(code, magicNumber)
        } else {
          gritter(elapsedToLoad);
        }
      };
      
      setTimeout(code, magicNumber);
    }
  }
};

window.addEventListener('message', handleMessage, false);
