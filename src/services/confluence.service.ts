import axios, { AxiosInstance } from 'axios';
import { ConfluenceTemplate, IncidentReport, ConfluenceMetadata } from '../types/incident';

export class ConfluenceService {
  private readonly client: AxiosInstance;
  private readonly spaceKey: string;
  private readonly templates: Map<string, ConfluenceTemplate>;

  constructor() {
    const baseUrl = process.env.CONFLUENCE_BASE_URL;
    const email = process.env.CONFLUENCE_EMAIL || process.env.JIRA_EMAIL;
    const apiToken = process.env.CONFLUENCE_API_TOKEN;
    this.spaceKey = process.env.CONFLUENCE_SPACE_KEY || '';

    if (!baseUrl || !email || !apiToken || !this.spaceKey) {
      throw new Error('Confluence configuration missing. Check environment variables.');
    }

    // Initialize axios instance with base configuration
    this.client = axios.create({
      baseURL: `${baseUrl}/wiki/rest/api`,
      auth: {
        username: email,
        password: apiToken
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Atlassian-Token': 'no-check'
      }
    });

    // Initialize templates
    this.templates = this.initializeTemplates();
  }

  private initializeTemplates(): Map<string, ConfluenceTemplate> {
    const templates = new Map<string, ConfluenceTemplate>();
    
    // Standard RCA Template
    templates.set('rca', {
      id: 'rca',
      name: 'Root Cause Analysis',
      spaceKey: this.spaceKey,
      labels: ['incident', 'rca'],
      sections: [
        {
          title: 'Incident Overview',
          type: 'heading1',
          children: [
            { title: 'Impact', type: 'heading2' },
            { title: 'Timeline', type: 'heading2' },
            { title: 'Root Cause', type: 'heading2' }
          ]
        },
        {
          title: 'Resolution',
          type: 'heading1',
          children: [
            { title: 'Actions Taken', type: 'heading2' },
            { title: 'Verification Steps', type: 'heading2' }
          ]
        },
        {
          title: 'Prevention',
          type: 'heading1',
          children: [
            { title: 'Immediate Actions', type: 'heading2' },
            { title: 'Long-term Improvements', type: 'heading2' },
            { title: 'Monitoring & Alerts', type: 'heading2' }
          ]
        },
        {
          title: 'Lessons Learned',
          type: 'heading1',
          children: [
            { title: 'What Went Well', type: 'heading2' },
            { title: 'What Needs Improvement', type: 'heading2' },
            { title: 'Action Items', type: 'heading2' }
          ]
        }
      ]
    });

    return templates;
  }

  private createStorageFormat(content: string): string {
    // Sanitize content to prevent XSS
    const sanitized = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    return `<ac:structured-macro ac:name="info"><ac:rich-text-body>${sanitized}</ac:rich-text-body></ac:structured-macro>`;
  }

  private async createTableFromTimeline(timeline: any[]): Promise<string> {
    const tableHeader = `
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>User</th>
            <th>Action</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
    `;

    const tableRows = timeline.map(entry => `
      <tr>
        <td>${new Date(entry.timestamp).toISOString()}</td>
        <td>${entry.user}</td>
        <td>${entry.action}</td>
        <td>${entry.details}</td>
      </tr>
    `).join('');

    return `${tableHeader}${tableRows}</tbody></table>`;
  }

  private async createExpandedContent(section: any, data: IncidentReport): Promise<string> {
    let content = '';

    switch (section.title) {
      case 'Incident Overview':
        content = `
          <h1>Incident Overview</h1>
          <p><strong>Severity:</strong> ${data.severity}</p>
          <p><strong>Start Time:</strong> ${data.startTime}</p>
          <p><strong>End Time:</strong> ${data.endTime || 'Ongoing'}</p>
          <p><strong>Impacted Services:</strong></p>
          <ul>${data.impactedServices.map(service => `<li>${service}</li>`).join('')}</ul>
        `;
        break;

      case 'Timeline':
        content = await this.createTableFromTimeline(data.timeline);
        break;

      // Add more section handlers as needed
    }

    return content;
  }

  async createPage(data: IncidentReport, metadata: ConfluenceMetadata): Promise<string> {
    try {
      const template = this.templates.get('rca');
      if (!template) {
        throw new Error('Template not found');
      }

      let content = '';
      for (const section of template.sections) {
        content += await this.createExpandedContent(section, data);
      }

      const response = await this.client.post('/content', {
        type: 'page',
        title: data.title,
        space: { key: metadata.spaceKey },
        body: {
          storage: {
            value: content,
            representation: 'storage'
          }
        },
        metadata: {
          labels: metadata.labels.map(label => ({ prefix: 'global', name: label }))
        },
        ancestors: metadata.parentId ? [{ id: metadata.parentId }] : []
      });

      // Add comment with metadata
      await this.addPageComment(response.data.id, `
        Created by Incident Bot
        Template: ${template.name}
        Severity: ${data.severity}
        Status: ${data.status}
      `);

      return response.data.id;
    } catch (error) {
      console.error('Error creating Confluence page:', error);
      throw error;
    }
  }

  async addPageComment(pageId: string, comment: string): Promise<void> {
    try {
      await this.client.post(`/content/${pageId}/child/comment`, {
        type: 'comment',
        container: { id: pageId },
        body: {
          storage: {
            value: this.createStorageFormat(comment),
            representation: 'storage'
          }
        }
      });
    } catch (error) {
      console.error('Error adding comment to Confluence page:', error);
      throw error;
    }
  }

  async updatePage(pageId: string, data: IncidentReport): Promise<void> {
    try {
      // Get current page version
      const currentPage = await this.client.get(`/content/${pageId}?expand=version`);
      const newVersion = currentPage.data.version.number + 1;

      const template = this.templates.get('rca');
      if (!template) {
        throw new Error('Template not found');
      }

      let content = '';
      for (const section of template.sections) {
        content += await this.createExpandedContent(section, data);
      }

      await this.client.put(`/content/${pageId}`, {
        version: { number: newVersion },
        title: data.title,
        type: 'page',
        body: {
          storage: {
            value: content,
            representation: 'storage'
          }
        }
      });
    } catch (error) {
      console.error('Error updating Confluence page:', error);
      throw error;
    }
  }

  async addAttachment(pageId: string, file: Buffer, filename: string): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('file', new Blob([file]), filename);

      await this.client.post(`/content/${pageId}/child/attachment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error('Error adding attachment to Confluence page:', error);
      throw error;
    }
  }
}
