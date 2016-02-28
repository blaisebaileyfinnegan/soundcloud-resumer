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
      setTimeout(() => seek(waveformElement, fraction), 0);
    }
  }
};

window.addEventListener('message', handleMessage, false);
