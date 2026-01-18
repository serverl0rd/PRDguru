import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePRD } from '../../context/PRDContext';
import { supabase } from '../../supabase';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export default function ChatInterface() {
  const { currentPRD, messages, addMessage, updateField, isLoading, setIsLoading } = usePRD();
  const [input, setInput] = useState('');
  const [requiresUpgrade, setRequiresUpgrade] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({
          message: userMessage,
          currentPRD,
          history: messages.slice(-10),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // Check if upgrade is required
      if (data.requiresUpgrade) {
        setRequiresUpgrade(true);
      }

      addMessage('assistant', data.message);

      // Update PRD fields if AI suggests changes
      if (data.prdUpdates) {
        Object.entries(data.prdUpdates).forEach(([field, value]) => {
          if (value) {
            updateField(field, value);
          }
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b shrink-0">
        <h2 className="font-semibold">AI Assistant</h2>
        <p className="text-xs text-muted">Describe your product to create a PRD</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto scroll-area p-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted mb-4">
              Start by describing your product idea. I'll help you create a comprehensive PRD.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => setInput("I want to build a task management app for remote teams")}
                className="btn btn-ghost text-xs h-auto py-2 px-3 block w-full text-left"
              >
                "I want to build a task management app..."
              </button>
              <button
                onClick={() => setInput("Help me create a PRD for an e-commerce platform")}
                className="btn btn-ghost text-xs h-auto py-2 px-3 block w-full text-left"
              >
                "Help me create a PRD for an e-commerce..."
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
            ))}
            {isLoading && (
              <div className="message message-assistant">
                <span className="animate-pulse">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Upgrade Banner */}
      {requiresUpgrade && (
        <div className="p-3 bg-[var(--muted)] border-t shrink-0">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted">
              Add your API key or subscribe to use AI
            </p>
            <Link href="/app/settings" className="btn btn-primary h-8 text-xs px-3 shrink-0">
              Go to Settings
            </Link>
          </div>
        </div>
      )}

      {/* Input */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        disabled={isLoading}
      />
    </div>
  );
}
