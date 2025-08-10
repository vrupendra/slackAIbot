# Slack AI Incident Management Bot

An intelligent Slack bot that helps manage incidents with AI-powered analysis, Jira integration, and Confluence documentation.

## Features

- 🤖 AI-powered incident analysis using GPT-4
- 📊 Automated incident summaries
- ⏱️ Timeline generation
- 📝 Root Cause Analysis (RCA) report generation
- 🎫 Jira ticket creation and management
- 📄 Confluence documentation integration
- 🔄 Real-time updates and notifications

## Prerequisites

- Node.js (v16 or higher)
- A Slack workspace with admin access
- OpenAI API access with GPT-4 capability
- Jira and Confluence accounts (optional)

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
   - Fill in your credentials:
     ```env
     # Slack Configuration
     SLACK_BOT_TOKEN=xoxb-your-bot-token
     SLACK_SIGNING_SECRET=your-signing-secret
     SLACK_APP_TOKEN=xapp-your-app-token
     SUMMARY_CHANNEL_ID=channel-id-for-summaries

     # OpenAI Configuration
     OPENAI_API_KEY=your-openai-api-key

     # Jira Configuration (Optional)
     JIRA_HOST=your-jira-instance.atlassian.net
     JIRA_EMAIL=your-email@company.com
     JIRA_API_TOKEN=your-jira-api-token
     JIRA_PROJECT_KEY=your-project-key

     # Confluence Configuration (Optional)
     CONFLUENCE_BASE_URL=your-confluence-instance.atlassian.net
     CONFLUENCE_EMAIL=your-email@company.com
     CONFLUENCE_API_TOKEN=your-confluence-api-token
     CONFLUENCE_SPACE_KEY=your-space-key
     CONFLUENCE_PARENT_PAGE_ID=optional-parent-page-id
     ```

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

The bot provides several slash commands for incident management:

- `/summarize` - Generate an AI-powered summary of the incident discussion
- `/timeline` - Create a chronological timeline of the incident
- `/rca` - Generate a detailed Root Cause Analysis report
- `/create-ticket` - Create a Jira ticket with incident details
- `/create-confluence` - Create a Confluence page with the RCA report

### Example Workflow

1. Create an incident channel
2. Invite the bot to the channel
3. During/after the incident:
   - Use `/summarize` to get a quick overview
   - Use `/timeline` to see the sequence of events
   - Use `/rca` to generate a detailed analysis
   - Use `/create-ticket` to track in Jira
   - Use `/create-confluence` to document in Confluence

## Development

### Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm start` - Start the production server
- `npm run build` - Build the TypeScript code
- `npm run type-check` - Check TypeScript types
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

### Project Structure

```
src/
├── app.ts              # Main application file
├── commands/          # Slack command handlers
├── integrations/      # Third-party service integrations
├── services/         # Core business logic services
└── types/            # TypeScript type definitions
```

### CI/CD

The repository is configured with GitHub Actions for:
- Automated testing
- Code quality checks
- Security scanning
- Dependency updates
- Automated deployments

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the ISC License.
