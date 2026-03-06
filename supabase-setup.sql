-- Supabase Database Setup for Lalasa Bakery POS
-- Run this SQL in your Supabase SQL Editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'cashier',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(status);

-- Insert some sample data (optional)
INSERT INTO products (name, price, category) VALUES
  ('Croissant', 2.50, 'Bakery'),
  ('Baguette', 3.00, 'Bakery'),
  ('Chocolate Chip Cookie', 1.50, 'Bakery'),
  ('Cappuccino', 3.50, 'Drinks'),
  ('Latte', 4.00, 'Drinks'),
  ('Water Bottle', 1.00, 'Drinks'),
  ('Mixed Nuts', 2.00, 'Snacks'),
  ('Granola Bar', 1.25, 'Snacks')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete own profile" ON users
  FOR DELETE USING (true);

-- Create policies for products table
CREATE POLICY "All can view products" ON products
  FOR SELECT USING (true);

CREATE POLICY "All can insert products" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "All can update products" ON products
  FOR UPDATE USING (true);

CREATE POLICY "All can delete products" ON products
  FOR DELETE USING (true);

-- Create policies for sales table
CREATE POLICY "Users can view their own sales" ON sales
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own sales" ON sales
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own sales" ON sales
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own sales" ON sales
  FOR DELETE USING (true);

-- Note: In a production environment, you would want to implement more restrictive RLS policies
-- and use proper authentication with Supabase Auth instead of the simple localStorage approach