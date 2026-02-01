import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ShoppingBag, MapPin, Phone, Facebook, Instagram, Twitter, 
  Menu as MenuIcon, X, Trash2, Plus, Minus, Search, CheckCircle, Clock,
  Database, FileSpreadsheet, Download, RefreshCw, ChevronLeft, ChevronRight,
  Package, LayoutList, Image as ImageIcon, Edit2, Bike, Save, AlertCircle, LogOut, User as UserIcon, LogIn,
  Lock, UserPlus, Mail, Loader2, Wallet, TrendingUp, Users, MessageSquare, Star, Check, ArrowRight, Heart,
  Home, UtensilsCrossed, Info, LayoutDashboard, Globe, ChevronDown, Bell, Settings, LogOut as LogoutIcon,
  ChefHat, XCircle, ShieldCheck, Moon, Sun, ShoppingCart, Navigation, Smartphone, Flame, Upload, Link as LinkIcon, Gift,
  UserX, SaveAll, Camera
} from 'lucide-react';

// Import Supabase services
import { supabase, uploadImage, compressImage, getMenuItems, getOrders, createOrder, getReviews, updateReviewStatus } from './services/supabase';
import { CATEGORIES, MENU_ITEMS_BY_LANG, ADMIN_USERNAME, ADMIN_PASSWORD, DRIVER_USERNAME, DRIVER_PASSWORD, MOCK_CURRENT_USER_KEY } from './constants';
import { MenuItem, CartItem, Order, ViewState, Category, Review } from './types';
import AiChef from './components/AiChef';
import MenuPage from './components/MenuPage';
import Footer from './components/Footer';

