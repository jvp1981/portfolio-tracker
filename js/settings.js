/* ===================================
   SETTINGS MANAGER
   API Key Configuration & Storage
   =================================== */

class SettingsManager {
    constructor() {
        this.apiKey = null;
        this.init();
    }
    
    init() {
        console.log('⚙️ Settings Manager initializing...');
        
        // Load saved API key
        this.loadApiKey();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Update status display
        this.updateStatus();
        
        console.log('✅ Settings Manager ready!');
    }
    
    setupEventListeners() {
        // Settings button in header
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettings());
        }
        
        // Close modal
        const closeBtn = document.getElementById('closeSettings');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeSettings());
        }
        
        // Click outside modal to close
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeSettings();
                }
            });
        }
        
        // Toggle API key visibility
        const toggleBtn = document.getElementById('toggleApiKeyVisibility');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleApiKeyVisibility());
        }
        
        // Save API key
        const saveBtn = document.getElementById('saveApiKey');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveApiKey());
        }
        
        // Test API key
        const testBtn = document.getElementById('testApiKey');
        if (testBtn) {
            testBtn.addEventListener('click', () => this.testApiKey());
        }
        
        // Clear API key
        const clearBtn = document.getElementById('clearApiKey');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearApiKey());
        }
        
        // Enter key in input
        const apiKeyInput = document.getElementById('apiKeyInput');
        if (apiKeyInput) {
            apiKeyInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.saveApiKey();
                }
            });
        }
    }
    
    openSettings() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.classList.remove('hidden');
            
            // Populate input with current key (masked)
            const input = document.getElementById('apiKeyInput');
            if (input && this.apiKey) {
                input.value = this.apiKey;
            }
        }
    }
    
    closeSettings() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
    
    toggleApiKeyVisibility() {
        const input = document.getElementById('apiKeyInput');
        const btn = document.getElementById('toggleApiKeyVisibility');
        
        if (input.type === 'password') {
            input.type = 'text';
            btn.textContent = '🙈';
        } else {
            input.type = 'password';
            btn.textContent = '👁️';
        }
    }
    
    loadApiKey() {
        try {
            const savedKey = localStorage.getItem('anthropic_api_key');
            if (savedKey) {
                this.apiKey = savedKey;
                console.log('🔑 API key loaded from localStorage');
            }
        } catch (error) {
            console.error('Error loading API key:', error);
        }
    }
    
    saveApiKey() {
        const input = document.getElementById('apiKeyInput');
        const key = input.value.trim();
        
        if (!key) {
            alert('❌ Please enter an API key');
            return;
        }
        
        // Basic validation
        if (!key.startsWith('sk-ant-')) {
            alert('❌ Invalid API key format. Anthropic keys start with "sk-ant-"');
            return;
        }
        
        try {
            // Save to localStorage
            localStorage.setItem('anthropic_api_key', key);
            this.apiKey = key;
            
            // Update status
            this.updateStatus();
            
            // Show success
            alert('✅ API key saved successfully!\n\nYou can now use real AI-powered insights.');
            
            console.log('✅ API key saved');
            
        } catch (error) {
            console.error('Error saving API key:', error);
            alert('❌ Error saving API key: ' + error.message);
        }
    }
    
    async testApiKey() {
        if (!this.apiKey) {
            alert('❌ No API key configured. Please save your API key first.');
            return;
        }
        
        const testBtn = document.getElementById('testApiKey');
        const originalText = testBtn.textContent;
        
        try {
            testBtn.textContent = '⏳ Testing...';
            testBtn.disabled = true;
            
            // Test API call
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 50,
                    messages: [
                        { role: 'user', content: 'Say "API test successful" if you can read this.' }
                    ]
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                alert('✅ API Connection Successful!\n\nYour API key is working correctly.');
                console.log('✅ API test successful:', data);
                this.updateStatus(true);
            } else {
                const error = await response.json();
                alert('❌ API Test Failed\n\n' + (error.error?.message || 'Invalid API key or network error'));
                console.error('API test failed:', error);
                this.updateStatus(false);
            }
            
        } catch (error) {
            console.error('Error testing API:', error);
            alert('❌ Connection Error\n\nCould not reach Anthropic API. Check your internet connection.');
            this.updateStatus(false);
        } finally {
            testBtn.textContent = originalText;
            testBtn.disabled = false;
        }
    }
    
    clearApiKey() {
        if (!confirm('Are you sure you want to clear your API key?\n\nYou will need to enter it again to use AI features.')) {
            return;
        }
        
        try {
            localStorage.removeItem('anthropic_api_key');
            this.apiKey = null;
            
            // Clear input
            const input = document.getElementById('apiKeyInput');
            if (input) {
                input.value = '';
            }
            
            // Update status
            this.updateStatus();
            
            alert('✅ API key cleared');
            console.log('🗑️ API key cleared');
            
        } catch (error) {
            console.error('Error clearing API key:', error);
            alert('❌ Error clearing API key: ' + error.message);
        }
    }
    
    updateStatus(tested = null) {
        const indicator = document.getElementById('statusIndicator');
        const statusText = document.getElementById('statusText');
        
        if (!indicator || !statusText) return;
        
        if (this.apiKey) {
            if (tested === true) {
                indicator.textContent = '✅';
                statusText.textContent = 'API key configured and tested';
                statusText.style.color = 'var(--success-color)';
            } else if (tested === false) {
                indicator.textContent = '❌';
                statusText.textContent = 'API key invalid or connection failed';
                statusText.style.color = 'var(--danger-color)';
            } else {
                indicator.textContent = '🔑';
                statusText.textContent = 'API key configured (not tested)';
                statusText.style.color = 'var(--warning-color)';
            }
        } else {
            indicator.textContent = '⚠️';
            statusText.textContent = 'No API key configured';
            statusText.style.color = 'var(--text-secondary)';
        }
    }
    
    getApiKey() {
        return this.apiKey;
    }
    
    hasApiKey() {
        return !!this.apiKey;
    }
}

// Initialize Settings Manager
let settingsManager;
document.addEventListener('DOMContentLoaded', () => {
    settingsManager = new SettingsManager();
    window.settingsManager = settingsManager;
});