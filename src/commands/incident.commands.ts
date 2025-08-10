import { App } from '@slack/bolt';
import { ConfluenceService } from '../services/confluence.service';
import { IncidentReport, ConfluenceMetadata } from '../types/incident';

export function setupIncidentCommands(app: App) {
  const confluenceService = new ConfluenceService();

  app.command('/incident-rca', async ({ command, ack, say }) => {
    await ack();

    try {
      const [incidentId, title] = command.text.split(' - ');
      
      if (!incidentId || !title) {
        await say('Usage: /incident-rca <incident-id> - <title>');
        return;
      }

      // Example incident report - in practice, you'd fetch this from your incident management system
      const incident: IncidentReport = {
        id: incidentId,
        title: title,
        severity: 'P1',
        status: 'resolved',
        startTime: new Date('2024-01-10T10:00:00Z'),
        endTime: new Date('2024-01-10T14:30:00Z'),
        description: 'Service outage affecting user authentication',
        impactedServices: ['auth-service', 'api-gateway'],
        timeline: [
          {
            timestamp: new Date('2024-01-10T10:00:00Z'),
            user: 'monitoring',
            action: 'alert',
            details: 'High latency detected in auth-service'
          },
          {
            timestamp: new Date('2024-01-10T10:05:00Z'),
            user: command.user_name,
            action: 'investigation',
            details: 'Started investigation of auth-service issues'
          }
        ],
        rootCause: 'Database connection pool exhaustion due to connection leaks',
        resolution: 'Increased connection pool size and fixed connection leak in authentication middleware',
        actionItems: [
          {
            id: '1',
            description: 'Implement connection pool monitoring',
            assignee: command.user_name,
            status: 'open',
            priority: 'high'
          }
        ]
      };

      const metadata: ConfluenceMetadata = {
        spaceKey: process.env.CONFLUENCE_SPACE_KEY || '',
        labels: ['incident', 'rca', `severity-${incident.severity}`],
      };

      const pageId = await confluenceService.createPage(incident, metadata);

      await say({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `✅ Created RCA document for incident ${incident.id}`
            }
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Title:* ${incident.title}\n*Severity:* ${incident.severity}\n*Status:* ${incident.status}`
            }
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `View the RCA document here: ${process.env.CONFLUENCE_BASE_URL}/wiki/spaces/${metadata.spaceKey}/pages/${pageId}`
            }
          }
        ]
      });
    } catch (error) {
      console.error('Error creating RCA:', error);
      await say({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '❌ Failed to create RCA document. Please check the logs for more details.'
            }
          }
        ]
      });
    }
  });

  app.command('/update-rca', async ({ command, ack, say }) => {
    await ack();

    try {
      const [pageId, status] = command.text.split(' ');
      
      if (!pageId || !status) {
        await say('Usage: /update-rca <page-id> <status>');
        return;
      }

      // In practice, you'd fetch the existing incident data and update it
      const incident: Partial<IncidentReport> = {
        status: status as any,
        timeline: [
          {
            timestamp: new Date(),
            user: command.user_name,
            action: 'status-update',
            details: `Updated incident status to ${status}`
          }
        ]
      };

      await confluenceService.updatePage(pageId, incident as IncidentReport);
      await confluenceService.addPageComment(pageId, `Status updated to ${status} by ${command.user_name}`);

      await say({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `✅ Updated RCA document status to ${status}`
            }
          }
        ]
      });
    } catch (error) {
      console.error('Error updating RCA:', error);
      await say({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '❌ Failed to update RCA document. Please check the logs for more details.'
            }
          }
        ]
      });
    }
  });
}
