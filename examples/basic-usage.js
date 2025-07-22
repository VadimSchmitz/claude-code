const { ClaudeWrapper } = require('../claude-wrapper');

// Example 1: Simple one-shot question
console.log('=== Example 1: Simple Question ===');
const claude = new ClaudeWrapper();
const answer = claude.ask('What is the capital of France?');
console.log('Answer:', answer);

// Example 2: Get detailed info with cost
console.log('\n=== Example 2: Question with Details ===');
const info = claude.askWithInfo('Explain recursion in one sentence');
console.log('Answer:', info.result);
console.log('Cost: $' + info.cost);
console.log('Session:', info.sessionId);

// Example 3: Continue a conversation
console.log('\n=== Example 3: Conversation ===');
const chat1 = claude.ask('My name is Alice');
console.log('Claude:', chat1);

const chat2 = claude.continue('What is my name?');
console.log('Claude:', chat2);