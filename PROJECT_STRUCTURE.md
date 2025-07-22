# Desired Project Structure

```
claude-wrapper/
│
├── CLAUDE.md                  # Co-creation rules
├── index.md                   # Main documentation with embedded diagrams
├── PROJECT_STRUCTURE.md       # This file
│
├── src/
│   ├── claude-wrapper.js      # Main wrapper implementation
│   └── continuous-mode.js     # Continuous conversation mode
│
├── diagrams/
│   ├── overview.md            # High-level system overview
│   ├── current-flow.md        # Current implementation flow
│   ├── continuous-flow.md     # Continuous mode flow
│   ├── api-design.md          # API class diagram
│   └── test-diagrams.html     # HTML file to test all diagrams render
│
├── examples/
│   ├── basic.js               # Simple usage example
│   ├── continuous.js          # Continuous mode example
│   ├── chat-management.js     # Loading/saving chats example
│   └── README.md              # Examples documentation
│
├── chats/                     # Auto-created directory for saved chats
│   └── [session-id].json      # Individual chat files
│
├── tests/
│   ├── test-wrapper.js        # Unit tests for wrapper
│   ├── test-continuous.js     # Tests for continuous mode
│   └── test-helpers.js        # Test utilities
│
└── docs/
    ├── API.md                 # Full API documentation
    ├── SETUP.md               # Installation and setup guide
    └── TROUBLESHOOTING.md     # Common issues and solutions
```

## File Purposes

### Core Files
- `src/claude-wrapper.js` - Current one-shot implementation
- `src/continuous-mode.js` - New continuous conversation mode

### Documentation
- `index.md` - Main entry point, embeds all diagrams
- `CLAUDE.md` - Our working agreement
- `docs/` - Detailed documentation

### Diagrams
- Each diagram in its own file for modularity
- `test-diagrams.html` - Verify diagrams render correctly

### Examples
- Practical, runnable examples
- Each focusing on specific features

### Tests
- Ensure everything works before presenting
- Catch issues early

Is this the structure you want?