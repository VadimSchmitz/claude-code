/**
 * Demo file showing ClaudeWrapper features
 * 
 * For interactive chat, use: node chat.js
 */

const { ClaudeWrapper } = require('./claude-wrapper');

console.log('=== Claude Wrapper Demo ===\n');
console.log('This is a demo showing the wrapper features.');
console.log('For interactive chat, run: node chat.js\n');

// Create wrapper with auto-save enabled
const claude = new ClaudeWrapper({
    saveChats: true,
    chatsDir: './chats'
});

async function runDemo() {
    console.log('1. Testing basic ask...');
    const response1 = claude.ask('What is 2+2?');
    console.log('Response:', response1);
    console.log('Session ID:', claude.currentSessionId);
    
    console.log('\n2. Testing conversation continuation...');
    const response2 = claude.ask('What was my previous question?');
    console.log('Response:', response2);
    
    console.log('\n3. Testing askWithInfo...');
    const info = claude.askWithInfo('Tell me a joke');
    console.log('Response:', info.result);
    console.log('Cost:', info.cost);
    
    console.log('\n4. Listing saved chats...');
    const chats = claude.listChats();
    console.log(`Found ${chats.length} saved chats`);
    
    console.log('\n✅ Demo complete!');
    console.log('Run "node chat.js" for interactive chat');
}

runDemo().catch(console.error);