// -- Translation Dictionary --
const translations = {
  ar: {
    home: 'الرئيسية', menu: 'القائمة', track: 'تتبع الطلب', about: 'من نحن', contact: 'اتصل بنا',
    login: 'تسجيل الدخول', register: 'إنشاء حساب', logout: 'تسجيل الخروج', cart: 'سلة المشتريات', addToCart: 'أضف',
    details: 'التفاصيل', currency: 'د.م',
    heroTitle1: 'نكهات', heroTitle2: 'مغربية', heroTitle3: 'بلمسة', heroTitle4: 'عصرية',
    heroSubtitle: 'اكتشف المزيج الفريد بين الطبخ المغربي العريق ومأكولات الشارع الحديثة في تجربة لا تُنسى.',
    orderNow: 'اطلب الآن', watchVideo: 'شاهد الفيديو',
    mostOrdered: 'الأكثر طلباً', specialOffers: 'عروض مميزة لك',
    whyUs: 'لماذا يختارنا الجميع؟',
    freshDaily: 'طازج يومياً', freshDailyDesc: 'نحضر مكوناتنا من المزارع المحلية كل صباح.',
    fastDelivery: 'توصيل البرق', fastDeliveryDesc: 'نلتزم بوقت توصيل لا يتجاوز 30 دقيقة.',
    authenticTaste: 'نكهة أصيلة', authenticTasteDesc: 'توابل مغربية سرية تعيدك لأجواء مراكش.',
    menuTitle: 'قائمة الطعام', menuSubtitle: 'اختر ما يناسب ذوقك من تشكيلتنا الواسعة',
    trackTitle: 'تتبع الطلب', trackSubtitle: 'تابع حالة طلبك الحالي مباشرة',
    searchPlaceholder: 'رقم الطلب (مثلاً ORD-1234)', searchButton: 'بحث',
    statusReceived: 'تم الاستلام', statusPreparing: 'قيد التحضير', statusDelivering: 'جاري التوصيل', statusCompleted: 'تم التوصيل', statusCancelled: 'ملغي',
    statusPending: 'جديد',
    currentStatus: 'الحالة الحالية',
    preparingMsg: 'نقوم بتجهيز أشهى المكونات لك', deliveringMsg: 'السائق في طريقه إليك', completedMsg: 'نتمنى لك وجبة شهية!',
    timeRemaining: 'الوقت المتبقي', notFound: 'عذراً، لم نتمكن من العثور على طلب بهذا الرقم.',
    dashboard: 'لوحة القيادة', adminWelcome: 'مرحباً بك، لديك تحديثات جديدة اليوم.',
    totalSales: 'المبيعات', totalOrders: 'الطلبات', pendingOrders: 'قيد الانتظار', products: 'المنتجات', reviews: 'التقييمات',
    addProduct: 'إضافة منتج', editProduct: 'تعديل المنتج', edit: 'تعديل', delete: 'حذف', approve: 'قبول',
    welcomeBack: 'مرحباً بعودتك', joinUs: 'انضم إلينا', email: 'البريد الإلكتروني', username: 'الاسم', password: 'كلمة المرور',
    phone: 'رقم الهاتف', phonePlaceholder: '+57 ...', namePlaceholder: 'الاسم الكامل',
    loginBtn: 'دخول', registerBtn: 'تسجيل', noAccount: 'ليس لديك حساب؟', haveAccount: 'لديك حساب بالفعل؟', registerNow: 'سجل الآن',
    cartEmpty: 'السلة فارغة حالياً', browseMenu: 'تصفح القائمة', total: 'المجموع الكلي', checkout: 'إتمام الطلب', cancel: 'إلغاء', confirm: 'تأكيد', save: 'حفظ',
    burger: 'برجر', tacos: 'تاكوس', pizza: 'بيتزا', drinks: 'مشروبات', desserts: 'حلويات', all: 'الكل', shawarma: 'شاورما', kebab: 'كباب',
    productName: 'اسم المنتج', productPrice: 'السعر', productCategory: 'التصنيف', productDesc: 'الوصف', productImage: 'رابط الصورة',
    fillAllFields: 'يرجى ملء جميع الحقول',
    overview: 'نظرة عامة', settings: 'الإعدادات', backToSite: 'العودة للموقع', weeklySales: 'المبيعات الأسبوعية', recentActivity: 'النشاط الحديث',
    maintenanceMode: 'وضع الصيانة', allowRegistration: 'السماح بالتسجيل', saveChanges: 'حفظ التغييرات',
    adminAccess: 'الدخول كمسؤول',
    calories: 'سعر حراري', spiciness: 'توابل (0-100)', sweetness: 'حلاوة (0-100)', protein: 'بروتين (غ)', carbs: 'نشويات (غ)',
    orders: 'الطلبات',
    actionAccept: 'قبول الطلب', actionReject: 'رفض', actionPrepare: 'بدء التحضير', actionDeliver: 'إرسال للتوصيل', actionComplete: 'إكمال الطلب',
    adminLoginTitle: 'بوابة الإدارة', adminLoginDesc: 'يرجى إدخال بيانات المسؤول للمتابعة', accessDenied: 'بيانات غير صحيحة',
    useAdminPortal: 'يرجى استخدام أيقونة القفل لتسجيل دخول المسؤولين',
    usernameReserved: 'اسم المستخدم هذا محجوز',
    statusApproved: 'منشور', statusRejected: 'مرفوض',
    myProfile: 'ملفي الشخصي', favorites: 'المفضلات', noFavorites: 'لا توجد مفضلات بعد', backToMenu: 'تصفح القائمة',
    darkMode: 'الوضع الداكن',
    myOrders: 'طلباتي', noOrders: 'لا توجد طلبات سابقة', orderId: 'رقم الطلب', date: 'التاريخ', status: 'الحالة',
    trackStep1: 'تم الاستلام', trackStep2: 'قيد التحضير', trackStep3: 'جاري التوصيل', trackStep4: 'تم التسليم',
    confirmationCode: 'رمز التأكيد',
    driverLogin: 'دخول السائق', driverPortal: 'بوابة التوصيل', enterCode: 'أدخل رمز التأكيد', verifyAndComplete: 'تحقق وإكمال', invalidCode: 'رمز خاطئ',
    readyForPickup: 'جاهز للاستلام', pickup: 'استلام الطلب', deliver: 'توصيل',
    imageSource: 'مصدر الصورة', fromUrl: 'رابط خارجي', fromDevice: 'تحميل من الجهاز', uploadText: 'اضغط لاختيار صورة',
    uploading: 'جاري الرفع...',
    checkoutTitle: 'إتمام الطلب', deliveryAddress: 'عنوان التوصيل', addressPlaceholder: 'الشارع، رقم المنزل...', locateMe: 'مشاركة موقعي (GPS)', confirmOrder: 'تأكيد الطلب',
    locating: 'جاري تحديد الموقع...', locationError: 'تعذر تحديد الموقع',
    enableGPS: 'يرجى تفعيل GPS والموافقة على تحديد الموقع',
    locationPermissionDenied: 'تم رفض الإذن. يرجى السماح بالوصول للموقع',
    locationUnavailable: 'الموقع غير متاح. تأكد من تفعيل GPS',
    locationTimeout: 'انتهت مهلة الطلب',
    locationFetched: 'تم إرفاق الموقع بنجاح',
    openInMaps: 'فتح الموقع في الخرائط',
    locationShared: 'تم مشاركة الموقع',
    codeInstruction: 'أعط هذا الرمز للسائق عند الاستلام',
    loyaltyProgram: 'برنامج الولاء',
    loyaltyDesc: 'اطلب 10 وجبات واحصل على وجبة لشخصين مجاناً!',
    ordersCount: 'عدد الطلبات',
    rewardUnlocked: 'مبروك! لقد فزت بوجبة مجانية لشخصين! 🎉',
    rewardInstruction: 'أظهر هذه الشاشة للكاشير عند طلبك القادم.',
    keepGoing: 'أنت قريب! واصل الطلب.',
    sliderSettings: 'إعدادات السلايدر',
    addSliderImage: 'إضافة صورة للسلايدر',
    addImage: 'إضافة',
    sliderImages: 'صور العرض الحالية',
    editProfile: 'تعديل الملف الشخصي',
    deleteAccount: 'حذف الحساب',
    deleteConfirm: 'هل أنت متأكد من حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.',
    update: 'تحديث',
    changePhoto: 'تغيير الصورة',
    profileImage: 'صورة الملف الشخصي (رابط)',
    language: 'اللغة'
  },
  es: {
    home: 'Inicio', menu: 'Menú', track: 'Rastrear', about: 'Nosotros', contact: 'Contacto',
    login: 'Iniciar Sesión', register: 'Registrarse', logout: 'Cerrar Sesión', cart: 'Carrito', addToCart: 'Añadir',
    details: 'Detalles', currency: 'MAD',
    heroTitle1: 'Sabores', heroTitle2: 'Marroquíes', heroTitle3: 'Toque', heroTitle4: 'Moderno',
    heroSubtitle: 'Descubre la fusión única entre la cocina tradicional marroquí y la comida callejera moderna en una experiencia inolvidable.',
    orderNow: 'Pedir Ahora', watchVideo: 'Ver Video',
    mostOrdered: 'Más Pedidos', specialOffers: 'Ofertas Especiales',
    whyUs: '¿Por qué elegirnos?',
    freshDaily: 'Fresco a Diario', freshDailyDesc: 'Ingredientes locales seleccionados cada mañana.',
    fastDelivery: 'Envío Rápido', fastDeliveryDesc: 'Compromiso de entrega en menos de 30 minutos.',
    authenticTaste: 'Sabor Auténtico', authenticTasteDesc: 'Especias secretas que te transportan a Marrakech.',
    menuTitle: 'Nuestro Menú', menuSubtitle: 'Elige entre nuestra amplia selección',
    trackTitle: 'Seguimiento', trackSubtitle: 'Sigue el estado de tu pedido en tiempo real',
    searchPlaceholder: 'Nº de Pedido (ej: ORD-1234)', searchButton: 'Buscar',
    statusReceived: 'Recibido', statusPreparing: 'Preparando', statusDelivering: 'En Camino', statusCompleted: 'Entregado', statusCancelled: 'Cancelado',
    statusPending: 'Nuevo',
    currentStatus: 'Estado Actual',
    preparingMsg: 'Estamos preparando los mejores ingredientes para ti', deliveringMsg: 'El conductor está en camino', completedMsg: '¡Que disfrutes tu comida!',
    timeRemaining: 'Tiempo restante', notFound: 'Lo sentimos, no encontramos un pedido con ese número.',
    dashboard: 'Panel de Control', adminWelcome: 'Bienvenido, tienes nuevas actualizaciones hoy.',
    totalSales: 'Ventas', totalOrders: 'Pedidos', pendingOrders: 'Pendientes', products: 'Productos', reviews: 'Reseñas',
    addProduct: 'Añadir Producto', editProduct: 'Editar Producto', edit: 'Editar', delete: 'Eliminar', approve: 'Aprobar',
    welcomeBack: 'Bienvenido de nuevo', joinUs: 'Únete a nosotros', email: 'Correo Electrónico', username: 'Nombre de Usuario', password: 'Contraseña',
    phone: 'Teléfono', phonePlaceholder: '+212 ...', namePlaceholder: 'Nombre Completo',
    loginBtn: 'Entrar', registerBtn: 'Registrar', noAccount: '¿No tienes cuenta?', haveAccount: '¿Ya tienes cuenta?', registerNow: 'Regístrate ahora',
    cartEmpty: 'Tu carrito está vacío', browseMenu: 'Ver Menú', total: 'Total', checkout: 'Finalizar Pedido', cancel: 'Cancelar', confirm: 'Confirmar', save: 'Guardar',
    burger: 'Hamburguesas', tacos: 'Tacos', pizza: 'Pizza', drinks: 'Bebidas', desserts: 'Postres', all: 'Todo', shawarma: 'Shawarma', kebab: 'Kebab',
    productName: 'Nombre del Producto', productPrice: 'Precio', productCategory: 'Categoría', productDesc: 'Descripción', productImage: 'URL de Imagen',
    fillAllFields: 'Por favor completa todos los campos',
    overview: 'Resumen', settings: 'Ajustes', backToSite: 'Volver al Sitio', weeklySales: 'Ventas Semanales', recentActivity: 'Actividad Reciente',
    maintenanceMode: 'Modo Mantenimiento', allowRegistration: 'Permitir Registro', saveChanges: 'Guardar Cambios',
    adminAccess: 'Acceso Admin',
    calories: 'Calorías', spiciness: 'Picante (0-100)', sweetness: 'Dulzura (0-100)', protein: 'Proteína (g)', carbs: 'Carbohidratos (g)',
    orders: 'Pedidos',
    actionAccept: 'Aceptar', actionReject: 'Rechazar', actionPrepare: 'Aceptar y Preparar', actionDeliver: 'Enviar', actionComplete: 'Completar',
    adminLoginTitle: 'Portal de Administración', adminLoginDesc: 'Ingresa credenciales de administrador', accessDenied: 'Credenciales inválidas',
    useAdminPortal: 'Usa el icono de candado para acceso administrativo',
    usernameReserved: 'Este nombre de usuario está reservado',
    statusApproved: 'Publicado', statusRejected: 'Rechazado',
    myProfile: 'Mi Perfil', favorites: 'Favoritos', noFavorites: 'Aún no tienes favoritos', backToMenu: 'Explorar Menú',
    darkMode: 'Modo Oscuro',
    myOrders: 'Mis Pedidos', noOrders: 'No hay pedidos anteriores', orderId: 'ID Pedido', date: 'Fecha', status: 'Estado',
    trackStep1: 'Recibido', trackStep2: 'Preparando', trackStep3: 'En Camino', trackStep4: 'Entregado',
    confirmationCode: 'Código de Confirmación',
    driverLogin: 'Acceso Conductor', driverPortal: 'Portal de Reparto', enterCode: 'Ingresar Código', verifyAndComplete: 'Verificar y Completar', invalidCode: 'Código inválido',
    readyForPickup: 'Listo para Recoger', pickup: 'Recoger Pedido', deliver: 'Entregar',
    imageSource: 'Fuente de Imagen', fromUrl: 'Desde URL', fromDevice: 'Subir Archivo', uploadText: 'Clic para elegir imagen',
    uploading: 'Subiendo...',
    checkoutTitle: 'Finalizar Compra', deliveryAddress: 'Dirección de Entrega', addressPlaceholder: 'Calle, Número...', locateMe: 'Usar mi Ubicación (GPS)', confirmOrder: 'Confirmar Pedido',
    locating: 'Ubicando...', locationError: 'Error al ubicar',
    enableGPS: 'Por favor activa el GPS y permite la ubicación',
    locationPermissionDenied: 'Permiso denegado. Habilita el acceso a la ubicación.',
    locationUnavailable: 'Ubicación no disponible.',
    locationTimeout: 'Tiempo de espera agotado.',
    locationFetched: 'Ubicación adjuntada con éxito',
    openInMaps: 'Abrir en Maps',
    locationShared: 'Ubicación compartida',
    codeInstruction: 'Entrega este código al conductor al recibir tu pedido',
    loyaltyProgram: 'Programa de Lealtad',
    loyaltyDesc: '¡Pide 10 comidas y recibe una comida para dos gratis!',
    ordersCount: 'Recuento de Pedidos',
    rewardUnlocked: '¡Felicidades! ¡Ganaste una comida gratis! 🎉',
    rewardInstruction: 'Muestra esta pantalla al cajero en tu próximo pedido.',
    keepGoing: '¡Estás cerca! Sigue pidiendo.',
    sliderSettings: 'Ajustes del Slider',
    addSliderImage: 'Añadir Imagen',
    addImage: 'Añadir',
    sliderImages: 'Imágenes Actuales',
    editProfile: 'Editar Perfil',
    deleteAccount: 'Eliminar Cuenta',
    deleteConfirm: '¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.',
    update: 'Actualizar',
    changePhoto: 'Cambiar Foto',
    profileImage: 'Foto de Perfil (URL)',
    language: 'Idioma'
  },
  en: {
    home: 'Home', menu: 'Menu', track: 'Track Order', about: 'About Us', contact: 'Contact',
    login: 'Login', register: 'Register', logout: 'Logout', cart: 'Cart', addToCart: 'Add',
    details: 'Details', currency: 'MAD',
    heroTitle1: 'Moroccan', heroTitle2: 'Flavors', heroTitle3: 'Modern', heroTitle4: 'Twist',
    heroSubtitle: 'Discover the unique fusion of traditional Moroccan cooking and modern street food in an unforgettable experience.',
    orderNow: 'Order Now', watchVideo: 'Watch Video',
    mostOrdered: 'Most Ordered', specialOffers: 'Special Offers',
    whyUs: 'Why Choose Us?',
    freshDaily: 'Fresh Daily', freshDailyDesc: 'Ingredients sourced from local farms every morning.',
    fastDelivery: 'Lightning Delivery', fastDeliveryDesc: 'Committed to delivery within 30 minutes.',
    authenticTaste: 'Authentic Taste', authenticTasteDesc: 'Secret spices that take you back to Marrakech.',
    menuTitle: 'Our Menu', menuSubtitle: 'Choose from our wide selection',
    trackTitle: 'Track Order', trackSubtitle: 'Follow your order status in real-time',
    searchPlaceholder: 'Order ID (e.g. ORD-1234)', searchButton: 'Search',
    statusReceived: 'Received', statusPreparing: 'Preparing', statusDelivering: 'Delivering', statusCompleted: 'Completed', statusCancelled: 'Cancelled',
    statusPending: 'New',
    currentStatus: 'Current Status',
    preparingMsg: 'Preparing the finest ingredients for you', deliveringMsg: 'Driver is on the way', completedMsg: 'Enjoy your meal!',
    timeRemaining: 'Time Remaining', notFound: 'Sorry, order not found.',
    dashboard: 'Dashboard', adminWelcome: 'Welcome, you have new updates.',
    totalSales: 'Sales', totalOrders: 'Orders', pendingOrders: 'Pending', products: 'Products', reviews: 'Reviews',
    addProduct: 'Add Product', editProduct: 'Edit Product', edit: 'Edit', delete: 'Delete', approve: 'Approve',
    welcomeBack: 'Welcome Back', joinUs: 'Join Us', email: 'Email', username: 'Username', password: 'Password',
    phone: 'Phone', phonePlaceholder: '+212 ...', namePlaceholder: 'Full Name',
    loginBtn: 'Login', registerBtn: 'Register', noAccount: 'No account?', haveAccount: 'Already have an account?', registerNow: 'Register now',
    cartEmpty: 'Your cart is empty', browseMenu: 'Browse Menu', total: 'Total', checkout: 'Checkout', cancel: 'Cancel', confirm: 'Confirm', save: 'Save',
    burger: 'Burgers', tacos: 'Tacos', pizza: 'Pizza', drinks: 'Drinks', desserts: 'Desserts', all: 'All', shawarma: 'Shawarma', kebab: 'Kebab',
    productName: 'Product Name', productPrice: 'Price', productCategory: 'Category', productDesc: 'Description', productImage: 'Image URL',
    fillAllFields: 'Please fill all fields',
    overview: 'Overview', settings: 'Settings', backToSite: 'Back to Site', weeklySales: 'Weekly Sales', recentActivity: 'Recent Activity',
    maintenanceMode: 'Maintenance Mode', allowRegistration: 'Allow Registration', saveChanges: 'Save Changes',
    adminAccess: 'Admin Access',
    calories: 'Calories', spiciness: 'Spiciness (0-100)', sweetness: 'Sweetness (0-100)', protein: 'Protein (g)', carbs: 'Carbs (g)',
    orders: 'Orders',
    actionAccept: 'Accept', actionReject: 'Reject', actionPrepare: 'Accept & Prepare', actionDeliver: 'Dispatch', actionComplete: 'Complete',
    adminLoginTitle: 'Admin Portal', adminLoginDesc: 'Enter admin credentials', accessDenied: 'Invalid credentials',
    useAdminPortal: 'Use the lock icon for admin access',
    usernameReserved: 'Username reserved',
    statusApproved: 'Published', statusRejected: 'Rejected',
    myProfile: 'My Profile', favorites: 'Favorites', noFavorites: 'No favorites yet', backToMenu: 'Browse Menu',
    darkMode: 'Dark Mode',
    myOrders: 'My Orders', noOrders: 'No past orders', orderId: 'Order ID', date: 'Date', status: 'Status',
    trackStep1: 'Received', trackStep2: 'Preparing', trackStep3: 'Delivering', trackStep4: 'Delivered',
    confirmationCode: 'Confirmation Code',
    driverLogin: 'Driver Login', driverPortal: 'Delivery Portal', enterCode: 'Enter Code', verifyAndComplete: 'Verify & Complete', invalidCode: 'Invalid Code',
    readyForPickup: 'Ready for Pickup', pickup: 'Pickup Order', deliver: 'Deliver',
    imageSource: 'Image Source', fromUrl: 'From URL', fromDevice: 'Upload File', uploadText: 'Click to select image',
    uploading: 'Uploading...',
    checkoutTitle: 'Checkout', deliveryAddress: 'Delivery Address', addressPlaceholder: 'Street, Number...', locateMe: 'Use my Location (GPS)', confirmOrder: 'Confirm Order',
    locating: 'Locating...', locationError: 'Location Error',
    enableGPS: 'Please enable GPS and allow location',
    locationPermissionDenied: 'Permission denied. Please allow location access.',
    locationUnavailable: 'Location unavailable.',
    locationTimeout: 'Location timeout.',
    locationFetched: 'Location attached successfully',
    openInMaps: 'Open in Maps',
    locationShared: 'Location shared',
    codeInstruction: 'Give this code to the driver upon receipt',
    loyaltyProgram: 'Loyalty Program',
    loyaltyDesc: 'Order 10 meals and get a meal for two for free!',
    ordersCount: 'Order Count',
    rewardUnlocked: 'Congrats! You unlocked a free meal! 🎉',
    rewardInstruction: 'Show this screen to the cashier.',
    keepGoing: 'Almost there! Keep ordering.',
    sliderSettings: 'Slider Settings',
    addSliderImage: 'Add Slider Image',
    addImage: 'Add',
    sliderImages: 'Current Images',
    editProfile: 'Edit Profile',
    deleteAccount: 'Delete Account',
    deleteConfirm: 'Are you sure? This cannot be undone.',
    update: 'Update',
    changePhoto: 'Change Photo',
    profileImage: 'Profile Image (URL)',
    language: 'Language'
  }
};

