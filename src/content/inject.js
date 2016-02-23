
function getWaveformElement() {
  return document.querySelector('div.waveform__layer.waveform__scene');
}

function seek(waveformElement, div)  {
  const { left, right } = waveformElement.getBoundingClientRect();
  const clickX = div * (right - left);

  const d = new window.Event('mousedown');
  d.pageX = left + clickX;
  d.offsetX = 0;
  d.offsetY = 0;
  const u = new window.Event('mouseup');

  waveformElement.dispatchEvent(d);
  waveformElement.dispatchEvent(u);
}

window.addEventListener("message", function(event) {
  const { extension, div } = event.data;
  if (extension === 'soundcloud-remember-position') {
    var waveformElement = getWaveformElement();
    if (waveformElement) {
      seek(waveformElement, div)
    }
  }
}, false);
