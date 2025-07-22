# Claude Wrapper Architecture

## Overview
This document describes the architecture and design of the Claude CLI wrapper with automatic chat management.

## Current Implementation

```mermaid
flowchart TD
    A[index.js] -->|creates| B[ClaudeWrapper instance]
    B -->|saveChats: true| C{First ask?}
    
    C -->|Yes| D[Execute with -p flag]
    C -->|No + has currentSessionId| E[Resume with -c flag]
    
    D -->|Returns JSON| F[Parse JSON Response]
    E -->|Returns JSON| F
    
    F --> G[Extract session_id]
    F --> H[Extract result text]
    
    G --> I[Store as currentSessionId]
    H --> J[Return to user]
    
    F -->|If saveChats enabled| K[_saveChat method]
    K --> L[Create/Update sessionId.json file]
    
    %% Green = Tested together and verified
    style A fill:#4f4,stroke:#333,stroke-width:2px
    style B fill:#4f4,stroke:#333,stroke-width:2px
    style C fill:#4f4,stroke:#333,stroke-width:2px
    style D fill:#4f4,stroke:#333,stroke-width:2px
    style E fill:#4f4,stroke:#333,stroke-width:2px
    style F fill:#4f4,stroke:#333,stroke-width:2px
    style G fill:#4f4,stroke:#333,stroke-width:2px
    style H fill:#4f4,stroke:#333,stroke-width:2px
    style I fill:#4f4,stroke:#333,stroke-width:2px
    style J fill:#4f4,stroke:#333,stroke-width:2px
    style K fill:#4f4,stroke:#333,stroke-width:2px
    style L fill:#4f4,stroke:#333,stroke-width:2px
```

### Legend
```mermaid
flowchart LR
    T[Theorized] 
    I[Implemented]
    W[Working]
    V[Verified Together]
    
    style T fill:#f44,stroke:#333,stroke-width:2px
    style I fill:#fa4,stroke:#333,stroke-width:2px
    style W fill:#ff4,stroke:#333,stroke-width:2px
    style V fill:#4f4,stroke:#333,stroke-width:2px
```
- 🔴 **Red** = Theorized (planned but not implemented)
- 🟠 **Orange** = Implemented (code exists but not tested)
- 🟡 **Yellow** = Working (tested individually)
- 🟢 **Green** = Verified (we both tested it together and saw it work)

## How It Works

### Session Management
```mermaid
sequenceDiagram
    participant User
    participant Wrapper
    participant Claude CLI
    participant File System
    
    User->>Wrapper: ask("Hello")
    Wrapper->>Claude CLI: claude -p --output-format json "Hello"
    Claude CLI-->>Wrapper: {result: "Hi!", session_id: "abc"}
    Wrapper->>File System: Save to chats/abc.json
    Wrapper-->>User: "Hi!"
    
    User->>Wrapper: ask("What's 2+2?")
    Note over Wrapper: Has currentSessionId
    Wrapper->>Claude CLI: claude -p -c --output-format json "What's 2+2?"
    Claude CLI-->>Wrapper: {result: "4", session_id: "abc"}
    Wrapper->>File System: Append to chats/abc.json
    Wrapper-->>User: "4"
```

### API Design

```mermaid
classDiagram
    class ClaudeWrapper {
        +boolean saveChats
        +string currentSessionId
        +string chatsDir
        
        +constructor(options)
        +ask(prompt, options) string
        +continue(prompt) string
        +resume(prompt, sessionId) string
        +askWithInfo(prompt) Object
        +listChats() Array
        +loadChat(sessionId) Object
    }
    
    class ChatInfo {
        +string sessionId
        +Date created
        +Date lastUpdated
        +number messageCount
        +string lastMessage
    }
    
    ClaudeWrapper --> ChatInfo : returns
```

## Features

### Working Features ✅
- **Auto-continue conversations** - Messages within same wrapper instance continue the conversation
- **Save chat history** - All conversations saved to JSON files
- **Session management** - Track and resume conversations by session ID
- **Cost tracking** - Get detailed usage info with `askWithInfo()`

### Architecture Decisions
- Uses Claude CLI's `-c` flag for continuing conversations (not `--resume`)
- One-shot execution model (no persistent process)
- JSON output format for reliable parsing
- File-based chat storage for simplicity

## File Structure

```
claude-wrapper/
├── claude-wrapper.js    # Main wrapper implementation
├── index.js            # Demo/test file
├── examples/           # Usage examples
│   ├── basic-usage.js
│   ├── chat-management.js
│   └── code-assistant.js
├── chats/             # Saved conversations (auto-created)
├── diagrams/          # Architecture diagrams
└── CLAUDE.md          # Co-creation rules
```

## Navigation

- [Co-Creation Rules](CLAUDE.md)
- [Source Code](claude-wrapper.js)
- [Examples](examples/)
- [README](README.md)