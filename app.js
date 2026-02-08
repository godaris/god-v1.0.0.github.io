/**
 * GOD v1.0.0 - Professional AI Assistant
 * Supports both Cloud (Anthropic) and Local (Ollama) modes
 */

class GODAssistant {
    constructor() {
        this.version = '1.0.0';
        this.mode = localStorage.getItem('god_mode') || 'cloud';
        this.apiKey = localStorage.getItem('god_api_key') || '';
        this.ollamaUrl = localStorage.getItem('god_ollama_url') || 'http://localhost:11434';
        this.ollamaModel = localStorage.getItem('god_ollama_model') || 'llama3.2';
        this.theme = localStorage.getItem('god_theme') || 'dark';
        this.streaming = localStorage.getItem('god_streaming') !== 'false';
        this.voiceEnabled = localStorage.getItem('god_voice') !== 'false';
        this.voiceSpeed = parseFloat(localStorage.getItem('god_voice_speed')) || 1.0;
        this.saveHistory = localStorage.getItem('god_save_history') !== 'false';
        
        this.chatHistory = [];
        this.currentChatId = this.generateId();
        this.isProcessing = false;
        this.abortController = null;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupVoiceRecognition();
        this.applyTheme();
        this.loadChatHistory();
    }

    setupElements() {
        // Sidebar
        this.sidebar = document.getElementById('sidebar');
        this.sidebarClose = document.getElementById('sidebar-close');
        this.menuToggle = document.getElementById('menu-toggle');
        this.newChatBtn = document.getElementById('new-chat');
        
        // Messages
        this.messagesContainer = document.getElementById('messages-container');
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.messages = document.getElementById('messages');
        this.chatTitle = document.getElementById('chat-title');
        
        // Input
        this.messageInput = document.getElementById('message-input');
        this.sendButton = document.getElementById('send-button');
        this.charCount = document.getElementById('char-count');
        this.voiceInput = document.getElementById('voice-input');
        this.voiceToggle = document.getElementById('voice-toggle');
        
        // Settings
        this.settingsButton = document.getElementById('settings-button');
        this.settingsModal = document.getElementById('settings-modal');
        this.modalClose = document.getElementById('modal-close');
        this.modalCancel = document.getElementById('modal-cancel');
        this.saveSettings = document.getElementById('save-settings');
        
        // Voice indicator
        this.voiceIndicator = document.getElementById('voice-indicator');
        
        // Quick actions
        this.quickActionCards = document.querySelectorAll('.quick-action-card');
        this.promptChips = document.querySelectorAll('.prompt-chip');
    }

