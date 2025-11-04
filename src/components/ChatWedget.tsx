import React, { useState, useRef, useEffect } from "react";
import "./chatWidget.css";

interface Message {
  text: string;
  source?: string;
  sender: "user" | "ai";
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
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you today?", sender: "ai", id: "0" },
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isInitPrompt, setInitPrompt] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

<<<<<<< HEAD
  const handleInputClick = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
=======
  const handleInputClick = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
>>>>>>> 47012565c193c8c5bbede67d36108ca8f4addcf5
    setInputValue(e.target.value);
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSendMessage = async (
    e:
      | React.MouseEvent<HTMLButtonElement>
<<<<<<< HEAD
      | React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
=======
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
>>>>>>> 47012565c193c8c5bbede67d36108ca8f4addcf5
  ) => {
    e.preventDefault();
    if (inputValue.trim() === "" || loading) return;

    const userMessageText = inputValue.trim();
    const userMessage: Message = {
      text: userMessageText,
      sender: "user",
      id: Date.now().toString(),
    };

    // Add user message immediately to UI and clear input
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setLoading(true);
    setError(null);

    try {
      const apiEndpoint = isInitPrompt
        ? config.apiEndpoint || "http://localhost:3000/api/chat"
        : config.apiEndpoint?.replace("/chat", "/chat/follow-up") ||
          "http://localhost:3000/api/chat/follow-up";

      const requestBody: { query: string; threadId?: string | null } = {
        query: userMessageText,
      };

      if (!isInitPrompt && threadId) {
        requestBody.threadId = threadId;
      }

      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to get response from AI");
      }

      // Set thread ID on first message
      if (isInitPrompt && data?.threadId) {
        setThreadId(data.threadId);
        setInitPrompt(false);
      }

      // Add AI response to messages
      const aiMessage: Message = {
        sender: "ai",
        text: data.answer?.text || "Sorry, I could not generate a response.",
        source: data.answer?.source,
        id: (Date.now() + 1).toString(),
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      setError(errorMessage);

      // Add error message to chat
      const errorMsg: Message = {
        sender: "ai",
        text: `Error: ${errorMessage}`,
        id: (Date.now() + 1).toString(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (
<<<<<<< HEAD
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
=======
    e: React.KeyboardEvent<HTMLTextAreaElement>
>>>>>>> 47012565c193c8c5bbede67d36108ca8f4addcf5
  ): void => {
    if (e.key === "Enter") {
      handleSendMessage(e);
    }
  };

  return (
    <>
      {/* Chat Widget Button */}
      <button
        className="chat-widget-button"
        onClick={() => setIsOpen(true)}
        aria-label="Open chat"
      >
        {config.logoImage ? (
          <img className="icon-image" src={config.logoImage} />
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
              style={{
                background: config.theme,
              }}
              className="chat-header"
            >
              <div className="chat-header-content">
                <div className="chat-avatar">
                  {config.logoImage ? (
                    <img
                      className="icon-image"
                      src={config.logoImage}
                      alt="logo"
                    />
                  ) : (
                    <span className="chat-avatar-text">AG</span>
                  )}
                </div>
                <div>
                  <h3 className="chat-title">
                    {config.botName ? `${config.botName}` : "AskGuru"}
                  </h3>
                </div>
              </div>
              <button
                className="chat-close-button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                ×
              </button>
            </div>

            {/* Messages Area */}
            <div className="chat-messages">
              {messages?.map((message) => (
                <div
                  key={message.id}
                  className={`chat-message ${
                    message.sender === "user" ? "user-message" : "ai-message"
                  }`}
                >
                  <div className="message-bubble">
                    {message.text}
                    {message.source && (
                      <div>
                        <p
                          style={{
                            marginTop: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          Sources:
                        </p>
                        <a
                          style={{ color: config.theme }}
                          href={message?.source}
                          target="_blank"
                        >
                          {message?.source}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="chat-message ai-message">
                  <div className="message-bubble ">
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

            {/* Input Area */}
            <div className="chat-input-container">
              <div className="chat-box">
                <textarea
                  className="chat-textarea"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={handleInputClick}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  rows={1}
                />
                <div className="chat-footer">
                  <button
                    style={{
                      background: config.theme,
                    }}
                    onClick={handleSendMessage}
                    className="chat-send-button"
                    aria-label="Send message"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loader"></span>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="white"
                        strokeWidth="2.2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14M12 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <span className="watermark">
              Powered by{" "}
              <a
                href="https://askguru-six.vercel.app/"
                className="askguru-brand"
              >
                AskGuru
              </a>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
