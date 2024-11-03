'use strict';

import './popup.css';
import './lib/marked.min.js';


// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
  chrome.storage.sync.get(
      { openaiApiKey: '' },
      function(items) {
          document.getElementById('apiKey').value = items.openaiApiKey;
          displayMaskedKey(items.openaiApiKey);
      }
  );
}


document.addEventListener('DOMContentLoaded', function() {
  const summarizeBtn = document.getElementById('summarizeBtn');
  const summaryDiv = document.getElementById('summary');
  const saveButton = document.getElementById('saveButton');

  saveButton.style.display = 'none';

  //let videoSummary = '';
  let videoSummary = {
    title : '',
    summary : ''
  }

  summarizeBtn.addEventListener('click', function() {
      summarizeBtn.disabled = true;
      summaryDiv.textContent = 'Summarizing...';
      saveButton.style.display = 'none';

      chrome.runtime.sendMessage({action: "summarize"}, function(response) {
          summarizeBtn.disabled = false;
          if (response && response.summary) {
              videoSummary.title = response.title;
              videoSummary.slug = response.slug;
              videoSummary.summary = marked.parse(response.summary);
              saveButton.style.display = 'block';
              document.getElementById('summary').innerHTML = videoSummary.summary;
              //summaryDiv.textContent = videoSummary.summary;
              
              
          } else {
              summaryDiv.textContent = 'Error: Could not generate summary.';
              saveButton.style.display = 'none';
          }
      });

      
  });

  saveButton.addEventListener('click', function() {
    chrome.runtime.sendMessage({action: "saveVideoSummary", videoSummary: videoSummary}, function(response) {
      if(response && response.key) {
        saveButton.textContent = 'Saved!';
        saveButton.style.backgroundColor = 'green';
        saveButton.style.color = 'white';
        saveButton.disabled = true;
        // setTimeout(() => {
        //   saveButton.textContent = 'Save Summary';
        //   saveButton.disabled = false;
        // }, 2000);
      } else {
        console.error('Error saving summary');
        saveButton.textContent = 'Error Saving';
        setTimeout(() => {
          saveButton.textContent = 'Save Summary';
        }, 2000);
      }
    })
  })
});

document.querySelector('#go-to-options').addEventListener('click', function() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});

document.querySelector('#go-to-library').addEventListener('click', function() {
  if (chrome.runtime.openLibraryPage) {
    chrome.runtime.openLibraryPage();
  } else {
    window.open(chrome.runtime.getURL('library.html'));
  }
})
/*



(function () {
  // We will make use of Storage API to get and store `count` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage

  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions
  const counterStorage = {
    get: (cb) => {
      chrome.storage.sync.get(['count'], (result) => {
        cb(result.count);
      });
    },
    set: (value, cb) => {
      chrome.storage.sync.set(
        {
          count: value,
        },
        () => {
          cb();
        }
      );
    },
  };

  function setupCounter(initialValue = 0) {
    document.getElementById('counter').innerHTML = initialValue;

    document.getElementById('incrementBtn').addEventListener('click', () => {
      updateCounter({
        type: 'INCREMENT',
      });
    });

    document.getElementById('decrementBtn').addEventListener('click', () => {
      updateCounter({
        type: 'DECREMENT',
      });
    });
  }

  function updateCounter({ type }) {
    counterStorage.get((count) => {
      let newCount;

      if (type === 'INCREMENT') {
        newCount = count + 1;
      } else if (type === 'DECREMENT') {
        newCount = count - 1;
      } else {
        newCount = count;
      }

      counterStorage.set(newCount, () => {
        document.getElementById('counter').innerHTML = newCount;

        // Communicate with content script of
        // active tab by sending a message
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tab = tabs[0];

          chrome.tabs.sendMessage(
            tab.id,
            {
              type: 'COUNT',
              payload: {
                count: newCount,
              },
            },
            (response) => {
              console.log('Current count value passed to contentScript file');
            }
          );
        });
      });
    });
  }

  function restoreCounter() {
    // Restore count value
    counterStorage.get((count) => {
      if (typeof count === 'undefined') {
        // Set counter value as 0
        counterStorage.set(0, () => {
          setupCounter(0);
        });
      } else {
        setupCounter(count);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', restoreCounter);

  // Communicate with background file by sending a message
  chrome.runtime.sendMessage(
    {
      type: 'GREETINGS',
      payload: {
        message: 'Hello, my name is Pop. I am from Popup.',
      },
    },
    (response) => {
      console.log(response.message);
    }
  );
})();
*/