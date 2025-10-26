-- Create two logical databases and dedicated users with limited privileges
CREATE DATABASE IF NOT EXISTS veterinaria_s1 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS veterinaria_s2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Users for each system
CREATE USER IF NOT EXISTS 'veter_s1'@'%' IDENTIFIED BY 'vetS1!2025';
CREATE USER IF NOT EXISTS 'veter_s2'@'%' IDENTIFIED BY 'vetS2!2025';

GRANT ALL PRIVILEGES ON veterinaria_s1.* TO 'veter_s1'@'%';
GRANT ALL PRIVILEGES ON veterinaria_s2.* TO 'veter_s2'@'%';

FLUSH PRIVILEGES;
