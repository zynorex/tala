'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import { DefaultChatTransport } from 'ai';
import Image from 'next/image';
import { X, Send, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

type AiChatWidgetProps = {
  chatEnabled: boolean;
};

const ASSISTANT_NAME = 'T.A.R.A.';
const ASSISTANT_FULL_FORM = 'Trustworthy AI Response Assistant';
const ASSISTANT_AVATAR_SRC = '/tara.png';

export default function AiChatWidget({ chatEnabled }: AiChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    onError: (err) => {
      // Toast message if rate limit is reached
      if (err.message.includes('403') || err.message.toLowerCase().includes('free')) {
        toast.error('Free trial limit reached. Upgrade to Premium for unlimited chats.');
      } else {
        toast.error('Failed to communicate with AI server.');
      }
    }
  });

  const isLoading = status === 'submitted' || status === 'streaming';
  const isRateLimited =
    (error?.message?.includes('403') ?? false) ||
    (error?.message?.toLowerCase().includes('free') ?? false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const prompt = input.trim();
    if (!chatEnabled || !prompt || isLoading || isRateLimited) {
      return;
    }

    await sendMessage({ text: prompt });
    setInput('');
  };

  const getMessageContent = (message: (typeof messages)[number]) => {
    return message.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('');
  };

  const toggleChat = () => setIsOpen(!isOpen);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && chatEnabled && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl mb-4 w-[350px] sm:w-[400px] h-[550px] flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right scale-100">
          
          {/* Header */}
          <div className="bg-zinc-950 text-white p-4 flex justify-between items-center rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <span className="relative inline-flex h-6 w-6 overflow-hidden rounded-md border border-zinc-700">
                <Image
                  src={ASSISTANT_AVATAR_SRC}
                  alt="T.A.R.A. avatar"
                  fill
                  sizes="24px"
                  className="object-cover"
                />
              </span>
              <span className="font-semibold text-sm tracking-wide">{ASSISTANT_NAME}</span>
            </div>
            <button onClick={toggleChat} className="text-zinc-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-zinc-50 dark:bg-zinc-950/50 space-y-4 text-sm">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 dark:text-zinc-400 p-6 space-y-3">
                <span className="relative inline-flex h-14 w-14 overflow-hidden rounded-xl border-2 border-zinc-300 dark:border-zinc-700">
                  <Image
                    src={ASSISTANT_AVATAR_SRC}
                    alt="T.A.R.A. avatar"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </span>
                <p>Hi there! Need help with your vaults or smart contracts? I\'m here to guide you.</p>
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex space-x-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                    {/* Avatar Bubble */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-zinc-200 dark:bg-zinc-800' : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'}`}>
                      {m.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <span className="relative inline-flex h-8 w-8 overflow-hidden rounded-full border border-emerald-300 dark:border-emerald-700">
                          <Image
                            src={ASSISTANT_AVATAR_SRC}
                            alt="T.A.R.A. avatar"
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </span>
                      )}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`p-3 rounded-2xl ${
                      m.role === 'user' 
                        ? 'bg-zinc-900 text-white rounded-tr-sm' 
                        : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-sm shadow-sm'
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{getMessageContent(m)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-2xl rounded-tl-sm flex items-center space-x-2 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Error Message */}
            {error && (
              <div className="flex justify-center my-4">
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 px-4 py-3 rounded-xl flex items-start space-x-3 max-w-[90%]">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-xs font-medium">
                    {isRateLimited 
                      ? 'You have reached your free plan chat limit.' 
                      : 'An error occurred. Please try again later.'}
                  </p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading || isRateLimited}
                placeholder={isRateLimited ? 'Chat limit reached.' : 'Type a message...'}
                className="flex-1 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 border-none outline-none rounded-xl text-sm focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading || isRateLimited}
                className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 p-2.5 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <div className="mt-2 text-center">
               <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">AI can make mistakes. Verify important info.</span>
            </div>
          </div>
        </div>
      )}

      {isOpen && !chatEnabled && (
        <div className="mb-4 w-[350px] sm:w-[400px] border-4 border-black bg-cream text-dark shadow-brutal overflow-hidden animate-slideUp">
          <div className="border-b-4 border-black bg-accent px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative inline-flex h-6 w-6 overflow-hidden rounded border-2 border-black bg-black">
                <Image
                  src={ASSISTANT_AVATAR_SRC}
                  alt="T.A.R.A. avatar"
                  fill
                  sizes="24px"
                  className="object-cover"
                />
              </span>
              <span className="text-xs font-black tracking-[0.08em] uppercase">{ASSISTANT_NAME} Console</span>
            </div>
            <button onClick={toggleChat} className="bg-black text-cream p-1.5 border-2 border-black hover:bg-dark">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 sm:p-5">
            <div className="border-4 border-black bg-heirlock-blue p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.08em] text-black">Status: Disabled</p>
              <h3 className="mt-2 text-lg font-black uppercase leading-tight">T.A.R.A. is temporarily offline.</h3>
              <p className="mt-3 text-sm font-semibold leading-relaxed">
                We're fine-tuning the assistant for a better launch experience. It will be available again soon.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="border-4 border-black bg-heirlock-pink p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.08em]">Mode</p>
                <p className="mt-1 text-sm font-extrabold">Maintenance</p>
              </div>
              <div className="border-4 border-black bg-accent-light p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.08em]">ETA</p>
                <p className="mt-1 text-sm font-extrabold">Opening Soon</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="relative">
        <button
          onClick={toggleChat}
          className={`peer ${
            isOpen ? 'bg-dark scale-90' : chatEnabled ? 'bg-black hover:scale-105' : 'bg-accent hover:scale-105'
          } text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group z-50 border-2 border-black`}
          aria-label={`Open ${ASSISTANT_NAME}`}
          title={`${ASSISTANT_NAME} - ${ASSISTANT_FULL_FORM}`}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-cream group-hover:rotate-90 transition-transform duration-300" />
          ) : (
            <span className="relative inline-flex h-7 w-7 overflow-hidden rounded-full border border-white/70 group-hover:-translate-y-0.5 transition-transform duration-300">
              <Image
                src={ASSISTANT_AVATAR_SRC}
                alt="T.A.R.A. avatar"
                fill
                sizes="28px"
                className="object-cover"
              />
            </span>
          )}
        </button>
        <div className="pointer-events-none absolute right-16 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap border-2 border-black bg-cream px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-dark opacity-0 translate-x-2 transition-all duration-200 peer-hover:translate-x-0 peer-hover:opacity-100 peer-focus-visible:translate-x-0 peer-focus-visible:opacity-100">
          {ASSISTANT_NAME} - {ASSISTANT_FULL_FORM}
        </div>
      </div>
    </div>
  );
}