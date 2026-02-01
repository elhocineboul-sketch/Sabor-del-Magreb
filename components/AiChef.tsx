import React, { useState } from 'react';
import { Bot, Send, X, Loader2 } from 'lucide-react';
import { getMenuRecommendation } from '../services/geminiService';
import { MenuItem } from '../types';

interface AiChefProps {
  menuItems: MenuItem[];
}

const AiChef: React.FC<AiChefProps> = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResponse(null);
    const result = await getMenuRecommendation(query, menuItems);
    setResponse(result);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 z-40 p-4 rounded-full shadow-lg transition-transform hover:scale-110 ${isOpen ? 'scale-0' : 'scale-100'} bg-orange-600 text-white`}
      >
        <Bot size={28} />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 left-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-orange-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Bot size={24} />
            <span className="font-bold">مساعد الطلب الذكي</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 h-64 overflow-y-auto bg-stone-50 flex flex-col gap-3">
          <div className="bg-stone-200 text-stone-800 p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl self-start text-sm max-w-[90%]">
            مرحباً! أنا "شيف AI". محتار ماذا تطلب؟ أخبرني ماذا تشتهي (حار، حلو، كبير...) وسأساعدك! 🍔🌮
          </div>
          
          {query && response && (
             <div className="bg-red-50 text-stone-800 p-3 rounded-tl-xl rounded-bl-xl rounded-br-xl self-end text-sm max-w-[90%] border border-red-100">
               {query}
             </div>
          )}

          {isLoading && (
            <div className="self-start text-orange-600 animate-pulse flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" /> يفكر الشيف...
            </div>
          )}

          {response && (
            <div className="bg-amber-50 text-stone-900 p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl self-start text-sm max-w-[90%] border border-amber-200">
              {response}
            </div>
          )}
        </div>

        <div className="p-3 border-t bg-white flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="أريد شيئاً حاراً مع الدجاج..."
            className="flex-1 bg-stone-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
          />
          <button 
            onClick={handleAsk}
            disabled={isLoading || !query.trim()}
            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
};

export default AiChef;