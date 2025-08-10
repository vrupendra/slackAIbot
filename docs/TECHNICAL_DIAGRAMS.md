# Technical Diagrams

## 1. Sequence Diagrams

### Incident Management Flow

```mermaid
sequenceDiagram
    participant U as User
    participant S as Slack
    participant B as SlackAIBot
    participant AI as OpenAI
    participant J as Jira
    participant C as Confluence

    U->>S: /summarize command
    S->>B: Command event
    B->>S: Acknowledge command
    B->>B: Fetch channel history
    B->>AI: Request analysis
    AI-->>B: Return summary
    B->>S: Post initial summary
    
    U->>S: /rca command
    S->>B: Command event
    B->>S: Acknowledge command
    B->>AI: Generate RCA
    AI-->>B: Return RCA report
    
    B->>J: Create ticket
    J-->>B: Return ticket ID
    
    B->>C: Create documentation
    C-->>B: Return page ID
    
    B->>J: Update ticket with doc link
    B->>S: Post completion message
```

### Message Processing Flow

```mermaid
sequenceDiagram
    participant CH as Channel
    participant APP as App Core
    participant AI as AI Service
    participant TL as Timeline
    participant DOC as Documentation

    CH->>APP: New message
    APP->>AI: Process message
    AI-->>APP: Analysis
    
    APP->>TL: Update timeline
    TL-->>APP: Updated timeline
    
    APP->>DOC: Update documentation
    DOC-->>APP: Documentation status
    
    APP->>CH: Post updates
```

## 2. Component Architecture

```mermaid
classDiagram
    class App {
        +start()
        +handleCommand()
        +processMessage()
    }
    
    class CommandHandler {
        +handleSummarize()
        +handleRCA()
        +handleTimeline()
        +handleTicket()
        +handleConfluence()
    }
    
    class AIService {
        +analyzeTopic()
        +generateRCA()
        +summarizeDiscussion()
    }
    
    class JiraService {
        +createTicket()
        +updateTicket()
        +addComment()
    }
    
    class ConfluenceService {
        +createPage()
        +updatePage()
        +addAttachment()
    }
    
    App --> CommandHandler
    CommandHandler --> AIService
    CommandHandler --> JiraService
    CommandHandler --> ConfluenceService
```

## 3. Data Flow Diagram

```mermaid
graph TD
    subgraph Input Layer
        M[Messages] --> P[Parser]
        C[Commands] --> P
    end
    
    subgraph Processing Layer
        P --> ANA[Analyzer]
        ANA --> AI[AI Processing]
        AI --> RG[Report Generator]
    end
    
    subgraph Integration Layer
        RG --> JI[Jira Integration]
        RG --> CI[Confluence Integration]
        JI --> JS[(Jira Storage)]
        CI --> CS[(Confluence Storage)]
    end
    
    subgraph Output Layer
        JI --> N[Notifications]
        CI --> N
        N --> R[Response Handler]
        R --> O[Output Formatter]
    end

    style Input Layer fill:#f0f7ff
    style Processing Layer fill:#fff0f0
    style Integration Layer fill:#f0fff0
    style Output Layer fill:#fff7f0
```

## 4. State Machine Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Receive Command
    Processing --> GeneratingResponse: Command Valid
    Processing --> Error: Command Invalid
    
    GeneratingResponse --> AIAnalysis: Need AI
    GeneratingResponse --> Documentation: Need Docs
    GeneratingResponse --> TicketCreation: Need Ticket
    
    AIAnalysis --> ResponseFormatting
    Documentation --> ResponseFormatting
    TicketCreation --> ResponseFormatting
    
    ResponseFormatting --> SendingResponse
    SendingResponse --> Idle: Success
    
    Error --> Idle
    
    state Processing {
        [*] --> Validating
        Validating --> FetchingContext
        FetchingContext --> ProcessingComplete
    }
```

## 5. Infrastructure Architecture

```mermaid
graph TB
    subgraph Cloud Infrastructure
        LB[Load Balancer]
        
        subgraph Application Tier
            APP1[App Instance 1]
            APP2[App Instance 2]
            APP3[App Instance 3]
        end
        
        subgraph Cache Layer
            RC[(Redis Cache)]
        end
        
        subgraph External Services
            S[Slack API]
            O[OpenAI API]
            J[Jira API]
            C[Confluence API]
        end
        
        subgraph Monitoring
            LOG[Logging Service]
            MET[Metrics Service]
            ALT[Alerting Service]
        end
    end
    
    LB --> APP1
    LB --> APP2
    LB --> APP3
    
    APP1 --> RC
    APP2 --> RC
    APP3 --> RC
    
    APP1 --> S
    APP1 --> O
    APP1 --> J
    APP1 --> C
    
    APP1 --> LOG
    APP1 --> MET
    MET --> ALT
    
    style Cloud Infrastructure fill:#f5f5f5,stroke:#333,stroke-width:2px
    style Application Tier fill:#e6f3ff,stroke:#333,stroke-width:2px
    style Cache Layer fill:#f0fff0,stroke:#333,stroke-width:2px
    style External Services fill:#fff0f0,stroke:#333,stroke-width:2px
    style Monitoring fill:#fff7e6,stroke:#333,stroke-width:2px
```

## 6. Error Handling Flow

```mermaid
graph TD
    E[Error Occurs] --> T{Error Type}
    
    T -->|API Error| A[API Error Handler]
    T -->|Validation Error| V[Validation Handler]
    T -->|Integration Error| I[Integration Handler]
    T -->|System Error| S[System Handler]
    
    A --> R{Retryable?}
    R -->|Yes| RT[Retry Logic]
    R -->|No| F[Fallback Logic]
    
    V --> U[User Feedback]
    I --> RI[Recovery Steps]
    S --> AL[Alert Admin]
    
    RT --> M[Monitoring]
    F --> M
    U --> M
    RI --> M
    AL --> M
    
    style E fill:#ff9999
    style M fill:#99ff99
```

These diagrams provide different views of the system:

1. **Sequence Diagrams**
   - Incident management flow
   - Message processing flow

2. **Component Architecture**
   - Class relationships
   - Service interactions

3. **Data Flow Diagram**
   - Input/output flow
   - Processing stages
   - Storage integration

4. **State Machine Diagram**
   - Command processing states
   - Error handling states
   - System transitions

5. **Infrastructure Architecture**
   - Cloud components
   - Service scaling
   - Monitoring setup

6. **Error Handling Flow**
   - Error types
   - Recovery processes
   - Monitoring integration

Each diagram helps visualize a different aspect of the system, making it easier for developers and stakeholders to understand the architecture.
