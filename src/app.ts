import { App } from '@slack/bolt';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Slack app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Listen for messages
app.message(async ({ message, say }) => {
  try {
    // Only respond to messages that are text messages
    if (!('text' in message)) return;

    // Generate response using OpenAI
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message.text }
      ],
    });

    // Send the response back to Slack
    const response = completion.data.choices[0]?.message?.content || "I'm not sure how to respond to that.";
    await say(response);

  } catch (error) {
    console.error('Error:', error);
    await say("Sorry, I encountered an error processing your request.");
  }
});

// Start the app
(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running!');
  } catch (error) {
    console.error('Error starting app:', error);
  }
})();
