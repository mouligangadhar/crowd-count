import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { SendIcon, PaperclipIcon, ImageIcon, MoreVerticalIcon, PhoneIcon, VideoIcon } from 'lucide-react';
import { MobileLayout } from '../components/layout/MobileLayout';
import { Avatar } from '../components/ui/Avatar';
type Message = {
  id: number;
  sender: string;
  avatar?: string;
  content: string;
  time: string;
  isMe: boolean;
  type: 'text' | 'image' | 'alert';
};
const mockMessages: Message[] = [{
  id: 1,
  sender: 'Sarah Connor',
  content: 'Zone A is clearing up now.',
  time: '10:30 AM',
  isMe: false,
  type: 'text'
}, {
  id: 2,
  sender: 'John Smith',
  content: 'Copy that. Moving to Zone B.',
  time: '10:31 AM',
  isMe: true,
  type: 'text'
}, {
  id: 3,
  sender: 'System',
  content: 'Alert: High Density in Food Court',
  time: '10:32 AM',
  isMe: false,
  type: 'alert'
}, {
  id: 4,
  sender: 'Mike Ross',
  content: 'I am on it. Checking the cameras.',
  time: '10:33 AM',
  isMe: false,
  type: 'text'
}, {
  id: 5,
  sender: 'Mike Ross',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
  content: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
  time: '10:34 AM',
  isMe: false,
  type: 'image'
}, {
  id: 6,
  sender: 'John Smith',
  content: 'Looks crowded. Sending backup.',
  time: '10:35 AM',
  isMe: true,
  type: 'text'
}];
export function TeamChatScreen() {
  const [messages, setMessages] = useState(mockMessages);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(scrollToBottom, [messages]);
  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'John Smith',
      content: inputText,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      isMe: true,
      type: 'text'
    };
    setMessages([...messages, newMessage]);
    setInputText('');
  };
  return <MobileLayout title="Security Team" subtitle="5 members online" showBack rightAction={<div className="flex items-center gap-2">
          <button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-700">
            <PhoneIcon className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-700">
            <VideoIcon className="w-5 h-5" />
          </button>
        </div>} noPadding className="flex flex-col h-screen">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {messages.map(msg => <motion.div key={msg.id} initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-end gap-2 max-w-[80%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              {!msg.isMe && msg.type !== 'alert' && <Avatar name={msg.sender} src={msg.avatar} size="sm" />}

              {msg.type === 'alert' ? <div className="w-full flex justify-center my-2">
                  <div className="bg-neon-red/10 border border-neon-red/30 rounded-lg px-4 py-2 text-center">
                    <p className="text-neon-red text-sm font-medium">
                      {msg.content}
                    </p>
                    <p className="text-xs text-neon-red/60 mt-1">{msg.time}</p>
                  </div>
                </div> : <div className={`p-3 rounded-2xl ${msg.isMe ? 'bg-neon-cyan/20 text-white rounded-br-none border border-neon-cyan/30' : 'bg-dark-700 text-slate-200 rounded-bl-none'}`}>
                  {!msg.isMe && <p className="text-xs text-neon-cyan mb-1">{msg.sender}</p>}

                  {msg.type === 'image' ? <img src={msg.content} alt="Shared" className="rounded-lg mb-1 max-w-full" /> : <p className="text-sm">{msg.content}</p>}

                  <p className={`text-[10px] mt-1 text-right ${msg.isMe ? 'text-neon-cyan/60' : 'text-slate-500'}`}>
                    {msg.time}
                  </p>
                </div>}
            </div>
          </motion.div>)}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-dark-800 border-t border-dark-700">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-700">
            <PaperclipIcon className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-700">
            <ImageIcon className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-neon-cyan" />
          </div>
          <button onClick={handleSend} disabled={!inputText.trim()} className="p-2 rounded-xl bg-neon-cyan text-dark-900 hover:bg-neon-cyan/80 disabled:opacity-50 disabled:cursor-not-allowed">
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </MobileLayout>;
}