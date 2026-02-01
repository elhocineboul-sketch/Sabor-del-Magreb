import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-white pt-16 pb-8 mt-20 rounded-t-[3rem]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Food Morocco
            </h3>
            <p className="text-stone-400 leading-relaxed mb-6">
              نقدم لكم تجربة فريدة من نوعها تجمع بين أصالة المطبخ المغربي ولمسات العصرية العالمية.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-stone-800 rounded-full hover:bg-amber-600 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="p-2 bg-stone-800 rounded-full hover:bg-amber-600 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="p-2 bg-stone-800 rounded-full hover:bg-amber-600 transition-colors"><Twitter size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">روابط سريعة</h4>
            <ul className="space-y-3 text-stone-400">
              <li><a href="#" className="hover:text-amber-500 transition-colors">الرئيسية</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">القائمة</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">عن المطعم</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">اتصل بنا</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">ساعات العمل</h4>
            <ul className="space-y-3 text-stone-400">
              <li className="flex justify-between"><span>الإثنين - الخميس</span> <span>10:00 - 23:00</span></li>
              <li className="flex justify-between"><span>الجمعة</span> <span>14:00 - 00:00</span></li>
              <li className="flex justify-between"><span>السبت - الأحد</span> <span>10:00 - 01:00</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">تواصل معنا</h4>
            <ul className="space-y-4 text-stone-400">
              <li className="flex gap-3 items-start">
                <MapPin className="text-amber-500 shrink-0" size={20} />
                <span>شارع محمد الخامس، الدار البيضاء، المغرب</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="text-amber-500 shrink-0" size={20} />
                <span dir="ltr">+212 5 22 33 44 55</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="text-amber-500 shrink-0" size={20} />
                <span>contact@foodmorocco.ma</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-stone-800 pt-8 text-center text-stone-500 text-sm">
          <p>© {new Date().getFullYear()} Food Morocco. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;