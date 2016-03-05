import { getWaveformElement, seek } from './sc';

if (process.env.NODE_ENV !== 'production') {
  window.seek = function (fraction) {
    seek(getWaveformElement(), fraction);
  };
}

var handleMessage = function(event) {
  const { extension, fraction } = event.data;
  if (extension === 'soundcloud-remember-position') {
    var waveformElement = getWaveformElement();
    if (waveformElement) {
      // Dumb way of waiting for page scripts to finish
      const magicNumber = 2000;
      setTimeout(() => {
        seek(waveformElement, fraction);
      }, magicNumber);
    }
  }
};

window.addEventListener('message', handleMessage, false);
