# <img src="public/icons/icon_48.png" width="45" align="left"> Captions Summarizer

# YouTube Video Summarizer Chrome Extension

A Chrome extension that generates concise summaries of YouTube videos using AI technology. This tool helps users quickly understand the main points of a video without watching the entire content.

## Features

- **Video Summarization**: Generate AI-powered summaries of YouTube videos directly from the video page
- **Summary Library**: Save and manage your video summaries for future reference
- **Easy Access**: Quick access through the Chrome extension popup
- **BYOK**: Bring Your Own Key for LLM, currently supports OpenAI API
- **Languages support**: Currently supports English


## Installation

1. Clone this repository

2. Load the extension in Chrome:
- Open Chrome and navigate to `chrome://extensions/`
- Enable "Developer mode" in the top right
- Click "Load unpacked" and select the ./build direction

3. (not implemented yet) Optionally, choose your own OpenAI model in ./build/config.js; by default GPT-4o is being used 
```
OPENAI_MODEL: 'gpt-4o'

```
4. Set up Open AI Api Key
Click the Settings cog in top right corner and set up your API Key.

## Usage

1. **Generate a Summary**:
   - Navigate to any YouTube video
   - Click the extension icon in your Chrome toolbar
   - Click the "Summarize" button
   - Wait for the AI to generate the summary

2. **Save Summaries**:
   - After generating a summary, click the "Save" button to store it
   - Saved summaries can be accessed later through the library

3. **Access Library**:
   - Click the extension icon
   - Click "Go to Library"
   - View all your saved summaries
   - Delete unwanted summaries using the delete button




## Known bugs
```
Uncaught ReferenceError: s is not defined
    at contentScript.js:57:57
    at contentScript.js:98:12
```
This console error appears in various pages other than youtube.com


## Roadmap
- Storing saved summaries on the Supabase DB Server
- Implementing model selection