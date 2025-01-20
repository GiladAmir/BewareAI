# BewereAI Prompt Monitor Extension

This Chrome extension monitors user prompts on the chat.openai.com website and blocks actions that may involve sending sensitive information. The extension intercepts the send button's click event and provides feedback, including an option to force the message to be sent even when high-severity data leakage is detected.

## Features
* Monitors prompt messages entered in the ChatGPT interface.
* Blocks actions with sensitive prompts.
* Allows forcing the message to be sent regardless of data leakage severity.
* Sends prompts to an AI model for further analysis.

## Next Assignments
* Extract the prompt message into a variable in the content.js file so that we can monitor it and send it to our AI model.
* Add an option to force sending messages, even if there is a high severity for data leakage.
* Add an icon to the manifest file so that the extension will display with our logo.