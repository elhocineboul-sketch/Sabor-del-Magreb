import { MenuItem, Category, Order } from './types';

const MENU_ITEMS_AR: MenuItem[] = [
  {
    id: '1',
    name: 'برجر مراكش الملكي',
    description: 'لحم بقري مشوي على الفحم مع صلصة الأندلس الحارة، جبن شيدر ذائب، وبصل مكرمل.',
    price: 65,
    category: 'burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
    calories: 850,
    spiciness: 60,
    sweetness: 20,
    protein: 45,
    carbs: 60
  },
  {
    id: '3',
    name: 'بيتزا أطلس',
    description: 'عجينة رقيقة مع صلصة طماطم طازجة، موزاريلا، كفتة مغربية، وزيتون أسود.',
    price: 70,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1000&auto=format&fit=crop', // Fallback image, ideally utilize distinct ones
    rating: 4.7,
    calories: 1100,
    spiciness: 30,
    sweetness: 15,
    protein: 40,
    carbs: 120
  },
  {
    id: '4',
    name: 'عصير الأفوكادو الملكي',
    description: 'عصير أفوكادو طازج مع الفواكه الجافة والعسل الحر.',
    price: 35,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1623594834789-77579db4e022?q=80&w=1000&auto=format&fit=crop',
    rating: 5.0,
    calories: 400,
    spiciness: 0,
    sweetness: 70,
    protein: 10,
    carbs: 40
  },
  {
    id: '6',
    name: 'شاورما دجاج أصيلة',
    description: 'شاورما دجاج متبلة بخلطة سرية، تقدم في خبز صاج مع صلصة الثومية والمخلل.',
    price: 45,
    category: 'shawarma',
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?q=80&w=1000&auto=format&fit=crop',
    rating: 4.9,
    calories: 600,
    spiciness: 20,
    sweetness: 10,
    protein: 35,
    carbs: 50
  },
  {
    id: '7',
    name: 'كباب مراكشي مشكل',
    description: 'تشكيلة من أسياخ الكفتة والدجاج المشوي على الفحم مع الطماطم المشوية والبصل.',
    price: 80,
    category: 'kebab',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
    calories: 750,
    spiciness: 40,
    sweetness: 5,
    protein: 60,
    carbs: 20
  }
];

const MENU_ITEMS_EN: MenuItem[] = [
  {
    id: '1',
    name: 'Marrakech Royal Burger',
    description: 'Charcoal-grilled beef patty with spicy Andalouse sauce, melted cheddar, and caramelized onions.',
    price: 65,
    category: 'burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
    calories: 850,
    spiciness: 60,
    sweetness: 20,
    protein: 45,
    carbs: 60
  },
  {
    id: '3',
    name: 'Atlas Pizza',
    description: 'Thin crust with fresh tomato sauce, mozzarella, Moroccan kofta, and black olives.',
    price: 70,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1000&auto=format&fit=crop',
    rating: 4.7,
    calories: 1100,
    spiciness: 30,
    sweetness: 15,
    protein: 40,
    carbs: 120
  },
  {
    id: '4',
    name: 'Royal Avocado Juice',
    description: 'Fresh avocado smoothie topped with dried fruits and pure honey.',
    price: 35,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1623594834789-77579db4e022?q=80&w=1000&auto=format&fit=crop',
    rating: 5.0,
    calories: 400,
    spiciness: 0,
    sweetness: 70,
    protein: 10,
    carbs: 40
  },
  {
    id: '6',
    name: 'Authentic Chicken Shawarma',
    description: 'Marinated chicken shawarma with secret spices, served in saj bread with garlic sauce and pickles.',
    price: 45,
    category: 'shawarma',
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?q=80&w=1000&auto=format&fit=crop',
    rating: 4.9,
    calories: 600,
    spiciness: 20,
    sweetness: 10,
    protein: 35,
    carbs: 50
  },
  {
    id: '7',
    name: 'Marrakesh Mixed Kebab',
    description: 'Assortment of kofta and chicken skewers grilled over charcoal with grilled tomatoes and onions.',
    price: 80,
    category: 'kebab',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
    calories: 750,
    spiciness: 40,
    sweetness: 5,
    protein: 60,
    carbs: 20
  }
];

const MENU_ITEMS_ES: MenuItem[] = [
  {
    id: '1',
    name: 'Hamburguesa Real Marrakech',
    description: 'Carne de res a la parrilla con salsa andaluza picante, queso cheddar derretido y cebolla caramelizada.',
    price: 65,
    category: 'burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
    calories: 850,
    spiciness: 60,
    sweetness: 20,
    protein: 45,
    carbs: 60
  },
  {
    id: '3',
    name: 'Pizza del Atlas',
    description: 'Masa fina con salsa de tomate fresca, mozzarella, kofta marroquí y aceitunas negras.',
    price: 70,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1000&auto=format&fit=crop',
    rating: 4.7,
    calories: 1100,
    spiciness: 30,
    sweetness: 15,
    protein: 40,
    carbs: 120
  },
  {
    id: '4',
    name: 'Jugo Real de Aguacate',
    description: 'Batido de aguacate fresco cubierto con frutas secas y miel pura.',
    price: 35,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1623594834789-77579db4e022?q=80&w=1000&auto=format&fit=crop',
    rating: 5.0,
    calories: 400,
    spiciness: 0,
    sweetness: 70,
    protein: 10,
    carbs: 40
  },
  {
    id: '6',
    name: 'Shawarma de Pollo Auténtico',
    description: 'Shawarma de pollo marinado con especias secretas, servido en pan saj con salsa de ajo y pepinillos.',
    price: 45,
    category: 'shawarma',
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?q=80&w=1000&auto=format&fit=crop',
    rating: 4.9,
    calories: 600,
    spiciness: 20,
    sweetness: 10,
    protein: 35,
    carbs: 50
  },
  {
    id: '7',
    name: 'Kebab Mixto Marrakech',
    description: 'Surtido de brochetas de kofta y pollo asadas al carbón con tomates y cebollas asadas.',
    price: 80,
    category: 'kebab',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
    calories: 750,
    spiciness: 40,
    sweetness: 5,
    protein: 60,
    carbs: 20
  }
];

export const MENU_ITEMS_BY_LANG = {
  ar: MENU_ITEMS_AR,
  en: MENU_ITEMS_EN,
  es: MENU_ITEMS_ES
};

// Default export - Set to Spanish
export const MENU_ITEMS = MENU_ITEMS_ES;

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all', label: 'Todo' },
  { id: 'burger', label: 'Hamburguesas' },
  { id: 'pizza', label: 'Pizza' },
  { id: 'shawarma', label: 'Shawarma' },
  { id: 'kebab', label: 'Kebab' },
  { id: 'drinks', label: 'Bebidas' },
];

// Seed Data to simulate shared DB across devices
export const MOCK_DB_ORDERS: Order[] = [];

export const ADMIN_USERNAME = 'elhocine boul';
export const ADMIN_PASSWORD = 'wizardgoo10200'; 

export const DRIVER_USERNAME = 'Conductor rápido';
export const DRIVER_PASSWORD = 'elhocine1020';

export const MOCK_REGISTERED_USERS_KEY = 'food_morocco_registered_users_v2';
export const MOCK_CURRENT_USER_KEY = 'food_morocco_current_user_v2';
export const STORAGE_ORDERS_KEY = 'food_morocco_orders_db_v2';