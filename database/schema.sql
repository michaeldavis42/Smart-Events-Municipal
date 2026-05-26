-- SmartEvents Municipal - Database Schema
-- MySQL

CREATE DATABASE IF NOT EXISTS smartevents;
USE smartevents;

-- Roles
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

INSERT IGNORE INTO roles (id, name) VALUES (1, 'admin'), (2, 'organizer'), (3, 'user');

-- Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role_id INT DEFAULT 3,
  push_subscription JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(200) NOT NULL,
  lat DECIMAL(10,8) DEFAULT NULL,
  lng DECIMAL(11,8) DEFAULT NULL,
  category VARCHAR(100),
  description TEXT,
  slots INT DEFAULT 0,
  participants INT DEFAULT 0,
  image VARCHAR(500),
  status VARCHAR(50) DEFAULT 'Disponible',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Registrations
CREATE TABLE IF NOT EXISTS registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  event_id INT NOT NULL,
  participant_name VARCHAR(100) NOT NULL,
  participant_email VARCHAR(100) NOT NULL,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Reviews (like Letterboxd)
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (event_id) REFERENCES events(id),
  UNIQUE KEY unique_review (user_id, event_id)
);
