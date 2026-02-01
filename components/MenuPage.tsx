import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MenuCard from './MenuCard';
import { getMenuItemsByCategory } from '../services/supabase';
import { MenuItem } from '../types';

interface MenuPageProps {
  navbar: React.ReactNode;
  footer: React.ReactNode;
  onAdd: (item: MenuItem) => void;
}

const categories = [
  { id: 'all', name: 'الكل', nameAr: 'الكل' },
  { id: 'burger', name: 'برجر', nameAr: 'برجر' },
  { id: 'pizza', name: 'بيتزا', nameAr: 'بيتزا' },
  { id: 'shawarma', name: 'شاورما', nameAr: 'شاورما' },
  { id: 'kebab', name: 'كباب', nameAr: 'كباب' },
  { id: 'drinks', name: 'مشروبات', nameAr: 'مشروبات' },
];

export default function MenuPage({ navbar, footer, onAdd }: MenuPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenuItems();
  }, [selectedCategory]);

  const loadMenuItems = async () => {
    setLoading(true);
    const items = await getMenuItemsByCategory(selectedCategory);
    setMenuItems(items);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-950" dir="rtl">
      {navbar}
      
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-amber-900 dark:text-amber-500 mb-4">قائمة الطعام</h1>
          <p className="text-xl text-amber-700 dark:text-amber-200/80">اكتشف أشهى الأطباق المغربية والعالمية</p>
        </motion.div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedCategory === category.id
                  ? 'bg-amber-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-stone-800 text-amber-900 dark:text-stone-200 hover:bg-amber-100 dark:hover:bg-stone-700'
              }`}
            >
              {category.nameAr}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-600"></div>
            <p className="mt-4 text-amber-700 dark:text-amber-500 text-xl">جاري التحميل...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.map((item, index) => (
              <MenuCard key={item.id} item={item} index={index} onAdd={onAdd} />
            ))}
          </div>
        )}

        {!loading && menuItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-amber-700 dark:text-stone-400">لا توجد عناصر في هذه الفئة</p>
          </div>
        )}
      </div>

      {footer}
    </div>
  );
}