'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

let openaiApiKey = null;

const lang = 'en';

const { getSubtitles, getVideoDetails } = require('youtube-caption-extractor');
chrome.storage.sync.get(['openaiApiKey'], function(result) {
  if (result.openaiApiKey) {
      console.log('API Key retrieved:'+result.openaiApiKey);
      openaiApiKey = result.openaiApiKey;
      // Use the API key here
  } else {
      console.log('API Key not found');
  }
});
const OpenAI = require('openai');

const server_url = 'http://localhost:3003/';
// this function should communicate with OpenAI API and return summarized video
async function summarizeVideo(videoID) {
  
  // console.log("Sending video details to backend for summarization:", videoID);
  
  // const apiUrl = server_url + 'generate_subtitles?slug=' + videoID;

class MockAIResponse {
    constructor(data) {
        this.message = { 
            content: data
        };
    }
}
  
  try {
        let video = await getSubtitles({videoID, lang});
        const openai = new OpenAI({apiKey: openaiApiKey});
        console.log(video.text);

        /*
          wysłać zapytanie do OpenAI
        */

        console.log(openaiApiKey+'aaa');

        let subtitles = video.map(item => item.text).join(' ');
        let completion = await openai.chat.completions.create({
          messages: [
                      { role: "system", content: "Provide me a summary with key learnings from a youtube video based on subtitles sent by a user."}   ,
                      { role: "user", content:  subtitles } ]  ,
    
          model: "gpt-4o-mini",
        });
        
        console.log(completion.choices[0].message.content);
        
        return completion.choices[0].message.content;

        
       /*
        let mockData = new MockAIResponse('this is a mock response');
        console.log(mockData.content);
        return mockData.content; */

        
  } catch (error) {
    console.error("Error while generating summary:", error);
    return `Error: Could not generate summary. ${error.message}`;
  }

}



// getParam is a helper extracting params from an url
function getParam( name, url) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  return results == null ? null : results[1];
}

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
/*
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GREETINGS') {
    const message = `Hi ${
      sender.tab ? 'Con' : 'Pop'
    }, my name is Bac. I am from Background. It's great to hear from you.`;

    // Log message coming from the `request` parameter
    console.log(request.payload.message);
    // Send a response message
    sendResponse({
      message,
    });
  }
}); */
