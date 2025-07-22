const { ClaudeWrapper } = require('../claude-wrapper');

// Example: Using Claude for file operations
console.log('=== File Operations Example ===\n');
console.log('⚠️  This example uses --dangerously-skip-permissions\n');

const claude = new ClaudeWrapper({
    saveChats: true,
    model: 'sonnet',
    allowFileAccess: true  // Enable file access
});

async function demo() {
    // Create a new file
    console.log('1. Creating a README file...');
    const create = claude.ask('Create a file called DEMO_README.md with a title "# Demo Project" and a description "This file was created by Claude"');
    console.log('Claude:', create);
    
    // Add content
    console.log('\n2. Adding content...');
    const add = claude.ask('Add a section to DEMO_README.md called "## Features" with bullet points: "- Automated file creation", "- Content generation", "- Code assistance"');
    console.log('Claude:', add);
    
    // Read it back
    console.log('\n3. Reading the file...');
    const read = claude.ask('Show me the contents of DEMO_README.md');
    console.log('Claude:', read);
    
    // Create a code file
    console.log('\n4. Creating a JavaScript file...');
    const code = claude.ask('Create a file called demo.js that exports a function called greet(name) that returns "Hello, " + name');
    console.log('Claude:', code);
    
    // Clean up
    console.log('\n5. Cleaning up...');
    const cleanup = claude.ask('Delete DEMO_README.md and demo.js');
    console.log('Claude:', cleanup);
    
    console.log('\n✅ File operations demo complete!');
    console.log('Session ID:', claude.currentSessionId);
}

demo().catch(console.error);