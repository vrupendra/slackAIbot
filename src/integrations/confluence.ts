import axios from 'axios';

export class ConfluenceIntegration {
  private readonly baseUrl: string;
  private readonly email: string;
  private readonly apiToken: string;

  constructor() {
    this.baseUrl = process.env.CONFLUENCE_BASE_URL || '';
    this.email = process.env.CONFLUENCE_EMAIL || process.env.JIRA_EMAIL || '';
    this.apiToken = process.env.CONFLUENCE_API_TOKEN || '';

    if (!this.baseUrl || !this.email || !this.apiToken) {
      throw new Error('Confluence configuration missing. Please check CONFLUENCE_BASE_URL, CONFLUENCE_EMAIL, and CONFLUENCE_API_TOKEN in environment variables.');
    }
  }

  private get authHeader() {
    return {
      auth: {
        username: this.email,
        password: this.apiToken
      }
    };
  }

  async createPage(spaceKey: string, title: string, content: string, parentId?: string): Promise<string> {
    try {
      const body: any = {
        type: 'page',
        title: title,
        space: { key: spaceKey },
        body: {
          storage: {
            value: this.convertToConfluenceFormat(content),
            representation: 'storage'
          }
        }
      };

      if (parentId) {
        body.ancestors = [{ id: parentId }];
      }

      const response = await axios.post(
        `${this.baseUrl}/rest/api/content`,
        body,
        this.authHeader
      );

      return response.data.id;
    } catch (error) {
      console.error('Error creating Confluence page:', error);
      throw error;
    }
  }

  async updatePage(pageId: string, title: string, content: string, version: number): Promise<void> {
    try {
      await axios.put(
        `${this.baseUrl}/rest/api/content/${pageId}`,
        {
          version: { number: version + 1 },
          title: title,
          type: 'page',
          body: {
            storage: {
              value: this.convertToConfluenceFormat(content),
              representation: 'storage'
            }
          }
        },
        this.authHeader
      );
    } catch (error) {
      console.error('Error updating Confluence page:', error);
      throw error;
    }
  }

  async getPage(pageId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/rest/api/content/${pageId}?expand=version`,
        this.authHeader
      );
      return response.data;
    } catch (error) {
      console.error('Error getting Confluence page:', error);
      throw error;
    }
  }

  private convertToConfluenceFormat(markdown: string): string {
    // Convert markdown to Confluence's storage format
    // This is a basic implementation - you might want to use a proper markdown to HTML converter
    return `<ac:structured-macro ac:name="info"><ac:rich-text-body><p>${markdown}</p></ac:rich-text-body></ac:structured-macro>`;
  }
}
