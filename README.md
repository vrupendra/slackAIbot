# Slack AI Incident Management Bot

An intelligent Slack bot that helps manage incidents with AI-powered analysis, Jira integration, and Confluence documentation.

## Architecture

```mermaid
graph TD
    subgraph Slack Workspace
        SC[Slack Channels]
        SM[Slack Messages]
    end

    subgraph SlackAIBot
        direction TB
        APP[Application Core] --> CMD[Command Handlers]
        APP --> SERV[Services]
        
        subgraph Command Handlers
            CMD --> SUM[Summarize]
            CMD --> TL[Timeline]
            CMD --> RCA[RCA Generator]
            CMD --> JT[Jira Ticket]
            CMD --> CP[Confluence Page]
        end
        
        subgraph Services
            SERV --> AI[AI Service]
            SERV --> JI[Jira Integration]
            SERV --> CI[Confluence Integration]
        end
    end

    subgraph External Services
        GPT[OpenAI GPT-4]
        JIRA[Jira]
        CONF[Confluence]
    end

    SC --> APP
    SM --> APP
    
    AI --> GPT
    JI --> JIRA
    CI --> CONF

    SUM --> AI
    RCA --> AI
    JT --> JI
    CP --> CI

    style SlackAIBot fill:#f5f5f5,stroke:#333,stroke-width:2px
    style External Services fill:#e6f3ff,stroke:#333,stroke-width:2px
    style Slack Workspace fill:#f0fff0,stroke:#333,stroke-width:2px
```

### Architecture Overview

1. **Slack Integration Layer**
   - Handles real-time message events from Slack
   - Processes slash commands
   - Manages message threading and responses

2. **Command Handlers**
   - `/summarize`: Generates incident summaries
   - `/timeline`: Creates chronological event timelines
   - `/rca`: Generates Root Cause Analysis reports
   - `/create-ticket`: Creates Jira tickets
   - `/create-confluence`: Creates Confluence documentation

3. **Core Services**
   - AI Service: Integrates with OpenAI's GPT-4 for intelligent analysis
   - Jira Integration: Manages ticket creation and updates
   - Confluence Integration: Handles documentation creation

4. **External Services**
   - OpenAI GPT-4: Provides AI-powered analysis and summaries
   - Jira: Issue tracking and project management
   - Confluence: Documentation and knowledge base

### Data Flow

1. Users interact with the bot in Slack channels
2. Command handlers process requests
3. Services layer communicates with external APIs
4. Results are formatted and posted back to Slack
5. Documentation is created in Confluence
6. Tickets are created/updated in Jira

### Detailed Technical Documentation

For more detailed technical documentation and diagrams, please see:
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Technical Diagrams](docs/TECHNICAL_DIAGRAMS.md)
  - Sequence Diagrams
  - Component Architecture
  - Data Flow Diagrams
  - State Machine Diagrams
  - Infrastructure Architecture
  - Error Handling Flow
- [Project Recreation Template](docs/PROMPT_TEMPLATE.md)
  - Base Project Template
  - Language-Specific Guidelines
  - Implementation Steps
  - Best Practices

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
