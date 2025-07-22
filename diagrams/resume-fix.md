# Resume Command Fix

## Current Problem
```mermaid
flowchart LR
    A[ask with saveChats] --> B{Has currentSessionId?}
    B -->|Yes| C["resume(prompt, sessionId)"]
    C --> D["claude -p --resume SESSION_ID 'prompt'"]
    D --> E[ERROR: Invalid syntax]
    style E fill:#f99
```

## The Fix
```mermaid
flowchart TD
    A[ask with saveChats] --> B{Has currentSessionId?}
    B -->|Yes| C{Use continue instead}
    B -->|No| D["New chat: claude -p --output-format json 'prompt'"]
    
    C --> E["claude -p -c"]
    E --> F["Just 'prompt' on next line"]
    F --> G[Success!]
    
    D --> H[Parse JSON for sessionId]
    H --> I[Save chat & sessionId]
    
    style G fill:#9f9
    style C fill:#ff9
```

## Why This Works
- `claude -p -c` continues the most recent conversation
- No need to pass session ID explicitly
- Simpler and more reliable than `--resume`