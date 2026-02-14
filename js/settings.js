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
            
            // Toggle real API
            const toggleAPI = document.getElementById('useRealAPI');
            if (toggleAPI) {
                toggleAPI.addEventListener('change', (e) => {
                    this.apiKey = e.target.checked ? 'backend' : null;
                    localStorage.setItem('use_real_api', e.target.checked);
                    this.updateStatus();
                });
            }
            
            // Test API
            const testBtn = document.getElementById('testApiKey');
            if (testBtn) {
                testBtn.addEventListener('click', () => this.testApiKey());
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
    
    loadApiKey() {
        try {
            const useReal = localStorage.getItem('use_real_api') === 'true';
            this.apiKey = useReal ? 'backend' : null;
            
            // Update checkbox
            const toggle = document.getElementById('useRealAPI');
            if (toggle) {
                toggle.checked = useReal;
            }
            
            console.log(useReal ? '🔑 Using real API' : '📝 Using mock responses');
        } catch (error) {
            console.error('Error loading API preference:', error);
        }
    }
    
    async testApiKey() {
            const testBtn = document.getElementById('testApiKey');
            const originalText = testBtn.textContent;
            
            try {
                testBtn.textContent = '⏳ Testing...';
                testBtn.disabled = true;
                
                // Test via Vercel backend
                const isProduction = window.location.hostname.includes('vercel.app');
                const apiEndpoint = isProduction 
                    ? '/api/chat'
                    : 'http://localhost:3000/api/chat';
                
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        systemPrompt: 'You are a helpful assistant.',
                        userPrompt: 'Say "API test successful" if you can read this.'
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    alert('✅ API Connection Successful!\n\nBackend is working correctly.');
                    console.log('✅ API test successful:', data);
                    this.updateStatus(true);
                } else {
                    const error = await response.json();
                    alert('❌ API Test Failed\n\n' + (error.error || 'Backend error'));
                    console.error('API test failed:', error);
                    this.updateStatus(false);
                }
                
            } catch (error) {
                console.error('Error testing API:', error);
                alert('❌ Connection Error\n\nCould not reach backend API.');
                this.updateStatus(false);
            } finally {
                testBtn.textContent = originalText;
                testBtn.disabled = false;
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