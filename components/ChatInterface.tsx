import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { chatWithMentor } from '../services/geminiService';
import { Send, Bot, User, Loader2, Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I'm your Python Mentor. As a Senior Dart dev, you probably have specific questions about how things translate (e.g., \"How do I do Mixins?\" or \"Is there a `Future.wait` equivalent?\"). \n\nI also specialize in `uv` for package management. Ask me anything!",
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await chatWithMentor(
        messages.map(m => ({ role: m.role, text: m.text })),
        userMsg.text
    );

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-3xl gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                ${msg.role === 'user' ? 'bg-blue-600' : 'bg-yellow-600'}
              `}>
                {msg.role === 'user' ? <User size={20} className="text-white" /> : <Bot size={20} className="text-white" />}
              </div>
              
              <div className={`
                rounded-2xl px-6 py-4 shadow-md
                ${msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'}
              `}>
                {msg.role === 'model' ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className="bg-slate-900/50 px-1 py-0.5 rounded font-mono text-xs" {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="flex max-w-3xl gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-600 flex items-center justify-center">
                        <Loader2 size={20} className="animate-spin text-white" />
                    </div>
                    <div className="bg-slate-800 rounded-2xl rounded-tl-none px-6 py-4 flex items-center gap-2 text-slate-400">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about 'uv sync', 'list comprehensions', or 'asyncio vs Futures'..."
            className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none h-16 scrollbar-hide"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="max-w-4xl mx-auto mt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-1">
            <Terminal size={12} />
            <span>Pro tip: Ask "How do I replace pubspec.yaml with uv?"</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
