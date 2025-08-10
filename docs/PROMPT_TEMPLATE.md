# AI Incident Management Bot - Prompt Template

Use this prompt template to recreate this project in any programming language or framework.

## Base Prompt

```markdown
Create an AI-powered Incident Management Slack Bot with the following specifications:

Project Type: Slack Bot with AI Integration
Primary Language: [Python/TypeScript/Your Choice]
Architecture: Microservices-based
Integration Points: Slack, OpenAI GPT-4, Jira, Confluence

Core Features:
1. Incident Management
   - Real-time incident tracking
   - AI-powered summarization
   - Automated timeline generation
   - Root Cause Analysis (RCA) generation
   - Integration with ticketing and documentation systems

2. Command Structure:
   Implement the following Slack commands:
   - /summarize: Generate AI-powered incident summary
   - /timeline: Create chronological event timeline
   - /rca: Generate Root Cause Analysis report
   - /create-ticket: Create Jira ticket with incident details
   - /create-confluence: Create Confluence documentation

3. AI Integration Requirements:
   - OpenAI GPT-4 integration for analysis
   - Intelligent message processing
   - Context-aware summarization
   - Structured RCA report generation
   - Automated severity classification

4. External Integrations:
   a) Slack Integration:
      - Real-time message processing
      - Command handling
      - Interactive responses
      - Channel management
      - Message threading

   b) Jira Integration:
      - Ticket creation and updates
      - Comment management
      - Link sharing
      - Status tracking

   c) Confluence Integration:
      - Automated documentation
      - Template management
      - Page creation and updates
      - Attachment handling
      - Cross-linking with Jira

5. Technical Requirements:
   a) Architecture:
      - Modular design with clear separation of concerns
      - Service-based architecture
      - Event-driven processing
      - Robust error handling
      - Type safety (if applicable)

   b) Infrastructure:
      - Load balancing support
      - Scalable deployment
      - Caching layer
      - Monitoring and logging
      - Security best practices

   c) Development Features:
      - Environment-based configuration
      - Comprehensive logging
      - Error tracking
      - Performance monitoring
      - Rate limiting

6. Project Structure:
   ```
   src/
   ├── app.[extension]              # Main application
   ├── commands/                    # Command handlers
   ├── integrations/               # External service integrations
   ├── services/                   # Business logic
   ├── types/                      # Type definitions
   └── utils/                      # Utilities
   ```

7. Required Documentation:
   - README.md with setup instructions
   - Architecture diagrams (using Mermaid.js)
   - API documentation
   - Environment configuration guide
   - Contributing guidelines
   - Technical architecture document

8. DevOps Requirements:
   - GitHub Actions for CI/CD
   - Automated testing
   - Code quality checks
   - Security scanning
   - Dependency management
   - Automated deployments

9. Security Considerations:
   - Environment variable management
   - API token security
   - Input validation
   - Rate limiting
   - Error handling
   - Secure logging

10. Testing Requirements:
    - Unit tests
    - Integration tests
    - E2E testing
    - Mock service testing
    - Performance testing
```

## Additional Language-Specific Requirements

### For Python Implementation
```markdown
Additional Python-specific requirements:

1. Framework & Libraries:
   - FastAPI/Flask for API
   - Slack Bolt for Python
   - Pydantic for data validation
   - SQLAlchemy for database (if needed)
   - aiohttp for async HTTP
   - pytest for testing
   - mypy for type checking
   - black for formatting
   - isort for import sorting
   - flake8 for linting

2. Project Structure:
   ```
   src/
   ├── app.py                 # Main application
   ├── config/               # Configuration
   │   ├── __init__.py
   │   └── settings.py
   ├── models/              # Data models
   │   ├── __init__.py
   │   └── incident.py
   ├── services/            # Business logic
   │   ├── __init__.py
   │   ├── ai_service.py
   │   ├── jira_service.py
   │   └── confluence_service.py
   ├── handlers/            # Command handlers
   │   ├── __init__.py
   │   └── commands.py
   ├── utils/              # Utilities
   │   ├── __init__.py
   │   └── helpers.py
   └── tests/              # Test files
       ├── __init__.py
       ├── conftest.py
       └── test_handlers.py
   ```

3. Python Best Practices:
   - Use Python 3.9+ features
   - Implement async/await
   - Use type hints
   - Follow PEP 8
   - Use dependency injection
   - Implement proper error handling
   - Use context managers
   - Implement proper logging

4. Testing Approach:
   - pytest fixtures
   - async test support
   - mock external services
   - parameterized testing
   - coverage reporting
```

### For TypeScript Implementation
```markdown
Additional TypeScript-specific requirements:

1. Framework & Libraries:
   - Node.js 18+
   - @slack/bolt
   - axios/got
   - zod for validation
   - jest for testing
   - eslint for linting
   - prettier for formatting
   - winston for logging

2. TypeScript Configuration:
   - Strict mode enabled
   - ESM modules
   - Path aliases
   - Source maps
   - Declaration files

3. Project Structure:
   - Follow provided structure
   - Use interfaces
   - Implement DTOs
   - Use enums
   - Use utility types
```

## Implementation Steps

1. Initial Setup:
   ```markdown
   1. Create project structure
   2. Set up development environment
   3. Configure linting and formatting
   4. Set up testing framework
   5. Create initial documentation
   ```

2. Core Development:
   ```markdown
   1. Implement base application
   2. Add Slack integration
   3. Add OpenAI integration
   4. Add command handlers
   5. Add service layer
   6. Implement error handling
   ```

3. External Integrations:
   ```markdown
   1. Implement Jira service
   2. Implement Confluence service
   3. Add cross-linking
   4. Implement templates
   ```

4. Testing & Documentation:
   ```markdown
   1. Write unit tests
   2. Write integration tests
   3. Create technical diagrams
   4. Write documentation
   5. Set up CI/CD
   ```

## Reference Architecture

Refer to the technical diagrams in [TECHNICAL_DIAGRAMS.md](TECHNICAL_DIAGRAMS.md) for:
1. Sequence Diagrams
2. Component Architecture
3. Data Flow
4. State Machine
5. Infrastructure
6. Error Handling

## Tips for Success

1. Start with core functionality
2. Use test-driven development
3. Follow language best practices
4. Implement proper error handling
5. Focus on security
6. Document as you go
7. Use version control effectively
8. Set up CI/CD early
