import Promise from 'bluebird';
export function storePagePosition(key, seconds) {
  return new Promise(function(resolve) {
    chrome.storage.local.set({
      [key]: seconds
    }, resolve);
  });
}

export function loadPagePosition(key) {
  return new Promise(function(resolve) {
    chrome.storage.local.get(key, function(posObj) {
      resolve(posObj[key]);
    });
  });
}

