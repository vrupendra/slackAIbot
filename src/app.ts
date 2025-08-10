import { App, LogLevel } from '@slack/bolt';
import { Configuration, OpenAIApi } from 'openai';
import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import axios from 'axios';
import { JiraIntegration } from './integrations/jira';
import { ConfluenceIntegration } from './integrations/confluence';

// Load environment variables
dotenv.config();

// Initialize Slack app with more detailed logging
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
});

// Initialize Slack Web Client for additional API calls
const webClient = new WebClient(process.env.SLACK_BOT_TOKEN);

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Configuration
const SUMMARY_CHANNEL = process.env.SUMMARY_CHANNEL_ID;
if (!SUMMARY_CHANNEL) {
  throw new Error('SUMMARY_CHANNEL_ID must be set in environment variables');
}

// Initialize integrations
let jira: JiraIntegration | undefined;
let confluence: ConfluenceIntegration | undefined;

try {
  jira = new JiraIntegration();
  console.log('✅ Jira integration initialized');
} catch (error) {
  console.warn('⚠️ Jira integration not available:', error.message);
}

try {
  confluence = new ConfluenceIntegration();
  console.log('✅ Confluence integration initialized');
} catch (error) {
  console.warn('⚠️ Confluence integration not available:', error.message);
}

interface TimelineEntry {
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

// Helper function to fetch channel history
async function getChannelHistory(channelId: string): Promise<any[]> {
  try {
    const result = await webClient.conversations.history({
      channel: channelId,
      limit: 1000, // Adjust based on your needs
    });
    return result.messages as any[];
  } catch (error) {
    console.error('Error fetching channel history:', error);
    throw error;
  }
}

// Helper function to format messages for OpenAI
function formatMessagesForOpenAI(messages: any[]): string {
  return messages
    .reverse()
    .map((msg) => {
      const timestamp = new Date(Number(msg.ts) * 1000).toISOString();
      return `[${timestamp}] ${msg.user}: ${msg.text}`;
    })
    .join('\n');
}

// Helper function to create a timeline
async function createTimeline(messages: any[]): Promise<TimelineEntry[]> {
  const timeline: TimelineEntry[] = [];
  
  for (const msg of messages.reverse()) {
    const timestamp = new Date(Number(msg.ts) * 1000).toISOString();
    const user = msg.user;
    
    // Basic classification of messages
    let action = 'Update';
    if (msg.text.toLowerCase().includes('fixed') || msg.text.toLowerCase().includes('resolved')) {
      action = 'Resolution';
    } else if (msg.text.toLowerCase().includes('investigating')) {
      action = 'Investigation';
    } else if (msg.text.toLowerCase().includes('error') || msg.text.toLowerCase().includes('failed')) {
      action = 'Error Report';
    }

    timeline.push({
      timestamp,
      user,
      action,
      details: msg.text,
    });
  }

  return timeline;
}

// Helper function to format timeline as a Slack message
function formatTimelineForSlack(timeline: TimelineEntry[]): string {
  let message = '*Incident Timeline*\n\n';
  timeline.forEach((entry) => {
    message += `*${entry.timestamp}*\n`;
    message += `*User:* ${entry.user}\n`;
    message += `*Action:* ${entry.action}\n`;
    message += `*Details:* ${entry.details}\n\n`;
  });
  return message;
}

// Helper function to generate RCA report
async function generateRCAReport(messages: any[]): Promise<string> {
  const conversationText = formatMessagesForOpenAI(messages);
  
  const prompt = `
    Based on the following incident chat log, create a detailed RCA (Root Cause Analysis) report.
    Include the following sections:
    1. Incident Overview
    2. Timeline of Events
    3. Root Cause
    4. Resolution Steps
    5. Prevention Measures
    6. Lessons Learned

    Chat log:
    ${conversationText}
  `;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an incident analysis expert. Create a detailed and professional RCA report." },
        { role: "user", content: prompt }
      ],
    });

    return completion.data.choices[0]?.message?.content || "Could not generate RCA report.";
  } catch (error) {
    console.error('Error generating RCA:', error);
    throw error;
  }
}

