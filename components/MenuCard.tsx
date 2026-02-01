import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Star } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuCardProps {
  item: MenuItem;
  index: number;
  onAdd: (item: MenuItem) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, index, onAdd }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white dark:bg-stone-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-stone-100 dark:border-stone-700 h-full flex flex-col"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-stone-900/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-sm font-bold shadow-sm">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-stone-800 dark:text-white">{item.rating}</span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-stone-900 dark:text-white line-clamp-1">{item.name}</h3>
          <span className="text-xl font-black text-amber-600 dark:text-amber-500 whitespace-nowrap">
            {item.price} <span className="text-sm">د.م</span>
          </span>
        </div>
        
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-6 line-clamp-2 flex-1">
          {item.description}
        </p>

        <div className="flex items-center justify-between gap-4 mt-auto">
          <div className="flex gap-2 text-xs font-medium text-stone-400">
             {item.calories > 0 && <span>{item.calories} cal</span>}
             {item.spiciness > 0 && <span className="text-red-500">🌶️ {item.spiciness}%</span>}
          </div>
          <button
            onClick={() => onAdd(item)}
            className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 p-3 rounded-full hover:bg-amber-600 dark:hover:bg-amber-500 dark:hover:text-white transition-colors shadow-lg hover:shadow-amber-500/30 group-active:scale-95"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;