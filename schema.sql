
-- Create database (optional)
CREATE DATABASE IF NOT EXISTS school_db;
USE school_db;

-- Table per assignment
CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  contact VARCHAR(20),
  image TEXT,
  email_id TEXT
);
