#!/usr/bin/env node
const { ClaudeWrapper } = require('./claude-wrapper');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '\nYou: '
});

// Parse command line args
const args = process.argv.slice(2);
const debugMode = args.includes('--debug') || args.includes('-d');
const fileAccess = args.includes('--file-access') || args.includes('-f');

// Create Claude wrapper with chat saving
const claude = new ClaudeWrapper({
    saveChats: true,
    model: 'sonnet',
    debug: debugMode,  // Only show debug if requested
    timeout: 120000,  // 2 minute timeout
    allowFileAccess: fileAccess  // Enable dangerous permissions if requested
});

console.log('=== Claude Chat Interface ===');
console.log('Type your messages and press Enter. Type "exit" to quit.');
console.log('Press Ctrl+C to interrupt a response.');
if (fileAccess) {
    console.log('⚠️  FILE ACCESS ENABLED - Claude can read/write/delete files!');
}
console.log('');

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
    console.log('\n\nInterrupted! Type "exit" to quit or continue chatting.');
    rl.prompt();
});

// Function to handle user input
async function chat() {
    rl.prompt();
    
    rl.on('line', async (input) => {
        if (input.toLowerCase() === 'exit') {
            console.log('\nGoodbye!');
            if (claude.currentSessionId) {
                console.log(`Chat saved as: ${claude.currentSessionId}`);
            }
            rl.close();
            process.exit(0);
        }
        
        try {
            // Show thinking indicator
            process.stdout.write('\nClaude is thinking...');
            
            const response = await claude.ask(input);
            
            // Clear the thinking line and show response
            process.stdout.write('\r' + ' '.repeat(50) + '\r');
            console.log('\n' + '-'.repeat(60));
            console.log(response);
            console.log('-'.repeat(60));
            
            if (!claude.currentSessionId) {
                console.log('\n(New chat started)');
            }
        } catch (error) {
            process.stdout.write('\r' + ' '.repeat(50) + '\r');
            console.error('\n❌ Error:', error.message);
        }
        
        rl.prompt();
    });
}

// Start the chat
chat();