    setupEventListeners() {
        // Sidebar
        this.menuToggle.addEventListener('click', () => this.toggleSidebar());
        this.sidebarClose.addEventListener('click', () => this.toggleSidebar());
        this.newChatBtn.addEventListener('click', () => this.startNewChat());
        
        // Input
        this.messageInput.addEventListener('input', () => this.handleInputChange());
        this.messageInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.voiceInput.addEventListener('click', () => this.toggleVoiceInput());
        this.voiceToggle.addEventListener('click', () => this.toggleVoiceMode());
        
        // Settings
        this.settingsButton.addEventListener('click', () => this.openSettings());
        this.modalClose.addEventListener('click', () => this.closeSettings());
        this.modalCancel.addEventListener('click', () => this.closeSettings());
        this.saveSettings.addEventListener('click', () => this.saveSettingsHandler());
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) this.closeSettings();
        });
        
        // API mode switcher
        document.getElementById('api-mode').addEventListener('change', (e) => {
            const cloudSettings = document.getElementById('cloud-settings');
            const ollamaSettings = document.getElementById('ollama-settings');
            
            if (e.target.value === 'cloud') {
                cloudSettings.classList.remove('hidden');
                ollamaSettings.classList.add('hidden');
            } else {
                cloudSettings.classList.add('hidden');
                ollamaSettings.classList.remove('hidden');
            }
        });
        
        // Voice speed
        document.getElementById('voice-speed').addEventListener('input', (e) => {
            document.getElementById('voice-speed-value').textContent = `${e.target.value}x`;
        });
        
        // Clear history
        document.getElementById('clear-history').addEventListener('click', () => this.clearHistory());
        
        // Quick actions
        this.quickActionCards.forEach(card => {
            card.addEventListener('click', () => {
                this.welcomeScreen.classList.add('hidden');
                this.messageInput.focus();
            });
        });
        
        this.promptChips.forEach(chip => {
            chip.addEventListener('click', () => {
                this.messageInput.value = chip.textContent.replace(/"/g, '');
                this.welcomeScreen.classList.add('hidden');
                this.handleInputChange();
                this.messageInput.focus();
            });
        });
    }

    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            
            this.recognition.onstart = () => {
                this.voiceInput.classList.add('recording');
                this.voiceIndicator.classList.remove('hidden');
            };
            
            this.recognition.onend = () => {
                this.voiceInput.classList.remove('recording');
                this.voiceIndicator.classList.add('hidden');
            };
            
            this.recognition.onresult = (event) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                this.messageInput.value = transcript;
                this.handleInputChange();
            };
        }
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('open');
    }

    toggleVoiceInput() {
        if (!this.recognition) {
            this.showToast('Voice input not supported', 'error');
            return;
        }
        
        if (this.voiceInput.classList.contains('recording')) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    toggleVoiceMode() {
        this.voiceToggle.classList.toggle('active');
        const isActive = this.voiceToggle.classList.contains('active');
        this.showToast(isActive ? 'Voice mode enabled' : 'Voice mode disabled', 'info');
    }

    handleInputChange() {
        const value = this.messageInput.value;
        this.charCount.textContent = value.length;
        this.sendButton.disabled = value.trim().length === 0 || this.isProcessing;
        
        // Auto-resize textarea
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 200) + 'px';
    }

    handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!this.sendButton.disabled) {
                this.sendMessage();
            }
        }
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isProcessing) return;
        
        // Check configuration
        if (this.mode === 'cloud' && !this.apiKey) {
            this.showToast('Please configure your API key in settings', 'error');
            this.openSettings();
            return;
        }
        
        // Hide welcome screen
        this.welcomeScreen.classList.add('hidden');
        
        // Add user message
        this.addMessage('user', message);
        this.chatHistory.push({ role: 'user', content: message });
        
        // Clear input
        this.messageInput.value = '';
        this.handleInputChange();
        
        // Show typing indicator
        const typingId = this.addTypingIndicator();
        
        this.isProcessing = true;
        
        try {
            const response = this.mode === 'cloud' 
                ? await this.callClaudeAPI(message)
                : await this.callOllamaAPI(message);
            
            this.removeTypingIndicator(typingId);
            
            if (response) {
                this.addMessage('assistant', response);
                this.chatHistory.push({ role: 'assistant', content: response });
                
                // Voice output
                if (this.voiceToggle.classList.contains('active') && this.voiceEnabled) {
                    this.speak(response);
                }
                
                // Save chat
                if (this.saveHistory) {
                    this.saveChatToHistory();
                }
            }
        } catch (error) {
            this.removeTypingIndicator(typingId);
            console.error('Error:', error);
            this.showToast('Failed to get response. Please try again.', 'error');
        } finally {
            this.isProcessing = false;
        }
    }

    async callClaudeAPI(message) {
        this.abortController = new AbortController();
        
        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 4096,
                    messages: this.chatHistory.slice(-10),
                    stream: false
                }),
                signal: this.abortController.signal
            });
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            
            const data = await response.json();
            return data.content[0].text;
        } catch (error) {
            if (error.name === 'AbortError') return null;
            throw error;
        }
    }

    async callOllamaAPI(message) {
        this.abortController = new AbortController();
        
        try {
            const response = await fetch(`${this.ollamaUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.ollamaModel,
                    messages: this.chatHistory.slice(-10),
                    stream: false
                }),
                signal: this.abortController.signal
            });
            
            if (!response.ok) {
                throw new Error(`Ollama request failed: ${response.status}`);
            }
            
            const data = await response.json();
            return data.message.content;
        } catch (error) {
            if (error.name === 'AbortError') return null;
            throw error;
        }
    }

    addMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        const time = new Date().toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            <div class="message-header">
                <div class="message-avatar">${role === 'user' ? 'U' : '∞'}</div>
                <span class="message-author">${role === 'user' ? 'You' : 'GOD'}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-content">${this.formatMessage(content)}</div>
            ${role === 'assistant' ? this.getMessageActions() : ''}
        `;
        
        this.messages.appendChild(messageDiv);
        this.scrollToBottom();
        
        return messageDiv;
    }

    formatMessage(text) {
        if (!text) return '';
        
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    getMessageActions() {
        return `
            <div class="message-actions">
                <button class="message-action" onclick="god.copyMessage(this)">Copy</button>
                <button class="message-action" onclick="god.speakMessage(this)">Speak</button>
            </div>
        `;
    }

    copyMessage(button) {
        const content = button.closest('.message').querySelector('.message-content').textContent;
        navigator.clipboard.writeText(content);
        this.showToast('Copied to clipboard', 'success');
    }

    speakMessage(button) {
        const content = button.closest('.message').querySelector('.message-content').textContent;
        this.speak(content);
    }

    speak(text) {
        if (!this.synthesis || !this.voiceEnabled) return;
        
        this.synthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = this.voiceSpeed;
        this.synthesis.speak(utterance);
    }

    addTypingIndicator() {
        const id = 'typing-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = 'message assistant';
        div.innerHTML = `
            <div class="message-header">
                <div class="message-avatar">∞</div>
                <span class="message-author">GOD</span>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>
        `;
        this.messages.appendChild(div);
        this.scrollToBottom();
        return id;
    }

    removeTypingIndicator(id) {
        const element = document.getElementById(id);
        if (element) element.remove();
    }

    scrollToBottom() {
        requestAnimationFrame(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        });
    }

    startNewChat() {
        if (this.chatHistory.length > 0 && this.saveHistory) {
            this.saveChatToHistory();
        }
        
        this.currentChatId = this.generateId();
        this.chatHistory = [];
        this.messages.innerHTML = '';
        this.welcomeScreen.classList.remove('hidden');
        this.chatTitle.textContent = 'New Conversation';
        
        if (window.innerWidth < 768) {
            this.toggleSidebar();
        }
    }

    saveChatToHistory() {
        if (!this.saveHistory || this.chatHistory.length === 0) return;
        
        const chats = JSON.parse(localStorage.getItem('god_chats') || '[]');
        const title = this.chatHistory.find(m => m.role === 'user')?.content.slice(0, 50) || 'Untitled';
        
        const chatData = {
            id: this.currentChatId,
            title: title,
            messages: this.chatHistory,
            timestamp: Date.now()
        };
        
        const existingIndex = chats.findIndex(c => c.id === this.currentChatId);
        if (existingIndex >= 0) {
            chats[existingIndex] = chatData;
        } else {
            chats.unshift(chatData);
        }
        
        localStorage.setItem('god_chats', JSON.stringify(chats.slice(0, 50)));
        this.loadChatHistory();
    }

    loadChatHistory() {
        const chats = JSON.parse(localStorage.getItem('god_chats') || '[]');
        
        const now = Date.now();
        const today = new Date().setHours(0, 0, 0, 0);
        const yesterday = today - 86400000;
        const weekAgo = today - 604800000;
        
        const todayChats = chats.filter(c => c.timestamp >= today);
        const yesterdayChats = chats.filter(c => c.timestamp >= yesterday && c.timestamp < today);
        const weekChats = chats.filter(c => c.timestamp >= weekAgo && c.timestamp < yesterday);
        
        this.renderHistorySection('history-today', todayChats);
        this.renderHistorySection('history-yesterday', yesterdayChats);
        this.renderHistorySection('history-week', weekChats);
    }

    renderHistorySection(elementId, chats) {
        const container = document.getElementById(elementId);
        container.innerHTML = '';
        
        chats.forEach(chat => {
            const button = document.createElement('button');
            button.className = 'history-item';
            if (chat.id === this.currentChatId) {
                button.classList.add('active');
            }
            button.textContent = chat.title;
            button.onclick = () => this.loadChat(chat.id);
            container.appendChild(button);
        });
        
        container.parentElement.style.display = chats.length > 0 ? 'block' : 'none';
    }

    loadChat(chatId) {
        const chats = JSON.parse(localStorage.getItem('god_chats') || '[]');
        const chat = chats.find(c => c.id === chatId);
        
        if (!chat) return;
        
        this.currentChatId = chatId;
        this.chatHistory = chat.messages;
        this.messages.innerHTML = '';
        this.welcomeScreen.classList.add('hidden');
        this.chatTitle.textContent = chat.title;
        
        chat.messages.forEach(msg => {
            this.addMessage(msg.role, msg.content);
        });
        
        if (window.innerWidth < 768) {
            this.toggleSidebar();
        }
        
        this.loadChatHistory();
    }

    clearHistory() {
        if (confirm('Clear all chat history? This cannot be undone.')) {
            localStorage.removeItem('god_chats');
            this.loadChatHistory();
            this.showToast('Chat history cleared', 'success');
        }
    }

    openSettings() {
        this.settingsModal.classList.add('active');
        
        // Load current settings
        document.getElementById('api-mode').value = this.mode;
        document.getElementById('api-key').value = this.apiKey;
        document.getElementById('ollama-url').value = this.ollamaUrl;
        document.getElementById('ollama-model').value = this.ollamaModel;
        document.getElementById('theme').value = this.theme;
        document.getElementById('streaming').checked = this.streaming;
        document.getElementById('voice-enabled').checked = this.voiceEnabled;
        document.getElementById('voice-speed').value = this.voiceSpeed;
        document.getElementById('voice-speed-value').textContent = `${this.voiceSpeed}x`;
        document.getElementById('save-history').checked = this.saveHistory;
        
        // Show/hide mode settings
        const cloudSettings = document.getElementById('cloud-settings');
        const ollamaSettings = document.getElementById('ollama-settings');
        if (this.mode === 'cloud') {
            cloudSettings.classList.remove('hidden');
            ollamaSettings.classList.add('hidden');
        } else {
            cloudSettings.classList.add('hidden');
            ollamaSettings.classList.remove('hidden');
        }
    }

    closeSettings() {
        this.settingsModal.classList.remove('active');
    }

    saveSettingsHandler() {
        this.mode = document.getElementById('api-mode').value;
        this.apiKey = document.getElementById('api-key').value;
        this.ollamaUrl = document.getElementById('ollama-url').value;
        this.ollamaModel = document.getElementById('ollama-model').value;
        this.theme = document.getElementById('theme').value;
        this.streaming = document.getElementById('streaming').checked;
        this.voiceEnabled = document.getElementById('voice-enabled').checked;
        this.voiceSpeed = parseFloat(document.getElementById('voice-speed').value);
        this.saveHistory = document.getElementById('save-history').checked;
        
        // Save to localStorage
        localStorage.setItem('god_mode', this.mode);
        localStorage.setItem('god_api_key', this.apiKey);
        localStorage.setItem('god_ollama_url', this.ollamaUrl);
        localStorage.setItem('god_ollama_model', this.ollamaModel);
        localStorage.setItem('god_theme', this.theme);
        localStorage.setItem('god_streaming', this.streaming);
        localStorage.setItem('god_voice', this.voiceEnabled);
        localStorage.setItem('god_voice_speed', this.voiceSpeed);
        localStorage.setItem('god_save_history', this.saveHistory);
        
        this.applyTheme();
        this.closeSettings();
        this.showToast('Settings saved', 'success');
    }

    applyTheme() {
        document.body.setAttribute('data-theme', this.theme);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--color-bg-secondary);
            border: 1px solid var(--color-border);
            border-left: 4px solid var(--color-${type === 'error' ? 'error' : type === 'success' ? 'success' : 'accent'});
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-xl);
            z-index: 2000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    generateId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
    }
`;
document.head.appendChild(style);

// Initialize
let god;
document.addEventListener('DOMContentLoaded', () => {
    god = new GODAssistant();
});
