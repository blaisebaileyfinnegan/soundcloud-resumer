import { 
  getWaveformElement,
  getPositionText,
  parseTimelineTextToSeconds,
  seek,
  gritter
} from './sc';


if (process.env.NODE_ENV !== 'production') {
  window.seek = function (fraction) {
    seek(getWaveformElement(), fraction);
  };
}

var handleMessage = function(event) {
  const { extension, fraction, pos } = event.data;
  if (extension === 'soundcloud-remember-position') {
    var waveformElement = getWaveformElement();
    if (waveformElement) {
      const magicNumber = 500;
      const code = () => {
        const seconds = parseTimelineTextToSeconds(getPositionText());
        if (seconds < pos) {
          seek(waveformElement, fraction);
          setTimeout(code, magicNumber)
        } else {
          gritter(pos);
        }
      };
      
      setTimeout(code, magicNumber);
    }
  }
};

window.addEventListener('message', handleMessage, false);
