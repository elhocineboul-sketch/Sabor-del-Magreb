import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Star, Heart, Search } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuCardProps {
  item: MenuItem;
  index: number;
  onAdd: (item: MenuItem) => void;
  onDetails?: (item: MenuItem) => void;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
  t?: (key: any) => string;
}

const MenuCard: React.FC<MenuCardProps> = ({ 
  item, 
  index, 
  onAdd, 
  onDetails, 
  onToggleFavorite, 
  isFavorite = false,
  t 
}) => {
  // Helper to safely translate or return key/fallback
  const translate = (key: string) => t ? t(key) : key;
  const currency = t ? translate('currency') : 'د.م';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full relative"
    >
      {/* Favorite Button (Only if handler provided) */}
      {onToggleFavorite && (
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-md transition-all duration-300 ${isFavorite ? 'bg-red-50 text-red-600 dark:bg-stone-800 dark:text-red-500' : 'bg-white/80 dark:bg-black/50 text-stone-400 hover:text-red-500 hover:bg-white dark:hover:bg-stone-800'}`}
        >
          <Heart size={20} className={isFavorite ? 'fill-red-600' : ''} />
        </button>
      )}

      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex gap-2">
           <span className="bg-white/90 dark:bg-stone-900/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm text-stone-800 dark:text-white">
             <Star size={12} className="text-amber-500 fill-amber-500" /> {item.rating}
           </span>
        </div>
      </div>

      <div className="p-4 md:p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2 md:mb-3">
          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 leading-tight line-clamp-2">{item.name}</h3>
          <span className="text-orange-600 dark:text-orange-500 font-black text-lg whitespace-nowrap">
            {item.price} <span className="text-xs">{currency}</span>
          </span>
        </div>
        
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-4 md:mb-6 line-clamp-2 flex-1">
          {item.description}
        </p>

        <div className="flex gap-2 md:gap-3 mt-auto">
          <button 
            onClick={() => onAdd(item)} 
            className="flex-1 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 py-2 md:py-3 rounded-xl font-bold hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/30 text-sm"
          >
            <Plus size={18} /> {t ? translate('addToCart') : 'Add'}
          </button>
          
          {onDetails && (
            <button 
              onClick={() => onDetails(item)} 
              className="px-3 py-2 md:px-4 md:py-3 border border-stone-200 dark:border-stone-700 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
            >
              <Search size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;