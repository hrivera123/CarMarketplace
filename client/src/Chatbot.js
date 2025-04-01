import React, { useState } from 'react';
import './Chatbot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false); // Track whether the chatbot is open or minimized
  const [messages, setMessages] = useState([]);
  const faqQuestions = [
    "How to list a car?",
    "How do I create an account?",
    "How do I contact the seller?", 
    "How do I use the 'Car Make/Model Classification'?", 
    "How do I view my listings?",
    "What if I don't know my car's make or model?",
    "How do I know if someone is interested in my car?",
    "My question isn't listed, what do I do?"
  ];

  const handleQuestionClick = async (question) => {
    setMessages([...messages, { sender: 'User', text: question }]);

    try {
      const response = await fetch('http://localhost:5001/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setMessages([...messages, { sender: 'User', text: question }, { sender: 'Bot', text: data.answer }]);
    } catch (error) {
      setMessages([...messages, { sender: 'Bot', text: "Sorry, there was an issue retrieving the answer." }]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const input = e.target.elements.chatInput.value.trim();
    if (!input) return;

    setMessages([...messages, { sender: 'User', text: input }]);
    e.target.elements.chatInput.value = '';

    try {
      const response = await fetch('http://localhost:5001/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });
      const data = await response.json();
      setMessages([...messages, { sender: 'User', text: input }, { sender: 'Bot', text: data.answer }]);
    } catch (error) {
      setMessages([...messages, { sender: 'Bot', text: "Sorry, there was an issue retrieving the answer." }]);
    }
  };

  return (
    <div>
      {/* Button to toggle chatbot visibility */}
      <button 
        className="toggle-chatbot-button" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "–" : "Chat"}
      </button>

      {/* Conditionally render the chatbot */}
      {isOpen && (
        <div className="chatbot">
          <div className="chatbot-header">
            <img src="/botlogo.png" alt="Bot Logo" className="bot-logo" />
            <h3>ChatBot</h3>
            <button 
              className="close-button" 
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
          </div>
          <div className="chatbot-body">
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender === 'User' ? 'user' : 'bot'}`}>
                  <strong>{msg.sender}:</strong> {msg.text}
                </div>
              ))}
            </div>
            <div className="faq-buttons">
              {faqQuestions.map((question, index) => (
                <button key={index} onClick={() => handleQuestionClick(question)} className="faq-button">
                  {question}
                </button>
              ))}
            </div>
          </div>
          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              name="chatInput"
              placeholder="Type your message..."
              className="input-box"
            />
            <button type="submit" className="send-button">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