type Language = 'ar' | 'en' | 'es';

// -- Helper Components --

const Tooltip = ({ text, children, className = '' }: { text: string; children?: React.ReactNode; className?: string }) => (
  <div className={`group relative flex items-center justify-center ${className}`}>
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-[70] transform translate-y-2 group-hover:translate-y-0">
      <div className="bg-stone-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap dark:bg-stone-100 dark:text-stone-900">
        {text}
      </div>
      <div className="w-2 h-2 bg-stone-900 rotate-45 mx-auto -mt-1 dark:bg-stone-100"></div>
    </div>
  </div>
);

const MenuItemCard = React.memo(({ item, onAdd, onDetails, onToggleFavorite, isFavorite, t }: { 
  item: MenuItem, 
  onAdd: (item: MenuItem) => void, 
  onDetails: (item: MenuItem) => void, 
  onToggleFavorite: (id: string) => void,
  isFavorite: boolean,
  t: any 
}) => (
  <div className="group bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-1 h-full relative">
    {/* Favorite Button */}
    <button 
      onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
      className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-md transition-all duration-300 ${isFavorite ? 'bg-red-50 text-red-600 dark:bg-stone-800 dark:text-red-500' : 'bg-white/80 dark:bg-black/50 text-stone-400 hover:text-red-500 hover:bg-white dark:hover:bg-stone-800'}`}
    >
      <Heart size={20} className={isFavorite ? 'fill-red-600' : ''} />
    </button>

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
    <div className="p-3 md:p-5 flex-1 flex flex-col">
      <div className="flex justify-between items-start mb-2 md:mb-3">
        <h3 className="text-sm md:text-lg font-bold text-stone-900 dark:text-stone-100 leading-tight line-clamp-2">{item.name}</h3>
        <span className="text-orange-600 dark:text-orange-500 font-black text-sm md:text-lg whitespace-nowrap">{item.price} {t('currency')}</span>
      </div>
      <p className="text-stone-500 dark:text-stone-400 text-xs md:text-sm mb-4 md:mb-6 leading-relaxed line-clamp-2">{item.description}</p>
      <div className="flex gap-2 md:gap-3 mt-auto">
        <Tooltip text={t('addToCart')} className="flex-1">
          <button onClick={() => onAdd(item)} className="w-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 py-2 md:py-3 rounded-xl font-bold hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/30 text-xs md:text-sm">
            <Plus size={16} className="md:w-[18px] md:h-[18px]" /> {t('addToCart')}
          </button>
        </Tooltip>
        <Tooltip text={t('details')}>
          <button onClick={() => onDetails(item)} className="px-3 py-2 md:px-4 md:py-3 border border-stone-200 dark:border-stone-700 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors">
            <Search size={16} className="md:w-[18px] md:h-[18px]" />
          </button>
        </Tooltip>
      </div>
    </div>
  </div>
));

const HeroSlider = ({ onOrderClick, t, lang, images }: { onOrderClick: () => void, t: any, lang: Language, images: string[] }) => {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % images.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [images]);

  return (
    <section className="relative h-[60vh] md:h-[85vh] flex items-center justify-center overflow-hidden bg-stone-900 rounded-b-[2rem] md:rounded-b-[3rem] shadow-2xl mx-2 mt-2">
      {images.map((img, index) => (
        <div 
          key={index}
          className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform ${
            index === currentHeroIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <img 
            src={img} 
            alt="Moroccan Food" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        </div>
      ))}
      
      <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs md:text-sm font-medium mb-2 md:mb-4 animate-fade-in-down">
          ✨ {t('heroTitle2')} {t('authenticTaste')}
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-4 md:mb-6 leading-tight drop-shadow-2xl">
          {lang === 'ar' ? (
             <>{t('heroTitle1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">{t('heroTitle2')}</span><br/>
             {t('heroTitle3')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">{t('heroTitle4')}</span></>
          ) : (
             <><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">{t('heroTitle1')}</span> {t('heroTitle2')}<br/>
             {t('heroTitle3')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">{t('heroTitle4')}</span></>
          )}
        </h1>
        <p className="text-sm sm:text-lg md:text-2xl mb-6 md:mb-10 text-stone-200 font-light max-w-2xl mx-auto leading-relaxed px-4">
          {t('heroSubtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={onOrderClick}
            className="group bg-red-600 hover:bg-red-700 text-white px-8 py-3 md:px-10 md:py-4 rounded-full text-lg md:text-xl font-bold transition-all shadow-[0_10px_20px_rgba(225,29,72,0.3)] hover:shadow-[0_15px_30px_rgba(225,29,72,0.4)] hover:-translate-y-1 flex items-center gap-2"
          >
            {t('orderNow')} <ArrowRight className="group-hover:translate-x-[-4px] transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [language, setLanguage] = useState<Language>('es');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [trackedOrder, setTrackedOrder] = useState<string>('');
  const [trackingResult, setTrackingResult] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState({ 
    name: '', 
    phone: '', 
    address: '', 
    mapLink: '', 
    lat: null as number | null, 
    lng: null as number | null 
  });
  const [isLocating, setIsLocating] = useState(false);
  const [adminTab, setAdminTab] = useState<'overview' | 'orders' | 'products' | 'reviews' | 'settings'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  const DEFAULT_HERO_IMAGES = [
    "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1511690656952-34342d5c2899?q=80&w=2070&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1539136788836-5699e1c73867?q=80&w=1974&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=2000&auto=format&fit=crop"  
  ];
  const [heroImages, setHeroImages] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('food_morocco_slider_images');
      return saved ? JSON.parse(saved) : DEFAULT_HERO_IMAGES;
    } catch(e) { return DEFAULT_HERO_IMAGES; }
  });
  const [newSliderImage, setNewSliderImage] = useState('');
  const [sliderInputMethod, setSliderInputMethod] = useState<'url' | 'file'>('url');
  const [sliderUploadedImage, setSliderUploadedImage] = useState<string | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState<Partial<MenuItem>>({});
  const [imageInputMethod, setImageInputMethod] = useState<'url' | 'file'>('url');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [profileImageInputMethod, setProfileImageInputMethod] = useState<'url' | 'file'>('url');
  const [profileUploadedImage, setProfileUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return !!localStorage.getItem(MOCK_CURRENT_USER_KEY);
    } catch { return false; }
  });
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem(MOCK_CURRENT_USER_KEY);
      if (stored) {
        const u = JSON.parse(stored);
        return u.username || u.name || u.email;
      }
      return null;
    } catch { return null; }
  });
  const [userData, setUserData] = useState<{name: string, phone: string, email: string, image?: string, uid?: string} | null>(() => {
    try {
        const stored = localStorage.getItem(MOCK_CURRENT_USER_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem(MOCK_CURRENT_USER_KEY);
      if (stored) {
         return JSON.parse(stored).isAdmin === true;
      }
      return false;
    } catch { return false; }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');
  const [adminLoginType, setAdminLoginType] = useState<'admin' | 'driver'>('admin');
  const [verificationCodeInput, setVerificationCodeInput] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const loadMenuItems = async () => {
      const items = await getMenuItems();
      if (items.length > 0) {
        setMenuItems(items);
      } else {
        setMenuItems([]); 
      }
    };
    loadMenuItems();
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
        const data = await getOrders();
        setOrders(data);
    };
    loadOrders();

    const channel = supabase.channel('orders_updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
           loadOrders();
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (view === 'admin' && adminTab === 'reviews') {
      const loadReviews = async () => {
        const data = await getReviews();
        setReviews(data);
      };
      loadReviews();
    }
  }, [view, adminTab]);

  useEffect(() => {
     const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
             setIsLoggedIn(true);
             const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
             if (profile) {
                 setUserData({ ...profile, uid: session.user.id, email: session.user.email || '' });
                 setCurrentUser(profile.name);
             } else {
                 setUserData({ name: '', phone: '', email: session.user.email || '', uid: session.user.id });
                 setCurrentUser(session.user.email || '');
             }
             setIsAdmin(false);
        }
     };
     checkUser();

     const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session) {
             setIsLoggedIn(true);
             setIsAdmin(false);
             const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
             if (profile) {
                 setUserData({ ...profile, uid: session.user.id, email: session.user.email || '' });
                 setCurrentUser(profile.name);
             }
        } else {
             if (!localStorage.getItem(MOCK_CURRENT_USER_KEY)) {
                setIsLoggedIn(false);
                setUserData(null);
                setCurrentUser(null);
                setIsAdmin(false);
             }
        }
     });
     return () => subscription.unsubscribe();
  }, []);

  const cycleLanguage = () => {
    setLanguage((prev) => {
      if (prev === 'ar') return 'en';
      if (prev === 'en') return 'es';
      return 'ar';
    });
  };

  const mostOrderedItems = useMemo(() => {
    const counts: {[id: string]: number} = {};
    const findIdByName = (name: string) => {
       const lowerName = name.toLowerCase().trim();
       for (const lang in MENU_ITEMS_BY_LANG) {
           const items = MENU_ITEMS_BY_LANG[lang as keyof typeof MENU_ITEMS_BY_LANG];
           const found = items.find(i => i.name.toLowerCase() === lowerName);
           if (found) return found.id;
       }
       return null;
    };
    orders.forEach(order => {
       if (typeof order.items === 'string') {
          const parts = order.items.split(', ');
          parts.forEach((part: string) => {
             const match = part.match(/(\d+)x\s(.+)/);
             if (match) {
                const qty = parseInt(match[1]);
                const name = match[2].trim();
                const id = findIdByName(name);
                if (id) {
                   counts[id] = (counts[id] || 0) + qty;
                }
             }
          });
       } else if (Array.isArray(order.items)) {
          order.items.forEach((item: CartItem) => {
             counts[item.id] = (counts[item.id] || 0) + item.quantity;
          });
       }
    });
    return [...menuItems].sort((a, b) => {
       const countA = counts[a.id] || 0;
       const countB = counts[b.id] || 0;
       return countB - countA;
    }).slice(0, 4); 
  }, [orders, menuItems]);

  useEffect(() => {
    if (view === 'track' && trackedOrder && trackingResult && trackingResult !== 'not_found') {
        const found = orders.find(o => o.id.toLowerCase() === trackedOrder.toLowerCase().trim());
        if (found && found.status !== trackingResult) {
            setTrackingResult(found.status);
            setToast({ message: `Order status updated: ${found.status}`, type: 'success' });
        }
    }
  }, [orders, trackedOrder, view, trackingResult]);

  const userOrderStats = useMemo(() => {
    if (!currentUser) return { count: 0, progress: 0, isWinner: false };
    const userOrders = orders.filter(o => 
      (o.customer === currentUser || (currentUser === 'guest' && o.customer === 'guest')) && 
      o.status !== 'cancelled'
    );
    const count = userOrders.length;
    const progress = (count % 10) === 0 && count > 0 ? 100 : ((count % 10) / 10) * 100;
    const isWinner = count > 0 && count % 10 === 0;
    return { count, progress, isWinner };
  }, [orders, currentUser]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
    } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        setIsDarkMode(false);
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        setIsDarkMode(true);
    }
  };

  const t = useCallback((key: keyof typeof translations['ar']) => {
    const langData = translations[language];
    if (!langData) return key;
    return langData[key] || key;
  }, [language]);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleUserLogout = async () => {
    setIsLoggedIn(false); 
    setCurrentUser(null); 
    setIsAdmin(false); 
    setUserData(null);
    try { localStorage.removeItem(MOCK_CURRENT_USER_KEY); } catch(e) {}
    
    try {
        await supabase.auth.signOut();
    } catch (error) {
        console.error("Error signing out:", error);
    }

    setToast({ message: t('logout'), type: 'success' });
    setView('home');
  };

  const handleSystemLogout = async () => {
    setIsLoggedIn(false); setCurrentUser(null); setIsAdmin(false);
    try { localStorage.removeItem(MOCK_CURRENT_USER_KEY); } catch(e) {}
    setToast({ message: t('logout'), type: 'success' });
    setView('home');
  };

  const handleLogin = async (credential_input: string, password_input: string) => {
    const input = (credential_input || '').trim();
    const pass = (password_input || '').trim();

    if (input.toLowerCase() === ADMIN_USERNAME.toLowerCase() && pass === ADMIN_PASSWORD) {
        const user = { username: ADMIN_USERNAME, isAdmin: true };
        setIsLoggedIn(true); setCurrentUser(ADMIN_USERNAME); setIsAdmin(true);
        try { localStorage.setItem(MOCK_CURRENT_USER_KEY, JSON.stringify(user)); } catch (e) {}
        setToast({ message: `Welcome, ${ADMIN_USERNAME}!`, type: 'success' });
        setIsAuthModalOpen(false);
        setView('admin');
        return true;
    }

    if (input.toLowerCase() === DRIVER_USERNAME.toLowerCase() && pass === DRIVER_PASSWORD) {
        const user = { username: DRIVER_USERNAME, isAdmin: false };
        setIsLoggedIn(true); setCurrentUser(DRIVER_USERNAME); setIsAdmin(false);
        try { localStorage.setItem(MOCK_CURRENT_USER_KEY, JSON.stringify(user)); } catch (e) {}
        setToast({ message: `Welcome Driver!`, type: 'success' });
        setIsAuthModalOpen(false);
        setView('driver');
        return true;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email: input,
        password: pass
    });

    if (error) {
         setToast({ message: 'Invalid credentials.', type: 'error' });
         return false;
    }

    setToast({ message: `Welcome back!`, type: 'success' });
    setIsAuthModalOpen(false);
    return true;
  };

  const handleRegister = async (name_input: string, phone_input: string, email_input: string, password_input: string) => {
    const name = (name_input || '').trim();
    const email = (email_input || '').trim();
    const phone = (phone_input || '').trim();
    const password = (password_input || '').trim();

    if (name.toLowerCase() === ADMIN_USERNAME) {
        setToast({ message: t('usernameReserved'), type: 'error' });
        return false;
    }

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: { display_name: name, phone: phone }
        }
    });

    if (error) {
        setToast({ message: error.message, type: 'error' });
        return false;
    }

    if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert([
            { id: data.user.id, name: name, phone: phone, email: email, image: '' }
        ]);
        if (profileError) console.error("Profile creation error", profileError);

        setToast({ message: 'Account created successfully!', type: 'success' });
        setIsAuthModalOpen(false);
        return true;
    }
    return false;
  };
  
  const handleProfileFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const compressedFile = await compressImage(file);
      const url = await uploadImage(compressedFile, 'profiles');
      if (url) {
        setProfileUploadedImage(url);
        setToast({ message: 'Profile image uploaded!', type: 'success' });
      } else {
        setToast({ message: 'Failed to upload profile image.', type: 'error' });
      }
      setIsUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!userData || !userData.uid) return;
      
      const fd = new FormData(e.target as HTMLFormElement);
      const newName = fd.get('name') as string;
      const newPhone = fd.get('phone') as string;
      const newImage = (profileImageInputMethod === 'file' && profileUploadedImage) 
        ? profileUploadedImage 
        : (fd.get('image') as string || userData.image || '');
      
      const { error } = await supabase.from('profiles').update({
          name: newName,
          phone: newPhone,
          image: newImage
      }).eq('id', userData.uid);

      if (error) {
          console.error(error);
          setToast({ message: 'Failed to update profile', type: 'error' });
      } else {
          setUserData({ ...userData, name: newName, phone: newPhone, image: newImage });
          setCurrentUser(newName);
          setIsEditingProfile(false);
          setToast({ message: 'Profile updated successfully', type: 'success' });
      }
  };
  
  const handleDeleteAccount = async () => {
      if (!window.confirm(t('deleteConfirm'))) return;
      await handleUserLogout();
      setToast({ message: 'Account signed out.', type: 'success' });
  };

  const handleAdminLogin = (credential_input: string, password_input: string) => {
    const username = (credential_input || '').trim();
    const password = (password_input || '').trim();
    if (adminLoginType === 'admin') {
      if (username.toLowerCase() === ADMIN_USERNAME.toLowerCase() && password === ADMIN_PASSWORD) {
          const user = { username: ADMIN_USERNAME, isAdmin: true };
          setIsLoggedIn(true); 
          setCurrentUser(ADMIN_USERNAME); 
          setIsAdmin(true);
          setUserData(null);
          try { localStorage.setItem(MOCK_CURRENT_USER_KEY, JSON.stringify(user)); } catch (e) {}
          setToast({ message: `Welcome, ${ADMIN_USERNAME}!`, type: 'success' });
          setIsAdminLoginOpen(false);
          setView('admin');
          return true;
      }
    } else {
      if (username.toLowerCase() === DRIVER_USERNAME.toLowerCase() && password === DRIVER_PASSWORD) {
        const user = { username: DRIVER_USERNAME, isAdmin: false };
        setIsLoggedIn(true); 
        setCurrentUser(DRIVER_USERNAME); 
        setIsAdmin(false);
        setUserData(null);
        try { localStorage.setItem(MOCK_CURRENT_USER_KEY, JSON.stringify(user)); } catch (e) {}
        setToast({ message: `Welcome Driver!`, type: 'success' });
        setIsAdminLoginOpen(false);
        setView('driver');
        return true;
      }
    }
    setToast({ message: t('accessDenied'), type: 'error' });
    return false;
  };

  const handleReviewAction = async (id: string, status: 'approved' | 'rejected') => {
    const success = await updateReviewStatus(id, status);
    if (success || !success /* optimistic update for mock */) {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      setToast({ message: `Review ${status}`, type: 'success' });
    }
  };

  const addToCart = useCallback((item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      return existing ? prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) : [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
    setToast({ message: t('addToCart'), type: 'success' });
  }, [t]);

  const toggleFavorite = (id: string) => {
    if (!isLoggedIn) {
      setToast({ message: t('login') + ' ' + t('favorites'), type: 'error' });
      setIsAuthModalOpen(true);
      return;
    }
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleInitiateCheckout = () => {
    if (cart.length === 0) return;
    let prefillName = '';
    let prefillPhone = '';
    if (userData) {
        prefillName = userData.name;
        prefillPhone = userData.phone;
    } else if (currentUser) {
        prefillName = currentUser;
    }
    setCheckoutData({
        name: prefillName,
        phone: prefillPhone,
        address: '',
        mapLink: '', 
        lat: null,
        lng: null
    });
    setIsCheckoutModalOpen(true);
  };

  const handleFinalizeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = 'ORD-' + Math.floor(Math.random() * 10000);
    const confirmationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const newOrder: Order = {
      id: orderId,
      customer: checkoutData.name || currentUser || 'Guest',
      items: cart,
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending' as const,
      date: new Date().toLocaleString(language === 'ar' ? 'ar-MA' : 'en-US'),
      payment: 'Cash',
      type: 'delivery' as const,
      confirmationCode: confirmationCode,
      deliveryInfo: {
          phone: checkoutData.phone,
          address: checkoutData.address,
          mapLink: checkoutData.mapLink, 
          location: checkoutData.lat ? { lat: checkoutData.lat, lng: checkoutData.lng } : undefined
      }
    };
    
    setOrders(prev => [newOrder, ...prev]);

    const savedOrder = await createOrder({
        ...newOrder,
        user_id: userData?.uid || null 
    });
    
    if (!savedOrder) {
        console.error("Failed to save order to Supabase");
    }

    setToast({ message: `Order placed! ID: ${orderId}`, type: 'success' });
    setCart([]); 
    setIsCartOpen(false); 
    setIsCheckoutModalOpen(false);
    setView('track'); 
    setTrackedOrder(orderId);
    setTrackingResult('pending');
  };

  const handleGeoLocation = () => {
    setIsLocating(true);
    setToast({ message: t('enableGPS') as string, type: 'success' }); 
    if ('geolocation' in navigator) {
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
            setCheckoutData(prev => ({
                ...prev,
                lat: latitude,
                lng: longitude,
                mapLink: googleMapsUrl 
            }));
            setIsLocating(false);
            setToast({ message: t('locationFetched') as string, type: 'success' });
        }, (error) => {
            console.error(error);
            setIsLocating(false);
            let errorKey = 'locationError';
            if (error.code === 1) errorKey = 'locationPermissionDenied'; 
            else if (error.code === 2) errorKey = 'locationUnavailable';
            else if (error.code === 3) errorKey = 'locationTimeout';
            setToast({ message: t(errorKey as any) as string, type: 'error' });
        }, options);
    } else {
        setIsLocating(false);
        setToast({ message: 'Geolocation not supported', type: 'error' });
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: any) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (!error) {
        setToast({ message: 'Order status updated', type: 'success' });
    } else {
        setToast({ message: 'Update failed', type: 'error' });
    }
  };
  
  const handleTrackOrder = () => {
     if(!trackedOrder) return;
     const found = orders.find(o => o.id.toLowerCase() === trackedOrder.toLowerCase().trim());
     if(found) {
        setTrackingResult(found.status);
     } else {
        setTrackingResult('not_found');
        setToast({ message: t('notFound'), type: 'error' });
     }
  };

  const verifyOrderCode = (orderId: string) => {
    const inputCode = verificationCodeInput[orderId];
    const order = orders.find(o => o.id === orderId);
    if (order && order.confirmationCode === inputCode) {
      updateOrderStatus(orderId, 'completed');
      setToast({ message: 'Order Delivered Successfully!', type: 'success' });
    } else {
      setToast({ message: t('invalidCode'), type: 'error' });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const compressedFile = await compressImage(file);
      const url = await uploadImage(compressedFile, 'products');
      if (url) {
        setUploadedImage(url);
        setToast({ message: 'Image uploaded successfully!', type: 'success' });
      } else {
        setToast({ message: 'Failed to upload image.', type: 'error' });
      }
      setIsUploading(false);
    }
  };

  const handleSliderFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const compressedFile = await compressImage(file);
      const url = await uploadImage(compressedFile, 'slider');
      if (url) {
        setSliderUploadedImage(url);
        setToast({ message: 'Slider image uploaded!', type: 'success' });
      } else {
         setToast({ message: 'Failed to upload slider image.', type: 'error' });
      }
      setIsUploading(false);
    }
  };

  const handleAddSliderImage = () => {
    if (sliderInputMethod === 'url' && newSliderImage.trim()) {
      const updatedImages = [...heroImages, newSliderImage.trim()];
      setHeroImages(updatedImages);
      localStorage.setItem('food_morocco_slider_images', JSON.stringify(updatedImages));
      setNewSliderImage('');
      setToast({ message: 'Slider image added', type: 'success' });
    } else if (sliderInputMethod === 'file' && sliderUploadedImage) {
      const updatedImages = [...heroImages, sliderUploadedImage];
      setHeroImages(updatedImages);
      localStorage.setItem('food_morocco_slider_images', JSON.stringify(updatedImages));
      setSliderUploadedImage(null);
      setToast({ message: 'Slider image uploaded', type: 'success' });
    }
  };

  const handleDeleteSliderImage = (index: number) => {
    const updatedImages = heroImages.filter((_, i) => i !== index);
    setHeroImages(updatedImages);
    localStorage.setItem('food_morocco_slider_images', JSON.stringify(updatedImages));
    setToast({ message: 'Slider image removed', type: 'success' });
  };

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isUploading) return;

    const fd = new FormData(e.currentTarget);
    const imageToSave = (imageInputMethod === 'file' && uploadedImage) 
        ? uploadedImage 
        : (fd.get('image') as string || productForm.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c');

    const newItem = {
        id: productForm.id || `new-${Date.now()}`,
        name: fd.get('name') as string,
        price: parseFloat(fd.get('price') as string),
        category: fd.get('category') as Category,
        description: fd.get('description') as string,
        image: imageToSave,
        rating: productForm.rating || 5,
        calories: parseInt(fd.get('calories') as string) || 0,
        spiciness: parseInt(fd.get('spiciness') as string) || 0,
        sweetness: parseInt(fd.get('sweetness') as string) || 0,
        protein: parseInt(fd.get('protein') as string) || 0,
        carbs: parseInt(fd.get('carbs') as string) || 0,
    };

    if (productForm.id) {
        const { error } = await supabase.from('menu_items').update(newItem).eq('id', productForm.id);
        if (!error) {
            setMenuItems(prev => prev.map(item => item.id === productForm.id ? newItem : item));
            setToast({ message: 'Product updated successfully', type: 'success' });
        }
    } else {
        const { error } = await supabase.from('menu_items').insert([newItem]);
        if (!error) {
            setMenuItems(prev => [newItem, ...prev]);
            setToast({ message: 'Product added successfully', type: 'success' });
        }
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if(window.confirm(t('confirm'))) {
        const { error } = await supabase.from('menu_items').delete().eq('id', id);
        if(!error) {
            setMenuItems(prev => prev.filter(i => i.id !== id));
            setToast({ message: 'Product deleted', type: 'success' });
        }
    }
  };

  const openProductModal = (product: Partial<MenuItem> = {}) => {
    setProductForm(product);
    setImageInputMethod('url');
    setUploadedImage(null);
    setIsProductModalOpen(true);
  };

  const Navbar = () => (
    <nav className="sticky top-0 z-50 w-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-100 dark:border-stone-800 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-6 py-2 lg:py-4 flex items-center justify-between gap-2 lg:gap-4">
        <div className="flex-shrink-0 flex items-center cursor-pointer group select-none relative">
             <a href='https://azrogo.com/extras/upload-images/' target='_blank' rel="noreferrer" className="relative z-10">
                 <img 
                   src='https://cdn.jsdelivr.net/gh/imagesloads/images@main/img_1a6f0c9dc172c3fb.webp' 
                   alt='eee' 
                   className="h-14 md:h-20 w-auto object-contain transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-2 drop-shadow-xl z-10 relative" 
                   onError={(e) => {
                     e.currentTarget.style.display = 'none';
                     const parent = e.currentTarget.parentElement?.parentElement;
                     if(parent) {
                        const fallback = parent.querySelector('.fallback-logo-text');
                        if(fallback) fallback.classList.remove('hidden');
                     }
                   }} 
                 />
             </a>
             <span onClick={() => setView('home')} className="fallback-logo-text hidden absolute left-0 top-1/2 -translate-y-1/2 md:static md:translate-y-0 font-black text-orange-600 dark:text-orange-500 text-lg md:text-xl ml-2 whitespace-nowrap">Sabor del Magreb</span>
        </div>
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center p-1 lg:p-2 bg-white dark:bg-stone-800 rounded-full border border-stone-100 dark:border-stone-700 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] transition-colors duration-300">
            {[{ id: 'home', label: t('home') }, { id: 'menu', label: t('menu') }, { id: 'track', label: t('track') }, { id: 'about', label: t('about') }, { id: 'contact', label: t('contact') }].map((link) => (
              <button key={link.id} onClick={() => setView(link.id as ViewState)} className={`relative px-3 lg:px-6 py-2 rounded-full transition-all duration-300 font-bold text-xs lg:text-sm whitespace-nowrap ${view === link.id ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900' : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'}`}>{link.label}</button>
            ))}
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2 lg:gap-3">
          <Tooltip text={isAdmin ? t('dashboard') : t('adminAccess')}>
             <button onClick={() => isAdmin ? setView('admin') : setIsAdminLoginOpen(true)} className={`p-2 lg:p-3 rounded-full transition-all duration-300 group shadow-sm border dark:border-stone-700 ${view === 'admin' ? 'bg-red-600 text-white' : 'bg-white dark:bg-stone-800 hover:bg-red-50 dark:hover:bg-stone-700 dark:text-stone-200'}`}>{isAdmin ? <LayoutDashboard size={20} /> : <Lock size={20} />}</button>
          </Tooltip>
          
          {!isAdmin && (
            isLoggedIn ? (
              <div className="relative group">
                <button className="flex items-center gap-2 pl-2 pr-2 py-1.5 bg-stone-50 dark:bg-stone-800 hover:bg-white dark:hover:bg-stone-700 border border-transparent hover:border-stone-200 dark:hover:border-stone-600 rounded-full transition-all duration-300 shadow-sm">
                  {userData?.image ? (
                     <img src={userData.image} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-stone-200 dark:border-stone-600" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                       <UserIcon size={16} />
                    </div>
                  )}
                </button>
                <div className={`absolute top-full mt-3 w-56 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-100 dark:border-stone-700 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50 p-2 ${language === 'ar' ? 'left-0' : 'right-0'}`}>
                  <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-700 mb-2">
                    <p className="text-xs text-stone-400 font-bold mb-1">{t('welcomeBack')}</p>
                    <p className="font-bold text-stone-800 dark:text-white truncate">{currentUser}</p>
                  </div>
                  {currentUser === DRIVER_USERNAME ? (
                    <button onClick={() => setView('driver')} className="w-full text-start px-4 py-3 text-stone-700 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-800 rounded-xl flex items-center gap-3 font-bold text-sm mb-1 transition-colors">
                      <Bike size={18} className="text-orange-500" /> {t('driverPortal')}
                    </button>
                  ) : (
                    <button onClick={() => setView('profile')} className="w-full text-start px-4 py-3 text-stone-700 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-800 rounded-xl flex items-center gap-3 font-bold text-sm mb-1 transition-colors">
                      <UserIcon size={18} className="text-orange-500" /> {t('myProfile')}
                    </button>
                  )}
                  <button onClick={handleUserLogout} className="w-full text-start px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl flex items-center gap-3 font-bold text-sm">
                    <LogOut size={18} /> {t('logout')}
                  </button>
                </div>
              </div>
            ) : (
              <Tooltip text={t('login')}>
                 <button onClick={() => { setIsAuthModalOpen(true); setLoginMode('login'); }} className="p-2 lg:p-3 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition">
                    <UserIcon size={20} />
                 </button>
              </Tooltip>
            )
          )}

          <Tooltip text={t('cart')}>
            <button className="relative p-2 lg:p-3 bg-white dark:bg-stone-800 hover:bg-red-50 dark:hover:bg-stone-700 rounded-full transition-all group shadow-sm border border-stone-100 dark:border-stone-700" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={20} className="text-stone-700 dark:text-stone-300 group-hover:text-red-600" />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">{cart.length}</span>}
            </button>
          </Tooltip>

          <button 
            className="md:hidden p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[100%] left-0 w-full bg-white dark:bg-stone-900 shadow-xl border-b border-stone-100 dark:border-stone-800 p-4 flex flex-col gap-2 z-40 animate-fade-in">
            {[{ id: 'home', label: t('home') }, { id: 'menu', label: t('menu') }, { id: 'track', label: t('track') }, { id: 'about', label: t('about') }, { id: 'contact', label: t('contact') }].map((link) => (
              <button 
                key={link.id} 
                onClick={() => { setView(link.id as ViewState); setIsMobileMenuOpen(false); }} 
                className={`w-full text-start px-4 py-3 rounded-xl font-bold transition-all ${view === link.id ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-md' : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
              >
                {link.label}
              </button>
            ))}
        </div>
      )}
    </nav>
  );

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 dark:text-stone-100 pb-20 md:pb-0 font-sans text-stone-900 transition-colors duration-300" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {view !== 'menu' && <Navbar />}

      <main className={`${view !== 'menu' ? 'container mx-auto px-4 lg:px-6 py-4 lg:py-6 space-y-8' : ''}`}>
        {view === 'home' && (
           <>
             <HeroSlider onOrderClick={() => setView('menu')} t={t} lang={language} images={heroImages} />
             
             <div className="mt-8">
                <h2 className="text-2xl md:text-3xl font-black text-stone-900 dark:text-white mb-6 flex items-center gap-2">
                   <Flame className="text-orange-500 fill-orange-500" /> {t('mostOrdered')}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {mostOrderedItems.map(item => (
                    <MenuItemCard 
                      key={item.id} 
                      item={item} 
                      onAdd={addToCart} 
                      onDetails={() => {}} 
                      onToggleFavorite={toggleFavorite}
                      isFavorite={favorites.includes(item.id)}
                      t={t} 
                    />
                  ))}
                </div>
             </div>
           </>
        )}

        {view === 'menu' && (
          <MenuPage navbar={<Navbar />} footer={<Footer />} onAdd={addToCart} />
        )}

        {view === 'about' && (
          <div className="max-w-4xl mx-auto py-12 px-4 text-center space-y-8 animate-fade-in">
             <div className="space-y-4">
                <h2 className="text-4xl font-black dark:text-white text-stone-900">{t('about')}</h2>
                <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
             </div>
             
             <div className="grid md:grid-cols-2 gap-12 items-center text-start">
                <div className="space-y-6">
                   <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100">{t('whyUs')}</h3>
                   <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-lg">{t('heroSubtitle')}</p>
                   <div className="space-y-4">
                      <div className="flex items-start gap-4">
                         <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400">
                            <UtensilsCrossed size={24} />
                         </div>
                         <div>
                            <h4 className="font-bold text-lg dark:text-white">{t('freshDaily')}</h4>
                            <p className="text-stone-500 dark:text-stone-400">{t('freshDailyDesc')}</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-4">
                         <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                            <Bike size={24} />
                         </div>
                         <div>
                            <h4 className="font-bold text-lg dark:text-white">{t('fastDelivery')}</h4>
                            <p className="text-stone-500 dark:text-stone-400">{t('fastDeliveryDesc')}</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-4">
                         <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
                            <Flame size={24} />
                         </div>
                         <div>
                            <h4 className="font-bold text-lg dark:text-white">{t('authenticTaste')}</h4>
                            <p className="text-stone-500 dark:text-stone-400">{t('authenticTasteDesc')}</p>
                         </div>
                      </div>
                   </div>
                </div>
                <div className="relative">
                   <div className="absolute inset-0 bg-orange-500 rounded-3xl rotate-3 opacity-20 transform translate-x-2 translate-y-2"></div>
                   <img src="https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?q=80&w=2070" alt="Restaurant Interior" className="relative rounded-3xl shadow-2xl w-full h-96 object-cover" />
                </div>
             </div>
          </div>
        )}

        {view === 'contact' && (
           <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
              <div className="text-center space-y-4 mb-12">
                 <h2 className="text-4xl font-black dark:text-white text-stone-900">{t('contact')}</h2>
                 <p className="text-stone-500 dark:text-stone-400 text-lg">Estamos هنا para escucharte. Contáctanos para cualquier consulta o sugerencia.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                 <div className="bg-white dark:bg-stone-800 p-8 rounded-3xl shadow-sm text-center border border-stone-100 dark:border-stone-700 hover:shadow-lg transition">
                    <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center text-sky-600 dark:text-sky-400 mx-auto mb-4">
                       <Phone size={32} />
                    </div>
                    <h3 className="font-bold text-lg mb-2 dark:text-white">Llámanos</h3>
                    <p className="text-stone-500 dark:text-stone-400 text-sm" dir="ltr">+212 5 22 33 44 55</p>
                    <p className="text-stone-500 dark:text-stone-400 text-sm" dir="ltr">+212 6 11 22 33 44</p>
                 </div>
                 <div className="bg-white dark:bg-stone-800 p-8 rounded-3xl shadow-sm text-center border border-stone-100 dark:border-stone-700 hover:shadow-lg transition">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 mx-auto mb-4">
                       <Mail size={32} />
                    </div>
                    <h3 className="font-bold text-lg mb-2 dark:text-white">Escríbenos</h3>
                    <p className="text-stone-500 dark:text-stone-400 text-sm">contact@sabordelmagreb.ma</p>
                    <p className="text-stone-500 dark:text-stone-400 text-sm">support@sabordelmagreb.ma</p>
                 </div>
                 <div className="bg-white dark:bg-stone-800 p-8 rounded-3xl shadow-sm text-center border border-stone-100 dark:border-stone-700 hover:shadow-lg transition">
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
                       <MapPin size={32} />
                    </div>
                    <h3 className="font-bold text-lg mb-2 dark:text-white">Ubicación</h3>
                    <p className="text-stone-500 dark:text-stone-400 text-sm">Av. Mohammed V, Casablanca</p>
                    <p className="text-stone-500 dark:text-stone-400 text-sm">Marruecos</p>
                 </div>
              </div>
           </div>
        )}

        {view === 'profile' && isLoggedIn && (
          <div className="max-w-4xl mx-auto space-y-8">
             <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 md:p-8 shadow-sm dark:border dark:border-stone-800 flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                    {userData?.image ? (
                        <img src={userData.image} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-stone-800 shadow-lg" />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-3xl font-bold border-4 border-white dark:border-stone-800 shadow-lg">
                           {currentUser?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    {isEditingProfile && (
                        <button onClick={() => setProfileImageInputMethod(profileImageInputMethod === 'url' ? 'file' : 'url')} className="absolute bottom-0 right-0 bg-stone-900 text-white p-1.5 rounded-full shadow-md hover:bg-stone-700"><Camera size={14}/></button>
                    )}
                </div>
                
                <div className="text-center md:text-start flex-1 w-full">
                   {isEditingProfile ? (
                       <form onSubmit={handleUpdateProfile} className="space-y-3 w-full max-w-md">
                           <input name="name" defaultValue={userData?.name} className="block w-full px-4 py-2 border rounded-xl bg-stone-50 dark:bg-stone-800 dark:border-stone-700 focus:ring-2 focus:ring-orange-500 outline-none" placeholder={t('namePlaceholder')} />
                           <input name="phone" defaultValue={userData?.phone} className="block w-full px-4 py-2 border rounded-xl bg-stone-50 dark:bg-stone-800 dark:border-stone-700 focus:ring-2 focus:ring-orange-500 outline-none" placeholder={t('phonePlaceholder')} />
                           
                           {profileImageInputMethod === 'url' ? (
                               <input name="image" defaultValue={userData?.image} placeholder={t('profileImage')} className="block w-full px-4 py-2 border rounded-xl bg-stone-50 dark:bg-stone-800 dark:border-stone-700 focus:ring-2 focus:ring-orange-500 outline-none" />
                           ) : (
                               <div className="relative h-12 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl flex items-center justify-center text-stone-500 cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-700 transition">
                                    <input type="file" accept="image/*" onChange={handleProfileFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    <span className="text-sm font-bold flex items-center gap-2">
                                       {isUploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                                       {isUploading ? t('uploading') : (profileUploadedImage ? t('imageSource') : t('uploadText'))}
                                    </span>
                               </div>
                           )}

                           <div className="flex gap-2 justify-center md:justify-start pt-2">
                               <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-600/20 hover:bg-orange-700"><Save size={16}/> {t('saveChanges')}</button>
                               <button type="button" onClick={() => setIsEditingProfile(false)} className="bg-stone-100 text-stone-700 px-6 py-2 rounded-xl text-sm font-bold hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700">{t('cancel')}</button>
                           </div>
                       </form>
                   ) : (
                       <>
                           <h2 className="text-2xl font-black text-stone-900 dark:text-white">{userData?.name || currentUser}</h2>
                           <p className="text-stone-500 dark:text-stone-400 font-medium">{userData?.email}</p>
                           {userData?.phone && <p className="text-stone-400 dark:text-stone-500 text-sm mt-1 flex items-center justify-center md:justify-start gap-1"><Phone size={12}/> {userData.phone}</p>}
                           
                           <div className="flex gap-3 mt-4 justify-center md:justify-start">
                               <button onClick={() => setIsEditingProfile(true)} className="bg-sky-50 text-sky-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-sky-100 dark:bg-sky-900/20 dark:text-sky-400 dark:hover:bg-sky-900/30 transition">
                                   <Edit2 size={16} /> {t('editProfile')}
                               </button>
                               <button onClick={handleDeleteAccount} className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 transition">
                                   <UserX size={16} /> {t('deleteAccount')}
                               </button>
                           </div>
                       </>
                   )}
                </div>
                
                <div className="flex flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                   <button 
                     onClick={toggleTheme}
                     className="px-6 py-3 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 rounded-xl font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition flex items-center justify-center gap-2 w-full md:w-auto"
                   >
                     {isDarkMode ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} className="text-stone-500" />}
                     {t('darkMode')}
                   </button>
                   <button 
                     onClick={cycleLanguage}
                     className="px-6 py-3 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 rounded-xl font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition flex items-center justify-center gap-2 w-full md:w-auto"
                   >
                     <Globe size={20} /> {language === 'ar' ? 'English' : language === 'en' ? 'Español' : 'العربية'}
                   </button>
                   <button onClick={() => setView('home')} className="px-6 py-3 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 rounded-xl font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition flex items-center justify-center gap-2 w-full md:w-auto">
                      <Home size={20} /> {t('backToSite')}
                   </button>
                   <button onClick={handleUserLogout} className="px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition flex items-center justify-center gap-2 w-full md:w-auto">
                      <LogOut size={20} /> {t('logout')}
                   </button>
                </div>
             </div>

             <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl p-8 shadow-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-10 translate-x-10 blur-xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                      <div className={`p-4 bg-white/20 rounded-full backdrop-blur-md ${userOrderStats.isWinner ? 'animate-bounce' : ''}`}>
                         <Gift size={32} className="text-white" />
                      </div>
                      <div>
                         <h3 className="text-2xl font-black mb-1">{t('loyaltyProgram')}</h3>
                         <p className="text-white/90 font-medium text-sm max-w-sm">
                            {userOrderStats.isWinner ? t('rewardUnlocked') : t('loyaltyDesc')}
                         </p>
                      </div>
                   </div>
                   
                   <div className="w-full md:w-1/3">
                      <div className="flex justify-between items-end mb-2">
                         <span className="font-bold text-sm">{t('ordersCount')}</span>
                         <span className="text-2xl font-black">{userOrderStats.count % 10}/10</span>
                      </div>
                      <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
                         <div 
                            className="h-full bg-white transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                            style={{ width: `${userOrderStats.progress}%` }}
                         ></div>
                      </div>
                      <p className="text-xs text-center mt-2 font-bold text-white/80">
                         {userOrderStats.isWinner ? t('rewardInstruction') : t('keepGoing')}
                      </p>
                   </div>
                </div>
             </div>

             <div>
                <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-stone-900 dark:text-white">
                   <Heart className="fill-red-500 text-red-500" /> {t('favorites')}
                </h3>
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {menuItems.filter(item => favorites.includes(item.id)).map(item => (
                        <MenuItemCard 
                           key={item.id} 
                           item={item} 
                           onAdd={addToCart} 
                           onDetails={() => {}} 
                           onToggleFavorite={toggleFavorite}
                           isFavorite={true}
                           t={t} 
                        />
                     ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 text-center shadow-sm dark:border dark:border-stone-800">
                     <Heart size={48} className="mx-auto text-stone-200 dark:text-stone-700 mb-4" />
                     <p className="text-stone-500 dark:text-stone-400 font-bold text-lg mb-6">{t('noFavorites')}</p>
                     <button onClick={() => setView('menu')} className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-8 py-3 rounded-xl font-bold hover:bg-black dark:hover:bg-white/90 transition">
                        {t('backToMenu')}
                     </button>
                  </div>
                )}
             </div>

             <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 md:p-8 shadow-sm dark:border dark:border-stone-800 mt-8">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-stone-900 dark:text-white">
                   <ShoppingBag className="text-orange-500" /> {t('myOrders')}
                </h3>
                {orders.filter(o => o.customer === currentUser || o.customer === 'guest').length > 0 ? (
                   <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left">
                        <thead className="bg-stone-50 dark:bg-stone-800 text-stone-500 dark:text-stone-400">
                          <tr>
                             <th className="px-3 md:px-6 py-3 rounded-s-xl">{t('orderId')}</th>
                             <th className="px-3 md:px-6 py-3">{t('date')}</th>
                             <th className="px-3 md:px-6 py-3">{t('status')}</th>
                             <th className="px-3 md:px-6 py-3 rounded-e-xl">{t('total')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                           {orders.filter(o => o.customer === currentUser || o.customer === 'guest').map(order => (
                             <tr key={order.id} className="hover:bg-stone-50 dark:hover:bg-stone-800 transition">
                                <td className="px-3 md:px-6 py-4 font-bold text-stone-900 dark:text-white">{order.id}</td>
                                <td className="px-3 md:px-6 py-4 text-stone-600 dark:text-stone-400">{order.date}</td>
                                <td className="px-3 md:px-6 py-4">
                                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                                    order.status === 'completed' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                    order.status === 'delivering' ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' :
                                    order.status === 'preparing' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                    'bg-stone-100 text-stone-700 dark:bg-stone-900/30 dark:text-stone-400'
                                  }`}>
                                    {t(
                                      order.status === 'pending' ? 'statusPending' : 
                                      order.status === 'preparing' ? 'statusPreparing' : 
                                      order.status === 'delivering' ? 'statusDelivering' : 
                                      order.status === 'cancelled' ? 'statusCancelled' : 
                                      'statusCompleted'
                                    )}
                                  </span>
                                </td>
                                <td className="px-3 md:px-6 py-4 font-bold text-orange-600 dark:text-orange-400">{order.total} {t('currency')}</td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                   </div>
                ) : (
                   <p className="text-stone-500 dark:text-stone-400 font-medium text-center py-6">{t('noOrders')}</p>
                )}
             </div>
          </div>
        )}
        
        {view === 'track' && (
          <div className="max-w-2xl mx-auto text-center space-y-8 py-10">
             <div className="space-y-4">
               <h2 className="text-3xl font-black dark:text-white">{t('trackTitle')}</h2>
               <p className="text-stone-500 dark:text-stone-400">{t('trackSubtitle')}</p>
             </div>
             <div className="flex gap-2 max-w-md mx-auto">
               <input 
                 value={trackedOrder}
                 onChange={(e) => setTrackedOrder(e.target.value)}
                 placeholder={t('searchPlaceholder')}
                 className="flex-1 p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
               />
               <button onClick={handleTrackOrder} className="bg-stone-900 text-white dark:bg-white dark:text-stone-900 px-6 rounded-xl font-bold hover:scale-105 transition-transform">
                 {t('searchButton')}
               </button>
             </div>
             
             {trackingResult && trackingResult !== 'not_found' && (
               <div className="bg-white dark:bg-stone-800 p-5 md:p-8 rounded-3xl shadow-xl animate-fade-in-up border dark:border-stone-700">
                  <div className="flex justify-between items-center mb-8">
                     <span className="font-bold text-lg dark:text-white">{t('orderId')}: {trackedOrder}</span>
                     <span className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 rounded-full font-bold text-sm">
                        {t(trackingResult === 'pending' ? 'statusPending' : trackingResult === 'preparing' ? 'statusPreparing' : trackingResult === 'delivering' ? 'statusDelivering' : 'statusCompleted' as any)}
                     </span>
                  </div>
                  <div className="relative flex justify-between">
                     {['pending', 'preparing', 'delivering', 'completed'].map((step, idx) => {
                        const statusOrder = ['pending', 'preparing', 'delivering', 'completed'];
                        const currentIdx = statusOrder.indexOf(trackingResult);
                        const isCompleted = idx <= currentIdx;
                        
                        return (
                           <div key={step} className="flex flex-col items-center gap-2 relative z-10 w-1/4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${isCompleted ? 'bg-orange-500 text-white' : 'bg-stone-100 dark:bg-stone-700 text-stone-400'}`}>
                                 {step === 'pending' && <FileSpreadsheet size={18} />}
                                 {step === 'preparing' && <UtensilsCrossed size={18} />}
                                 {step === 'delivering' && <Bike size={18} />}
                                 {step === 'completed' && <CheckCircle size={18} />}
                              </div>
                              <span className={`text-xs font-bold ${isCompleted ? 'text-orange-600 dark:text-orange-400' : 'text-stone-400'}`}>
                                 {t(`trackStep${idx+1}` as any)}
                              </span>
                           </div>
                        );
                     })}
                     <div className="absolute top-5 left-0 w-full h-1 bg-stone-100 dark:bg-stone-700 -z-0">
                        <div 
                           className="h-full bg-orange-500 transition-all duration-1000"
                           style={{ width: `${(['pending', 'preparing', 'delivering', 'completed'].indexOf(trackingResult) / 3) * 100}%` }}
                        ></div>
                     </div>
                  </div>

                  {orders.find(o => o.id.toLowerCase() === trackedOrder.toLowerCase().trim()) && (
                      <div className="mt-8 p-6 bg-stone-50 dark:bg-stone-700/50 rounded-2xl border border-stone-100 dark:border-stone-600">
                          <p className="text-sm text-stone-500 dark:text-stone-400 mb-2 font-bold">{t('confirmationCode')}</p>
                          <p className="text-4xl font-black tracking-widest text-orange-600 dark:text-orange-400">
                            {orders.find(o => o.id.toLowerCase() === trackedOrder.toLowerCase().trim())?.confirmationCode || '----'}
                          </p>
                          <p className="text-xs text-stone-400 mt-2">{t('codeInstruction')}</p>
                      </div>
                  )}
               </div>
             )}
          </div>
        )}
        
        {view === 'admin' && isAdmin && (
          <div className="flex flex-col md:flex-row gap-6 min-h-[80vh]">
            <div className="w-full md:w-64 bg-white dark:bg-stone-900 rounded-3xl p-4 h-fit shadow-sm border border-stone-100 dark:border-stone-800 flex flex-col">
               <div className="space-y-2 flex-1">
                  <button onClick={() => setAdminTab('overview')} className={`w-full text-start px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors ${adminTab === 'overview' ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900' : 'text-stone-500 hover:text-stone-50 dark:hover:bg-stone-800'}`}>
                     <LayoutDashboard size={18} /> {t('overview')}
                  </button>
                  <button onClick={() => setAdminTab('products')} className={`w-full text-start px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors ${adminTab === 'products' ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900' : 'text-stone-500 hover:text-stone-50 dark:hover:bg-stone-800'}`}>
                     <Package size={18} /> {t('products')}
                  </button>
                  <button onClick={() => setAdminTab('orders')} className={`w-full text-start px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors ${adminTab === 'orders' ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900' : 'text-stone-500 hover:text-stone-50 dark:hover:bg-stone-800'}`}>
                     <LayoutList size={18} /> {t('orders')}
                     <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full mr-auto">{orders.filter(o => o.status === 'pending').length}</span>
                  </button>
                  <button onClick={() => setAdminTab('reviews')} className={`w-full text-start px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors ${adminTab === 'reviews' ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900' : 'text-stone-500 hover:text-stone-50 dark:hover:bg-stone-800'}`}>
                     <MessageSquare size={18} /> {t('reviews')}
                     <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full mr-auto">{reviews.filter(r => r.status === 'pending').length}</span>
                  </button>
                  <button onClick={() => setAdminTab('settings')} className={`w-full text-start px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors ${adminTab === 'settings' ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900' : 'text-stone-500 hover:text-stone-50 dark:hover:bg-stone-800'}`}>
                     <Settings size={18} /> {t('settings')}
                  </button>
               </div>
               
               <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 space-y-2">
                  <button onClick={toggleTheme} className="w-full text-start px-4 py-3 rounded-xl font-bold flex items-center gap-3 text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                     {isDarkMode ? <Sun size={18} /> : <Moon size={18} />} {t('darkMode')}
                  </button>
                  <button onClick={cycleLanguage} className="w-full text-start px-4 py-3 rounded-xl font-bold flex items-center gap-3 text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                     <Globe size={18} /> {language === 'ar' ? 'English' : language === 'en' ? 'Español' : 'العربية'}
                  </button>
                  <button onClick={() => setView('home')} className="w-full text-start px-4 py-3 rounded-xl font-bold flex items-center gap-3 text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                     <Home size={18} /> {t('backToSite')}
                  </button>
                  <button onClick={handleSystemLogout} className="w-full text-start px-4 py-3 rounded-xl font-bold flex items-center gap-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                     <LogOut size={18} /> {t('logout')}
                  </button>
               </div>
            </div>

            <div className="flex-1 space-y-6">
               {adminTab === 'overview' && (
                  <>
                     <h2 className="text-3xl font-black dark:text-white mb-6">{t('dashboard')}</h2>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-stone-800 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-700">
                           <h3 className="text-stone-500 dark:text-stone-400 font-bold mb-2">{t('totalOrders')}</h3>
                           <p className="text-4xl font-black dark:text-white">{orders.length}</p>
                        </div>
                        <div className="bg-white dark:bg-stone-800 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-700">
                           <h3 className="text-stone-500 dark:text-stone-400 font-bold mb-2">{t('totalSales')}</h3>
                           <p className="text-4xl font-black text-orange-600 dark:text-orange-400">{orders.reduce((acc, o) => acc + o.total, 0)} {t('currency')}</p>
                        </div>
                        <div className="bg-white dark:bg-stone-800 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-700">
                           <h3 className="text-stone-500 dark:text-stone-400 font-bold mb-2">{t('pendingOrders')}</h3>
                           <p className="text-4xl font-black text-amber-500">{orders.filter(o => o.status === 'pending').length}</p>
                        </div>
                     </div>

                     <div className="bg-white dark:bg-stone-800 rounded-3xl overflow-hidden border border-stone-100 dark:border-stone-700 mt-6">
                        <div className="p-6 border-b border-stone-100 dark:border-stone-700 flex justify-between items-center">
                           <h3 className="font-bold text-lg dark:text-white">{t('recentActivity')}</h3>
                        </div>
                        <div className="divide-y divide-stone-100 dark:divide-stone-700">
                           {orders.slice(0, 5).map(o => (
                              <div key={o.id} className="p-4 flex justify-between items-center hover:bg-stone-50 dark:hover:bg-stone-700/50 transition">
                                 <div>
                                    <p className="font-bold text-sm dark:text-white">{o.id} - {o.customer}</p>
                                    <p className="text-xs text-stone-500">{o.date}</p>
                                 </div>
                                 <span className={`px-2 py-1 rounded text-xs font-bold ${o.status === 'completed' ? 'bg-orange-100 text-orange-600' : 'bg-amber-100 text-amber-600'}`}>{o.status}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </>
               )}

               {adminTab === 'products' && (
                  <div>
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-black dark:text-white">{t('products')}</h2>
                        <button onClick={() => openProductModal()} className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-700 transition shadow-lg shadow-orange-600/20">
                           <Plus size={20} /> {t('addProduct')}
                        </button>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {menuItems.map(item => (
                           <div key={item.id} className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-stone-100 dark:border-stone-700 flex gap-4">
                              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                              <div className="flex-1">
                                 <h4 className="font-bold dark:text-white line-clamp-1">{item.name}</h4>
                                 <p className="text-orange-600 font-bold text-sm mb-2">{item.price} {t('currency')}</p>
                                 <div className="flex gap-2">
                                    <button onClick={() => openProductModal(item)} className="p-2 bg-stone-100 dark:bg-stone-700 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-sky-100 hover:text-sky-600 transition"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDeleteProduct(item.id)} className="p-2 bg-stone-100 dark:bg-stone-700 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-red-100 hover:text-red-600 transition"><Trash2 size={16} /></button>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {adminTab === 'orders' && (
                  <div>
                     <h2 className="text-3xl font-black dark:text-white mb-6">{t('orders')}</h2>
                     <div className="bg-white dark:bg-stone-800 rounded-3xl overflow-hidden border border-stone-100 dark:border-stone-700">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                              <thead className="bg-stone-50 dark:bg-stone-700 text-stone-500 dark:text-stone-400">
                                 <tr>
                                    <th className="px-3 md:px-6 py-4 whitespace-nowrap">{t('orderId')}</th>
                                    <th className="px-3 md:px-6 py-4 whitespace-nowrap">{t('date')}</th>
                                    <th className="px-3 md:px-6 py-4 whitespace-nowrap">{t('username')}</th>
                                    <th className="px-3 md:px-6 py-4 whitespace-nowrap">{t('phone')}</th>
                                    <th className="px-3 md:px-6 py-4 whitespace-nowrap">{t('status')}</th>
                                    <th className="px-3 md:px-6 py-4 whitespace-nowrap">{t('total')}</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-stone-100 dark:divide-stone-700">
                                {orders.map(order => (
                                  <tr key={order.id} className="hover:bg-stone-50 dark:hover:bg-stone-700/50 transition">
                                     <td className="px-3 md:px-6 py-4 whitespace-nowrap font-bold dark:text-white">{order.id}</td>
                                     <td className="px-3 md:px-6 py-4 whitespace-nowrap text-stone-500">{order.date}</td>
                                     <td className="px-3 md:px-6 py-4 whitespace-nowrap font-medium dark:text-stone-200">{order.customer}</td>
                                     <td className="px-3 md:px-6 py-4 whitespace-nowrap text-stone-500">{order.deliveryInfo?.phone || '-'}</td>
                                     <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                                        <select 
                                          value={order.status}
                                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                          className="bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-xs px-2 py-1 outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                           {['pending', 'preparing', 'delivering', 'completed', 'cancelled'].map(s => (
                                              <option key={s} value={s}>{t(s === 'pending' ? 'statusPending' : s === 'preparing' ? 'statusPreparing' : s === 'delivering' ? 'statusDelivering' : s === 'completed' ? 'statusCompleted' : 'statusCancelled' as any)}</option>
                                           ))}
                                        </select>
                                     </td>
                                     <td className="px-3 md:px-6 py-4 whitespace-nowrap font-bold text-orange-600 dark:text-orange-400">{order.total} {t('currency')}</td>
                                  </tr>
                                ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               )}

               {adminTab === 'reviews' && (
                  <div>
                     <h2 className="text-3xl font-black dark:text-white mb-6">{t('reviews')}</h2>
                     <div className="grid gap-6">
                        {reviews.filter(r => r.status === 'pending').length === 0 && (
                           <div className="text-center py-10 text-stone-500 dark:text-stone-400">
                              No pending reviews.
                           </div>
                        )}
                        {reviews.filter(r => r.status === 'pending').map(review => (
                           <div key={review.id} className="bg-white dark:bg-stone-800 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-700 flex flex-col md:flex-row gap-6 items-start">
                              <div className="flex-1">
                                 <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-700 flex items-center justify-center font-bold text-stone-500">
                                       {review.customerName.charAt(0)}
                                    </div>
                                    <div>
                                       <h4 className="font-bold dark:text-white">{review.customerName}</h4>
                                       <div className="flex gap-1 text-amber-500 text-xs">
                                          {[...Array(5)].map((_, i) => (
                                             <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-stone-300 dark:text-stone-600"} />
                                          ))}
                                       </div>
                                    </div>
                                    <span className="ml-auto text-xs text-stone-400">{review.date}</span>
                                 </div>
                                 <p className="text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-900/50 p-4 rounded-2xl italic">"{review.comment}"</p>
                              </div>
                              <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                                 <button onClick={() => handleReviewAction(review.id, 'approved')} className="flex-1 px-6 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-xl font-bold hover:bg-green-200 dark:hover:bg-green-900/50 transition flex items-center justify-center gap-2">
                                    <CheckCircle size={18} /> {t('approve')}
                                 </button>
                                 <button onClick={() => handleReviewAction(review.id, 'rejected')} className="flex-1 px-6 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-bold hover:bg-red-200 dark:hover:bg-red-900/50 transition flex items-center justify-center gap-2">
                                    <XCircle size={18} /> {t('actionReject')}
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>

                     {reviews.filter(r => r.status !== 'pending').length > 0 && (
                        <div className="mt-12">
                           <h3 className="text-xl font-bold dark:text-white mb-4">Past Reviews</h3>
                           <div className="space-y-4 opacity-75">
                              {reviews.filter(r => r.status !== 'pending').map(review => (
                                 <div key={review.id} className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-700 flex justify-between items-center">
                                    <div>
                                       <span className="font-bold dark:text-white mr-2">{review.customerName}</span>
                                       <span className="text-xs text-stone-500">{review.date}</span>
                                       <p className="text-sm text-stone-600 dark:text-stone-400 truncate max-w-md">{review.comment}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${review.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                       {review.status}
                                    </span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>
               )}

               {adminTab === 'settings' && (
                  <div>
                     <h2 className="text-3xl font-black dark:text-white mb-6">{t('settings')}</h2>
                     <div className="bg-white dark:bg-stone-800 rounded-3xl p-8 shadow-sm border border-stone-100 dark:border-stone-700 space-y-6">
                        <div>
                           <h3 className="text-xl font-bold dark:text-white mb-4">{t('sliderSettings')}</h3>
                           
                           <div className="flex flex-col gap-4 mb-6">
                              <div className="flex gap-2">
                                 <button 
                                   onClick={() => setSliderInputMethod('url')} 
                                   className={`px-4 py-2 rounded-lg text-sm font-bold ${sliderInputMethod === 'url' ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900' : 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300'}`}
                                 >
                                    {t('fromUrl')}
                                 </button>
                                 <button 
                                   onClick={() => setSliderInputMethod('file')}
                                   className={`px-4 py-2 rounded-lg text-sm font-bold ${sliderInputMethod === 'file' ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900' : 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300'}`}
                                 >
                                    {t('fromDevice')}
                                 </button>
                              </div>
                              
                              <div className="flex gap-2">
                                 {sliderInputMethod === 'url' ? (
                                    <input 
                                      value={newSliderImage}
                                      onChange={(e) => setNewSliderImage(e.target.value)}
                                      placeholder="https://example.com/image.jpg"
                                      className="flex-1 px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                 ) : (
                                    <div className="flex-1 relative">
                                        <input 
                                          type="file" 
                                          accept="image/*"
                                          onChange={handleSliderFileUpload}
                                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 flex items-center gap-2 text-stone-500">
                                           {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                                           {isUploading ? t('uploading') : (sliderUploadedImage ? t('imageSource') : t('uploadText'))}
                                        </div>
                                    </div>
                                 )}
                                 <button onClick={handleAddSliderImage} disabled={isUploading} className="bg-orange-600 text-white px-6 rounded-xl font-bold hover:bg-orange-700 transition disabled:opacity-50">
                                    {t('addImage')}
                                 </button>
                              </div>
                           </div>

                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {heroImages.map((img, idx) => (
                                 <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video">
                                    <img src={img} alt={`Slide ${idx}`} className="w-full h-full object-cover" />
                                    <button 
                                      onClick={() => handleDeleteSliderImage(idx)}
                                      className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                    >
                                       <X size={14} />
                                    </button>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               )}

            </div>
          </div>
        )}