import { createClient } from '@supabase/supabase-js';
import { MenuItem, Order, Review } from '../types';

// Use environment variables injected via vite.config.ts define
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yyqleehgjrzqwwvmedrl.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5cWxlZWhnanJ6cXd3dm1lZHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDM5OTYsImV4cCI6MjA4NTExOTk5Nn0.nxgMKHAGw-Gbz3VksmjNFh9ZFLE2panJLsL2IN_UoPA';

export const supabase = createClient(supabaseUrl, supabaseKey);

// --- Image Functions ---

export const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          }
        }, 'image/jpeg', 0.8);
      };
    };
  });
};

export const uploadImage = async (file: File, folder: string): Promise<string | null> => {
  const fileName = `${folder}/${Date.now()}_${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, file);

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
};

// --- Data Functions ---

export const getMenuItems = async (): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*');
  
  if (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
  
  return (data as any) || [];
};

export const getMenuItemsByCategory = async (category: string): Promise<MenuItem[]> => {
  if (category === 'all') {
    return getMenuItems();
  }
  
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('category', category);
  
  if (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
  
  return (data as any) || [];
};

export const createOrder = async (order: any): Promise<any | null> => {
  const orderId = `ORD-${Date.now()}`;
  
  // Setting user_id to null to avoid foreign key constraint violations
  // as the current user logic might not be synced with the DB's auth.users table yet.

  const orderData = {
    id: orderId,
    user_id: null,
    user_name: order.user_name || 'Guest',
    items: order.items || [],
    subtotal: order.subtotal || 0,
    tax: order.tax || 0,
    delivery_fee: order.delivery_fee || 0,
    total: order.total || 0,
    status: order.status || 'pending',
    accepted: order.accepted || false,
    estimated_time: order.estimated_time || null,
    delivery_code: order.delivery_code || Math.floor(1000 + Math.random() * 9000).toString(),
    payment_method: order.payment_method || 'Cash',
    nequi_number: order.nequi_number || null,
    created_at: Date.now()
  };

  console.log('Creating order with data:', orderData);

  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select('*')
    .single();
  
  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
  
  console.log('Order created successfully:', data);
  return data;
};

export const getOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  
  // Map DB columns back to App Type (Order)
  return (data || []).map((o: any) => {
    let parsedItems = o.items;
    if (typeof o.items === 'string') {
        try {
            parsedItems = JSON.parse(o.items);
        } catch (e) {
            parsedItems = o.items;
        }
    }

    // Handle created_at whether it's a number (bigint) or string
    const dateObj = o.created_at ? new Date(Number(o.created_at) || o.created_at) : new Date();

    return {
      id: o.id,
      user_id: o.user_id,
      customer: o.user_name, // Map user_name -> customer
      items: parsedItems,
      total: o.total,
      status: o.status,
      type: 'delivery', // Default (missing in DB)
      date: dateObj.toLocaleString(),
      payment: o.payment_method, // Map payment_method -> payment
      confirmationCode: o.delivery_code, // Map delivery_code -> confirmationCode
      // delivery_info is missing in DB, so we return undefined or partial data
      deliveryInfo: undefined 
    };
  }) as Order[];
};

export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data || [];
};

export const getSliderItems = async () => {
  const { data, error } = await supabase
    .from('slider_items')
    .select('*')
    .order('id', { ascending: false });
  if (error) {
    console.error('Error fetching slider items:', error);
    return [];
  }
  return data || [];
};

export const getReviews = async (): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error || !data) {
    return [
      { id: '101', customerName: 'Karim Ben', rating: 5, comment: 'The best burger in town!', status: 'pending', date: '2024-03-10' },
      { id: '102', customerName: 'Sara L.', rating: 3, comment: 'Delivery was a bit late.', status: 'pending', date: '2024-03-09' },
    ];
  }
  
  return data.map((r: any) => ({
    id: r.id,
    customerName: r.username || 'Guest',
    rating: r.rating,
    comment: r.comment,
    status: r.status,
    date: new Date(r.created_at).toLocaleDateString()
  }));
};

export const updateReviewStatus = async (id: string, status: 'approved' | 'rejected') => {
  const { error } = await supabase
    .from('reviews')
    .update({ status })
    .eq('id', id);
  return !error;
};