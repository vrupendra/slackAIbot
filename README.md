# Slack AI Bot

A Slack bot that integrates with OpenAI's GPT to provide AI-powered responses in your Slack workspace.

## Features

- Responds to messages in Slack using OpenAI's GPT
- Real-time message processing
- Easy to customize and extend

## Prerequisites

- Node.js (v14 or higher)
- A Slack workspace with admin access
- An OpenAI API key

## Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd slackAIbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Fill in your Slack and OpenAI credentials:
     - `SLACK_BOT_TOKEN`: Your Slack bot user token
     - `SLACK_SIGNING_SECRET`: Your Slack app signing secret
     - `SLACK_APP_TOKEN`: Your Slack app-level token
     - `OPENAI_API_KEY`: Your OpenAI API key

4. **Create a Slack App**
   - Go to [Slack API](https://api.slack.com/apps)
   - Create a new app
   - Enable Socket Mode
   - Add bot token scopes:
     - `app_mentions:read`
     - `chat:write`
     - `im:history`
     - `im:write`
     - `messages:read`
   - Install the app to your workspace
   - Copy the tokens to your `.env` file

5. **Start the bot**
   ```bash
   # For development
   npm run dev

   # For production
   npm run build
   npm start
   ```

## Usage

Once the bot is running and properly configured, it will respond to any messages sent in channels where it's invited. The bot uses OpenAI's GPT model to generate responses.

To interact with the bot:
1. Invite the bot to a channel
2. Send a message
3. The bot will process your message and respond with an AI-generated reply

## Development

- `npm run dev` - Start the bot in development mode with hot-reload
- `npm run build` - Build the TypeScript code
- `npm start` - Start the bot in production mode

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the ISC License.
