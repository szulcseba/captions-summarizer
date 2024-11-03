'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

let openaiApiKey = null;

const lang = 'en';

import supabase  from './src/supabase_client';

const { getSubtitles, getVideoDetails } = require('youtube-caption-extractor');
chrome.storage.sync.get(['openaiApiKey'], function(result) {
  if (result.openaiApiKey) {
      openaiApiKey = result.openaiApiKey;
      console.log(openaiApiKey);
      // Use the API key here
  } else {
      console.log('API Key not found');
  }
});
const OpenAI = require('openai');

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);



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

        let VideoDetails = await getVideoDetails({videoID, lang});
        /* mock data - change to config env */
        // let summary = 'mock summary;'
        // let Video = {
        //   summary: summary,
        //   title: VideoDetails.title
        // }

        
        /* end mock data */

        const openai = new OpenAI({apiKey: openaiApiKey});

        let subtitles = video.map(item => item.text).join(' ');
        let completion = await openai.chat.completions.create({
          messages: [
                      { role: "system", content: "Provide me a summary with key learnings from a youtube video based on subtitles sent by a user."}   ,
                      { role: "user", content:  subtitles } ]  ,
    
          model: "gpt-4o-mini",
        }); 
        
        let Video = {
          summary: completion.choices[0].message.content,
          title: VideoDetails.title
        }


        

        //return completion.choices[0].message.content;
        return Video;


        // await getVideoSummaryByKey('20ef9a23', function(result) {
        //   console.log("Summary", result);
        // })


        
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
        let url = tabs[0].url; //TODO: FIX error

        let slug = getParam('v', url);

        summarizeVideo(slug).then((response) => {
            console.log("success");
            sendResponse({summary: response.summary, title: response.title, slug: response.slug});
        });
        


    });
    return true;  // Indicates we will send a response asynchronously
  } else if (request.action === "saveVideoSummary") {
    
    saveVideoSummary(request.videoSummary).then(key => {
      sendResponse({key: key});
    });
    return true;  // Indicates we will send a response asynchronously

  }
});


// helper function to generate a unique key
function generateUniqueKey(summaryText) {
  // Using a simple hash function with SHA-256 and Base64 encoding
  const currentDate = new Date().toISOString();
  const textToHash = summaryText + currentDate;
  
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(textToHash))
      .then(hashBuffer => {
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          return hashHex.substring(0, 8); // Shorten to first 8 characters for a "slug"
      });
}

// saves video summary to chrome storage
function saveVideoSummary(videoSummary) {
  return generateUniqueKey(videoSummary.summary).then(key => {
    chrome.storage.sync.get({ VideoSummary: {} }, function (result) {
      let summaries = result.VideoSummary;
      console.log('title' + videoSummary.title);
      summaries[key] = {
        title: videoSummary.title,
        summary: videoSummary.summary
      };
      chrome.storage.sync.set({ VideoSummary: summaries }, function() {
        console.log('New video summary saved with key', key); ///TODO REMOVE IT IN REFACTOR!
      });
    });
    return key;
  });
}

async function saveVideoSummarySupabase(videoSummary) {
  try {
    const { data, error } = await supabase
      .from('summarized_videos')
      .insert([
        { 
          title: videoSummary.title, 
          summary: videoSummary.summary 
        }
      ])
      .select();

    if (error) throw error;

    console.log('Video summary saved to Supabase:', data);
    return data[0].id; // Assuming the table has an 'id' column
  } catch (error) {
    console.error('Error saving video summary to Supabase:', error);
    throw error;
  }
}

function getVideoSummaries(callback) {
  chrome.storage.sync.get({ VideoSummary: {} }, function (result) {
    callback(result.VideoSummary);
  })
}

function getVideoSummaryByKey(key, callback) {
  chrome.storage.sync.get({ VideoSummary: {} }, function (result) {
      const summaries = result.VideoSummary;
      if (summaries.hasOwnProperty(key)) {
          callback(summaries[key]);
      } else {
          callback(null); // Return null if key doesn't exist
      }
  });
}

function deleteVideoSummary(key, callback) {

}


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