// Command handler for summarizing channel
app.command('/summarize', async ({ command, ack, say }) => {
  await ack();
  try {
    const messages = await getChannelHistory(command.channel_id);
    const conversationText = formatMessagesForOpenAI(messages);

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are an incident management expert. Summarize the incident discussion concisely but include all important technical details."
        },
        { 
          role: "user", 
          content: `Summarize this incident channel conversation:\n${conversationText}`
        }
      ],
    });

    const summary = completion.data.choices[0]?.message?.content;
    
    // Post to summary channel
    await webClient.chat.postMessage({
      channel: SUMMARY_CHANNEL,
      text: `*Channel Summary* (<#${command.channel_id}>)\n\n${summary}`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Incident Channel Summary",
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Channel: <#${command.channel_id}>`
          }
        },
        {
          type: "divider"
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: summary || "No summary available."
          }
        }
      ]
    });

    await say("Summary has been posted to the summaries channel.");
  } catch (error) {
    console.error('Error:', error);
    await say("Sorry, I encountered an error while generating the summary.");
  }
});

// Command handler for creating timeline
app.command('/timeline', async ({ command, ack, say }) => {
  await ack();
  try {
    const messages = await getChannelHistory(command.channel_id);
    const timeline = await createTimeline(messages);
    const formattedTimeline = formatTimelineForSlack(timeline);

    await webClient.chat.postMessage({
      channel: SUMMARY_CHANNEL,
      text: `*Incident Timeline* (<#${command.channel_id}>)\n\n${formattedTimeline}`,
    });

    await say("Timeline has been posted to the summaries channel.");
  } catch (error) {
    console.error('Error:', error);
    await say("Sorry, I encountered an error while creating the timeline.");
  }
});

// Command handler for generating RCA
app.command('/rca', async ({ command, ack, say }) => {
  await ack();
  try {
    const messages = await getChannelHistory(command.channel_id);
    const rcaReport = await generateRCAReport(messages);

    await webClient.chat.postMessage({
      channel: SUMMARY_CHANNEL,
      text: `*RCA Report* (<#${command.channel_id}>)\n\n${rcaReport}`,
    });

    await say("RCA report has been posted to the summaries channel.");
  } catch (error) {
    console.error('Error:', error);
    await say("Sorry, I encountered an error while generating the RCA report.");
  }
});

// Command handler for creating Jira ticket
app.command('/create-ticket', async ({ command, ack, say }) => {
  await ack();
  
  if (!jira) {
    await say("Jira integration is not configured.");
    return;
  }

  try {
    const messages = await getChannelHistory(command.channel_id);
    const summary = `Incident: ${command.text || 'Investigation Required'}`;
    const rcaReport = await generateRCAReport(messages);
    
    // Create Jira ticket
    const issueKey = await jira.createIssue(summary, rcaReport);
    
    await say(`Created Jira ticket: ${issueKey}\nRCA report has been added to the ticket.`);
  } catch (error) {
    console.error('Error:', error);
    await say("Sorry, I encountered an error while creating the Jira ticket.");
  }
});

// Command handler for creating Confluence page
app.command('/create-confluence', async ({ command, ack, say }) => {
  await ack();
  
  if (!confluence) {
    await say("Confluence integration is not configured.");
    return;
  }

  try {
    const messages = await getChannelHistory(command.channel_id);
    const rcaReport = await generateRCAReport(messages);
    const title = `Incident RCA: ${command.text || new Date().toISOString()}`;
    
    // Create Confluence page
    const pageId = await confluence.createPage(
      process.env.CONFLUENCE_SPACE_KEY || '',
      title,
      rcaReport,
      process.env.CONFLUENCE_PARENT_PAGE_ID
    );
    
    await say(`Created Confluence page with ID: ${pageId}`);

    // If Jira is configured, add the Confluence link to the Jira ticket
    if (jira && command.text && command.text.includes('JIRA-')) {
      const confluenceUrl = `${process.env.CONFLUENCE_BASE_URL}/pages/viewpage.action?pageId=${pageId}`;
      await jira.addComment(command.text, `RCA Report created in Confluence: ${confluenceUrl}`);
      await say(`Added Confluence link to Jira ticket ${command.text}`);
    }
  } catch (error) {
    console.error('Error:', error);
    await say("Sorry, I encountered an error while creating the Confluence page.");
  }
});

// Start the app
(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ Incident Management Bot is running!');
  } catch (error) {
    console.error('Error starting app:', error);
  }
})();
