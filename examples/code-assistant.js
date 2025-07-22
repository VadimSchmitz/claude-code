const { ClaudeWrapper } = require('../claude-wrapper');

// Example: Using Claude as a code assistant
console.log('=== Code Assistant Example ===\n');

const claude = new ClaudeWrapper({
    saveChats: true,
    model: 'sonnet'
});

// Ask for code help
console.log('1. Asking for Python function:');
const pythonCode = claude.ask('Write a Python function to check if a number is prime');
console.log(pythonCode);

// Continue with a follow-up
console.log('\n2. Asking for optimization:');
const optimized = claude.ask('Can you optimize this for large numbers?');
console.log(optimized);

// Ask for explanation
console.log('\n3. Asking for explanation:');
const explanation = claude.ask('Explain the time complexity');
console.log(explanation);

console.log('\n✅ Full conversation saved as:', claude.currentSessionId);