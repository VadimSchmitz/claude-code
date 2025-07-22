# Claude CLI Wrapper

A Node.js wrapper for the Claude CLI that provides automatic session management and chat persistence.

## Features

- 🔄 **Automatic conversation continuation** - Messages within the same wrapper instance automatically continue the conversation
- 💾 **Chat persistence** - All conversations are saved as JSON files with session IDs
- 📊 **Detailed response info** - Get cost, duration, and usage data for each interaction
- 🗂️ **Chat management** - List, load, and review previous conversations
- 🛡️ **Error handling** - Graceful error handling with helpful messages

## Installation

```bash
npm install claude-wrapper
```

Or clone this repository:

```bash
git clone https://github.com/yourusername/claude-wrapper.git
cd claude-wrapper
```

## Quick Start

```javascript
const { ClaudeWrapper } = require('./claude-wrapper');

// Create a wrapper instance
const claude = new ClaudeWrapper();

// Ask a question
const response = claude.ask('What is the capital of France?');
console.log(response); // "The capital of France is Paris."

// Continue the conversation
const followUp = claude.continue('What is its population?');
console.log(followUp); // "Paris has a population of approximately 2.1 million..."
```

## API Reference

### Constructor Options

```javascript
const claude = new ClaudeWrapper({
    workingDir: process.cwd(),     // Working directory for Claude CLI
    model: 'sonnet',               // Model to use (sonnet, opus, haiku)
    debug: false,                  // Enable debug logging
    timeout: 60000,                // Command timeout in milliseconds
    saveChats: false,              // Enable chat persistence
    chatsDir: './chats'            // Directory for saved chats
});
```

### Methods

#### `ask(prompt, options)`
Send a one-shot prompt to Claude.

```javascript
const response = claude.ask('Hello, Claude!');
```

#### `continue(prompt)`
Continue the most recent conversation.

```javascript
const response = claude.continue('Tell me more');
```

#### `askWithInfo(prompt, options)`
Get detailed response information including cost and usage.

```javascript
const info = claude.askWithInfo('Explain quantum computing');
console.log(info.result);     // The response text
console.log(info.cost);       // Cost in USD
console.log(info.sessionId);  // Session identifier
```

#### `listChats()`
List all saved conversations.

```javascript
const chats = claude.listChats();
chats.forEach(chat => {
    console.log(`${chat.sessionId}: ${chat.messageCount} messages`);
});
```

#### `loadChat(sessionId)`
Load a specific conversation by session ID.

```javascript
const chatData = claude.loadChat('session-id-here');
console.log(chatData.messages);
```

## Examples

See the `examples/` directory for more detailed examples:

- `basic-usage.js` - Simple questions and conversations
- `chat-management.js` - Working with saved chats
- `code-assistant.js` - Using Claude for code assistance

## Requirements

- Node.js 14 or higher
- Claude CLI installed and configured
- Valid Claude API key (set via Claude CLI)

## License

MIT