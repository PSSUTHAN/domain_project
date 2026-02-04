/**
 * Chatbot Widget JavaScript
 * Handles all chatbot functionality including UI interactions and API calls
 */

class Chatbot {
    constructor() {
        // Use the current page's origin to avoid CORS issues
        this.apiUrl = window.location.origin;
        this.isOpen = false;
        this.init();
    }

    init() {
        // Create chatbot HTML structure
        this.createChatbotHTML();

        // Attach event listeners
        this.attachEventListeners();

        // Show welcome message
        this.showWelcomeMessage();
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <!-- Chatbot Floating Button -->
            <button id="chatbot-button" aria-label="Open chatbot">
                💬
            </button>

            <!-- Chatbot Container -->
            <div id="chatbot-container">
                <div id="chatbot-header">
                    <h3>Engineers Veedu Assistant</h3>
                    <button id="chatbot-close" aria-label="Close chatbot">×</button>
                </div>
                <div id="chatbot-messages"></div>
                <div id="chatbot-input-area">
                    <input 
                        type="text" 
                        id="chatbot-input" 
                        placeholder="Ask me anything..."
                        autocomplete="off"
                    >
                    <button id="chatbot-send" aria-label="Send message">➤</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        const button = document.getElementById('chatbot-button');
        const closeBtn = document.getElementById('chatbot-close');
        const sendBtn = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');

        button.addEventListener('click', () => this.toggleChatbot());
        closeBtn.addEventListener('click', () => this.toggleChatbot());
        sendBtn.addEventListener('click', () => this.sendMessage());

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    toggleChatbot() {
        const container = document.getElementById('chatbot-container');
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            container.classList.add('active');
            document.getElementById('chatbot-input').focus();
        } else {
            container.classList.remove('active');
        }
    }

    showWelcomeMessage() {
        const messagesDiv = document.getElementById('chatbot-messages');
        const welcomeHTML = `
            <div class="welcome-message">
                <h4>👋 Welcome to Engineers Veedu!</h4>
                <p>I'm here to help you with information about our construction services, projects, and more.</p>
                <div class="suggested-questions">
                    <button class="suggestion-btn" data-question="What services do you offer?">
                        What services do you offer?
                    </button>
                    <button class="suggestion-btn" data-question="How can I get a quote?">
                        How can I get a quote?
                    </button>
                    <button class="suggestion-btn" data-question="What areas do you serve?">
                        What areas do you serve?
                    </button>
                    <button class="suggestion-btn" data-question="Tell me about your recent projects">
                        Tell me about your recent projects
                    </button>
                </div>
            </div>
        `;
        messagesDiv.innerHTML = welcomeHTML;

        // Add click handlers for suggestion buttons
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.getAttribute('data-question');
                document.getElementById('chatbot-input').value = question;
                this.sendMessage();
            });
        });
    }

    addMessage(content, isUser = false) {
        const messagesDiv = document.getElementById('chatbot-messages');

        // Remove welcome message if it exists
        const welcomeMsg = messagesDiv.querySelector('.welcome-message');
        if (welcomeMsg) {
            welcomeMsg.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
        messageDiv.textContent = content;

        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    showTypingIndicator() {
        const messagesDiv = document.getElementById('chatbot-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        messagesDiv.appendChild(typingDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();

        if (!message) return;

        // Add user message to chat
        this.addMessage(message, true);
        input.value = '';

        // Disable input while processing
        const sendBtn = document.getElementById('chatbot-send');
        sendBtn.disabled = true;
        input.disabled = true;

        // Show typing indicator
        this.showTypingIndicator();

        try {
            const response = await fetch(`${this.apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error('Failed to get response from chatbot');
            }

            const data = await response.json();

            // Remove typing indicator
            this.removeTypingIndicator();

            // Add bot response
            this.addMessage(data.response, false);

        } catch (error) {
            console.error('Error:', error);
            this.removeTypingIndicator();

            // Show error message with fallback
            const errorMessage = `I apologize, but I'm having trouble connecting to the server right now. 
            Please try again later or contact us directly at:
            
            📞 Phone: +1 (555) 123-4567
            ✉️ Email: support@contractorpro.com
            
            Our team is available Mon-Fri 8AM-6PM EST.`;

            this.addMessage(errorMessage, false);
        } finally {
            // Re-enable input
            sendBtn.disabled = false;
            input.disabled = false;
            input.focus();
        }
    }
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new Chatbot();
    });
} else {
    new Chatbot();
}
