const { ClaudeWrapper } = require('../claude-wrapper');

// Example: Managing saved conversations
console.log('=== Chat Management Example ===\n');

// Create wrapper with chat saving enabled
const claude = new ClaudeWrapper({
    saveChats: true,
    model: 'sonnet'
});

// Start a conversation
console.log('1. Starting new conversation...');
const response1 = claude.ask('Hello! I want to learn about JavaScript promises.');
console.log('Claude:', response1);
console.log('Session ID:', claude.currentSessionId);

// Continue the conversation
console.log('\n2. Continuing conversation...');
const response2 = claude.ask('Can you give me a simple example?');
console.log('Claude:', response2);

// List all saved chats
console.log('\n3. Listing all saved chats:');
const chats = claude.listChats();
chats.forEach(chat => {
    console.log(`- ${chat.sessionId}`);
    console.log(`  Created: ${new Date(chat.created).toLocaleString()}`);
    console.log(`  Messages: ${chat.messageCount}`);
    console.log(`  Last: "${chat.lastMessage}"\n`);
});

// Load a specific chat
if (chats.length > 0) {
    console.log('4. Loading first chat:');
    const chatData = claude.loadChat(chats[0].sessionId);
    console.log(`Chat ${chatData.sessionId} has ${chatData.messages.length} messages:`);
    chatData.messages.forEach((msg, i) => {
        console.log(`\n[${i + 1}] User: ${msg.prompt}`);
        console.log(`    Claude: ${msg.response.substring(0, 100)}...`);
    });
}