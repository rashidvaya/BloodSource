-- Migration: Add role and permissions columns to users table
ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
ALTER TABLE users ADD COLUMN permissions TEXT NOT NULL DEFAULT '[]'; 