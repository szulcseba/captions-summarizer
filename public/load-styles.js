// load-styles.js
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = chrome.runtime.getURL('styles.css');
document.head.appendChild(link);