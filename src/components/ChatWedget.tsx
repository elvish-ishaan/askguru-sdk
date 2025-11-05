import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './chatWidget.css';

interface Message {
  text: string;
  source?: string;
  sender: 'user' | 'ai';
  id: string;
}

interface ChatWidgetConfig {
  apiKey: string;
  logoImage?: string;
  apiEndpoint?: string;
  welcomeMessage?: string;
  botName?: string;
  theme?: string;
}

interface ChatWidgetProps {
  config: ChatWidgetConfig;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ config }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isInitPrompt, setInitPrompt] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (error) setError(null);
  };

  const handleSendMessage = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (inputValue.trim() === '' || loading) return;

    // Hide onboarding after first message
    if (showOnboarding) {
      setShowOnboarding(false);
    }

    const userMessageText = inputValue.trim();
    const userMessage: Message = {
      text: userMessageText,
      sender: 'user',
      id: Date.now().toString()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setLoading(true);
    setError(null);

    try {
      const apiEndpoint = isInitPrompt 
        ? config.apiEndpoint || "http://localhost:3000/api/chat"
        : config.apiEndpoint?.replace('/chat', '/chat/follow-up') || "http://localhost:3000/api/chat/follow-up";

      const requestBody: { query: string; threadId?: string | null } = {
        query: userMessageText
      };

      if (!isInitPrompt && threadId) {
        requestBody.threadId = threadId;
      }

      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to get response from AI');
      }

      if (isInitPrompt && data?.threadId) {
        setThreadId(data.threadId);
        setInitPrompt(false);
      }

      const aiMessage: Message = {
        sender: 'ai',
        text: data.answer?.text || 'Sorry, I could not generate a response.',
        source: data.answer?.source,
        id: (Date.now() + 1).toString()
      };

      setMessages(prevMessages => [...prevMessages, aiMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      
      const errorMsg: Message = {
        sender: 'ai',
        text: `Error: ${errorMessage}`,
        id: (Date.now() + 1).toString()
      };
      setMessages(prevMessages => [...prevMessages, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSendMessage(e);
    }
  };

  const userName = "Anwar"; // You can make this configurable

  return (
    <>
      {/* Chat Widget Button */}
      <button
        className="chat-widget-button"
        onClick={() => setIsOpen(true)}
        aria-label="Open chat"
      >
        {config.logoImage ? (
          <img className='widget-logo' src={config.logoImage} alt="Chat" />
        ) : (
          <span className="chat-widget-text">AG</span>
        )}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="chat-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div 
              style={{ background: config.theme || 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }} 
              className="chat-header"
            >
              <div className="chat-header-content">
                <div className="chat-avatar">
                  {config.logoImage ? (
                    <img className='avatar-image' src={config.logoImage} alt="logo" />
                  ) : (
                    <span className="chat-avatar-text">AG</span>
                  )}
                </div>
                <div>
                  <h3 className="chat-title">{config.botName || "AskGuru"}</h3>
                </div>
              </div>
              <button
                className="chat-close-button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            {/* Onboarding Screen */}
            {showOnboarding && messages.length === 0 && (
              <div className="onboarding-screen">
                <div className="onboarding-content" style={{
                  color: config.theme
                }}>
                  <div className="onboarding-avatar">
                    {config.logoImage ? (
                      <img src={config.logoImage} alt="Bot Avatar" className="onboarding-avatar-img" />
                    ) : (
                      <div className="onboarding-avatar-placeholder">
                        <span>AG</span>
                      </div>
                    )}
                  </div>
                  <h2 className="onboarding-greeting" style={{
                    color: config.theme
                  }}>
                    Hi there
                  </h2>
                  <p className="onboarding-subtext">
                    What&apos;s on <span className="highlight-text">your mind?</span>
                  </p>
                </div>
              </div>
            )}

            {/* Messages Area */}
            {!showOnboarding && (
              <div className="chat-messages">
                {messages?.map((message) => (
                  <div
                    key={message.id}
                    className={`chat-message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
                  >
                    <div className="message-bubble">
                      {message.sender === 'ai' ? (
                        <ReactMarkdown
                          components={{
                            //@ts-expect-error fix inline type
                            code({ inline, className, children, ...props }) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <SyntaxHighlighter
                                //@ts-expect-error fix overload
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                          {message.text}
                        </ReactMarkdown>
                      ) : (
                        message.text
                      )}
                      {message.source && (
                        <div className="message-source">
                          <p className="source-label">Sources:</p>
                          <a 
                            style={{ color: config.theme || '#4F46E5' }} 
                            href={message.source} 
                            target='_blank' 
                            rel="noopener noreferrer"
                          >
                            {message.source}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="chat-message ai-message">
                    <div className="message-bubble loading-bubble">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input Area */}
            <div className="chat-input-container">
              <div className="input-wrapper">
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Ask me anything..."
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
                <button
                  onClick={handleSendMessage}
                  className="chat-send-button"
                  style={{ 
                    background: config.theme || 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)' 
                  }}
                  aria-label="Send message"
                  disabled={loading || !inputValue.trim()}
                >
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <span className='watermark'>
              Powered by <span className='askguru-brand'>AskGuru</span>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;