/**
 * Claude CLI Wrapper
 * Provides a simple interface to the Claude CLI with automatic session management
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class ClaudeWrapper {
    constructor(options = {}) {
        this.config = {
            workingDir: options.workingDir || process.cwd(),
            model: options.model || 'sonnet',
            debug: options.debug || false,
            timeout: options.timeout || 60000,
            saveChats: options.saveChats || false,
            chatsDir: options.chatsDir || path.join(process.cwd(), 'chats'),
            allowFileAccess: options.allowFileAccess || false
        };
        
        // Create chats directory if saveChats is enabled
        if (this.config.saveChats && !fs.existsSync(this.config.chatsDir)) {
            fs.mkdirSync(this.config.chatsDir, { recursive: true });
        }
        
        // Track current session for auto-resume
        this.currentSessionId = null;
    }

    /**
     * Execute command synchronously with proper escaping
     */
    _execute(args) {
        const cmd = this._buildCommand(args);
        
        if (this.config.debug) {
            console.error('[DEBUG] Executing:', cmd);
            console.error('[DEBUG] Working dir:', this.config.workingDir);
            console.error('[DEBUG] Timeout:', this.config.timeout + 'ms');
        }
        
        try {
            const result = execSync(cmd, {
                cwd: this.config.workingDir,
                encoding: 'utf8',
                timeout: this.config.timeout,
                windowsHide: true,
                shell: true
            });
            
            return result.trim();
        } catch (error) {
            if (error.stderr) {
                throw new Error(`Claude error: ${error.stderr}`);
            }
            
            // Handle timeout
            if (error.code === 'ETIMEDOUT') {
                throw new Error('Command timed out');
            }
            
            // Extract error message from output
            const output = error.stdout || error.toString();
            const errorMatch = output.match(/Error: (.+)/);
            const errorMsg = errorMatch ? errorMatch[1] : output;
            
            throw new Error(`Claude error: ${errorMsg}`);
        }
    }
    
    /**
     * Build command with proper escaping
     */
    _buildCommand(args) {
        // Special handling for Windows
        const isWindows = process.platform === 'win32';
        
        // Escape arguments that contain spaces
        const escapedArgs = args.map(arg => {
            if (arg.includes(' ') && !arg.startsWith('"')) {
                return `"${arg}"`;
            }
            return arg;
        });
        
        return `claude ${escapedArgs.join(' ')}`;
    }
    
    /**
     * Save chat message to file
     */
    _saveChat(sessionId, prompt, response) {
        if (!this.config.saveChats) return;
        
        const filename = path.join(this.config.chatsDir, `${sessionId}.json`);
        let chatData = {
            sessionId,
            created: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            messages: []
        };
        
        // Load existing chat if it exists
        if (fs.existsSync(filename)) {
            chatData = JSON.parse(fs.readFileSync(filename, 'utf8'));
        } else {
            chatData.created = new Date().toISOString();
        }
        
        // Add new message
        chatData.messages.push({
            timestamp: new Date().toISOString(),
            prompt,
            response
        });
        chatData.lastUpdated = new Date().toISOString();
        
        // Save to file
        fs.writeFileSync(filename, JSON.stringify(chatData, null, 2));
        
        if (this.config.debug) {
            console.error(`[DEBUG] Chat saved: ${filename}`);
        }
    }

    /**
     * Send a one-shot prompt to Claude
     * @param {string} prompt - The prompt to send
     * @param {Object} options - Optional parameters
     * @returns {string} Claude's response
     */
    ask(prompt, options = {}) {
        // If saveChats is enabled and no sessionId provided, use current session
        if (this.config.saveChats && !options.sessionId && this.currentSessionId) {
            return this.resume(prompt, this.currentSessionId);
        }
        
        const args = ['-p']; // Print mode
        
        // Add file access permission if enabled
        if (this.config.allowFileAccess) {
            args.push('--dangerously-skip-permissions');
        }
        
        // Add options
        if (options.json || this.config.saveChats) {
            args.push('--output-format', 'json');
        }
        
        if (options.model) {
            args.push('--model', options.model);
        } else if (this.config.model) {
            args.push('--model', this.config.model);
        }
        
        if (options.apiKey) {
            args.push('--api-key', options.apiKey);
        }
        
        if (options.sessionId) {
            args.push('--resume', options.sessionId);
        }
        
        // Add the prompt
        args.push(prompt);
        
        const result = this._execute(args);
        
        // Handle JSON response
        if (options.json || this.config.saveChats) {
            try {
                const data = JSON.parse(result);
                this.currentSessionId = data.session_id || null;
                
                // Save chat if enabled
                if (this.config.saveChats && this.currentSessionId) {
                    this._saveChat(this.currentSessionId, prompt, data.result);
                }
                
                // Return just the result if not explicitly asking for JSON
                if (!options.json && this.config.saveChats) {
                    return data.result;
                }
            } catch (e) {
                // Not valid JSON, ignore
            }
        }
        
        return result;
    }
    
    /**
     * Get Claude version
     * @returns {string} Version string
     */
    version() {
        return this._execute(['--version']);
    }
    
    /**
     * Resume a previous conversation
     * @param {string} prompt - The prompt to send
     * @param {string} sessionId - Optional session ID
     * @returns {string} Claude's response
     */
    resume(prompt, sessionId = null) {
        // Use -c flag to continue most recent conversation
        const args = ['-p', '-c'];
        
        // Add file access permission if enabled
        if (this.config.allowFileAccess) {
            args.push('--dangerously-skip-permissions');
        }
        
        // Always use JSON when saveChats is enabled
        if (this.config.saveChats) {
            args.push('--output-format', 'json');
        }
        
        args.push(prompt);
        
        const result = this._execute(args);
        
        // Handle chat saving
        if (this.config.saveChats && this.currentSessionId) {
            try {
                const data = JSON.parse(result);
                this._saveChat(this.currentSessionId, prompt, data.result);
                return data.result;
            } catch (e) {
                // Fallback if not JSON
                this._saveChat(this.currentSessionId, prompt, result);
            }
        }
        
        return result;
    }

    /**
     * Continue the most recent conversation
     * @param {string} prompt - The prompt to send
     * @returns {string} Claude's response
     */
    continue(prompt) {
        return this._execute(['-p', '-c', prompt]);
    }

    /**
     * List available models
     * @returns {Array} Available model names
     */
    listModels() {
        // Common model aliases
        return ['sonnet', 'opus', 'haiku'];
    }

    /**
     * Get session info from last JSON response
     * @param {string} prompt - The prompt to send
     * @returns {Object} Object with result, sessionId, cost, etc.
     */
    askWithInfo(prompt, options = {}) {
        const jsonResponse = this.ask(prompt, { ...options, json: true });
        try {
            const data = JSON.parse(jsonResponse);
            return {
                result: data.result,
                sessionId: data.session_id,
                cost: data.total_cost_usd,
                duration: data.duration_ms,
                usage: data.usage,
                model: data.model,
                rawResponse: data
            };
        } catch (e) {
            // Fallback if parsing fails
            return {
                result: jsonResponse,
                sessionId: null,
                error: 'Failed to parse JSON response'
            };
        }
    }
    
    /**
     * List saved chats
     * @returns {Array} Array of chat info objects
     */
    listChats() {
        if (!fs.existsSync(this.config.chatsDir)) {
            return [];
        }
        
        const files = fs.readdirSync(this.config.chatsDir)
            .filter(f => f.endsWith('.json'));
        
        return files.map(file => {
            const data = JSON.parse(fs.readFileSync(path.join(this.config.chatsDir, file), 'utf8'));
            return {
                sessionId: data.sessionId,
                created: data.created,
                lastUpdated: data.lastUpdated,
                messageCount: data.messages.length,
                lastMessage: data.messages[data.messages.length - 1]?.prompt || ''
            };
        }).sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    }
    
    /**
     * Load a chat and display its messages
     * @param {string} sessionId 
     * @returns {Object} Chat data
     */
    loadChat(sessionId) {
        const chatFile = path.join(this.config.chatsDir, `${sessionId}.json`);
        
        if (!fs.existsSync(chatFile)) {
            throw new Error(`Chat not found: ${sessionId}`);
        }
        
        return JSON.parse(fs.readFileSync(chatFile, 'utf8'));
    }
}

module.exports = { ClaudeWrapper };