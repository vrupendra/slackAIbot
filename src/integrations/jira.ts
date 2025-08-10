import axios from 'axios';

export class JiraIntegration {
  private readonly baseUrl: string;
  private readonly email: string;
  private readonly apiToken: string;

  constructor() {
    this.baseUrl = process.env.JIRA_BASE_URL || '';
    this.email = process.env.JIRA_EMAIL || '';
    this.apiToken = process.env.JIRA_API_TOKEN || '';

    if (!this.baseUrl || !this.email || !this.apiToken) {
      throw new Error('Jira configuration missing. Please check JIRA_BASE_URL, JIRA_EMAIL, and JIRA_API_TOKEN in environment variables.');
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

  async createIssue(summary: string, description: string, issueType: string = 'Incident'): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/rest/api/3/issue`,
        {
          fields: {
            project: {
              key: process.env.JIRA_PROJECT_KEY
            },
            summary: summary,
            description: {
              type: "doc",
              version: 1,
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      text: description,
                      type: "text"
                    }
                  ]
                }
              ]
            },
            issuetype: {
              name: issueType
            }
          }
        },
        this.authHeader
      );

      return response.data.key;
    } catch (error) {
      console.error('Error creating Jira issue:', error);
      throw error;
    }
  }

  async updateIssue(issueKey: string, description: string): Promise<void> {
    try {
      await axios.put(
        `${this.baseUrl}/rest/api/3/issue/${issueKey}`,
        {
          fields: {
            description: {
              type: "doc",
              version: 1,
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      text: description,
                      type: "text"
                    }
                  ]
                }
              ]
            }
          }
        },
        this.authHeader
      );
    } catch (error) {
      console.error('Error updating Jira issue:', error);
      throw error;
    }
  }

  async addComment(issueKey: string, comment: string): Promise<void> {
    try {
      await axios.post(
        `${this.baseUrl}/rest/api/3/issue/${issueKey}/comment`,
        {
          body: {
            type: "doc",
            version: 1,
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    text: comment,
                    type: "text"
                  }
                ]
              }
            ]
          }
        },
        this.authHeader
      );
    } catch (error) {
      console.error('Error adding comment to Jira issue:', error);
      throw error;
    }
  }
}
