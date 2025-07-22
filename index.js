const { ClaudeWrapper } = require('./claude-wrapper');

// Create wrapper with auto-save enabled
const claude = new ClaudeWrapper({
    saveChats: true,  // Enable chat saving
    chatsDir: './chats'  // Where to save chats
});

console.log('=== Chat Saving Demo ===\n');

// First message - creates new chat
console.log('1. Starting new conversation...');
const response1 = claude.ask('Hello! What is your name?');
console.log('Claude:', response1);
console.log('Session ID:', claude.currentSessionId);

// Second message - automatically continues the same chat
console.log('\n2. Continuing same conversation...');
const response2 = claude.ask('Can you remember what I just asked you?');
console.log('Claude:', response2);

// Third message - still same chat
console.log('\n3. Another message in same chat...');
const response3 = claude.ask('What is 2+2?');
console.log('Claude:', response3);

// Force a new chat by using newSession option
console.log('\n4. Starting NEW conversation...');
const newClaude = new ClaudeWrapper({ saveChats: true });
const response4 = newClaude.ask('This should be a different conversation. What is the weather?');
console.log('Claude:', response4);
console.log('New Session ID:', newClaude.currentSessionId);

console.log('\n✅ Check the ./chats/ directory for saved conversations!');
console.log('Each file is named with the session ID.');