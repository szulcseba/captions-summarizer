/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!******************************!*\
  !*** ./src/contentScript.js ***!
  \******************************/


// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

// Log `title` of current active web page
/*
const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
console.log(
  `Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
);

// Communicate with background file by sending a message
chrome.runtime.sendMessage(
  {
    type: 'GREETINGS',
    payload: {
      message: 'Hello, my name is Con. I am from ContentScript.',
    },
  },
  (response) => {
    console.log(response.message);
  }
);

// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'COUNT') {
    console.log(`Current count is ${request.payload.count}`);
  }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});
*/

/*
var s = document.createElement('script');
s.src = chrome.runtime.getURL('contentScript.js');
s.onload = function() { this.remove(); }; */
// see also "Dynamic values in the injected code" section in this answer
(document.head || document.documentElement).appendChild(s);


function getVideo() {
  const title = document.querySelector('h1.title').textContent;
  const description = document.querySelector('#description-text').textContent;
  const transcript = getTranscript(); // You'll need to implement this function
  return { title, description, transcript };
}

function getTranscript() {
  // This is a placeholder. Implementing transcript extraction is complex and depends on YouTube's structure
  // You might need to use YouTube's API or parse the page HTML
  return "Placeholder for video transcript";
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getVideoDetails") {
    const details = getVideo();
    sendResponse(details);
  }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarize") {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;

        let slug = getParam('v', url);

        summarizeVideo(slug).then((response) => {
            console.log("success");
            sendResponse({summary: response});
        });


    });
    return true;  // Indicates we will send a response asynchronously
  }
});
/******/ })()
;
//# sourceMappingURL=contentScript.js.map