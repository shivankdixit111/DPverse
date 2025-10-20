import React, { useRef, useEffect, useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement("#root");

const BotModal = ({ url }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: '👋 Hello! I’m your AI Assistant. Want to see the solution for this problem?' }
  ]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const modalRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => scrollToBottom(), [messages]);

  const handleMouseDown = (e) => {
    if (modalRef.current.contains(e.target)) {
      setDragging(true);
      setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text: input }]);
    const query = input;
    setInput("");
    setLoading(true);

    const thinkingMessage = { sender: "bot", text: "💭 Bot is thinking..." };
    setMessages(prev => [...prev, thinkingMessage]);

    try {
      const response = await fetch("http://localhost:8080/api/problem/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: String(url), query })
      });
      const data = await response.json();

      setMessages(prev => prev.map(msg => msg === thinkingMessage ? { sender: "bot", text: data } : msg));
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.map(msg => msg === thinkingMessage ? { sender: "bot", text: "⚠️ Something went wrong. Try again!" } : msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold sm:px-6 sm:py-3 px-4 py-2 rounded-full shadow-xl hover:scale-105 transition transform duration-300'
      >
        Chat
      </button>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        style={{
          content: {
            position: 'absolute',
            left: position.x,
            top: position.y,
            transform: 'none',
            padding: 0,
            borderRadius: '2rem',
            width: '600px',
            maxWidth: '95%',
            maxHeight: '90vh',
            overflow: 'hidden',
            background: 'rgba(30,30,30,0.85)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'white',
          },
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: '80px',
            zIndex: 50
          }
        }}
      >
        <div
          ref={modalRef}
          onMouseDown={handleMouseDown}
          className='flex flex-col w-full h-full'
        >
          {/* Header */}
          <div className='flex justify-between items-center p-4 cursor-move border-b border-white/20'>
            <h2 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400'>
              💬 AI Assistant
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className='text-white hover:text-red-400 font-bold text-2xl'
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto p-4 space-y-3' style={{ minHeight: '180px' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[75%] p-3 rounded-2xl break-words shadow-lg whitespace-pre-wrap
                  ${msg.sender === 'bot'
                    ? 'bg-white/10 text-white mr-auto animate-fadeIn'
                    : 'bg-gradient-to-r from-green-400 to-green-500 text-white ml-auto animate-fadeInRight'
                  }`}
                style={{ backdropFilter: msg.sender === 'bot' ? 'blur(5px)' : 'none' }}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className='flex p-4 gap-2 border-t border-white/20'>
            <textarea
              rows={2}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='Ask your question...'
              className='flex-grow border border-white/20 rounded-2xl p-3 focus:ring-2 focus:ring-purple-400 outline-none bg-gray-900/80 text-white placeholder-white/70 resize-none shadow-inner'
            />
            <button
              type='submit'
              className='bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold px-6 py-2 rounded-2xl shadow-lg hover:scale-105 transition transform duration-200'
            >
              Send
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default BotModal;
