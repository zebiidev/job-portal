-- ============================================================
-- Job Portal — Complete Database Schema
-- Run this file against your MySQL server to set up all tables.
-- ============================================================

CREATE DATABASE IF NOT EXISTS job_portal;
USE job_portal;

-- -------------------------------------------------------
-- 1. Users
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    image VARCHAR(500) NULL,
    role ENUM('job-seeker','company','admin') DEFAULT 'job-seeker',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------
-- 2. Company Profiles (one per company user)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS company_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    company_name VARCHAR(200) NOT NULL,
    description TEXT,
    website VARCHAR(300),
    logo VARCHAR(500),
    industry VARCHAR(100),
    company_size VARCHAR(50),
    location VARCHAR(200),
    founded_year INT,
    phone VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- 3. User Profiles (one per job-seeker user)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    phone VARCHAR(30),
    title VARCHAR(150),
    bio TEXT,
    skills TEXT,
    experience TEXT,
    education TEXT,
    resume_url VARCHAR(500),
    linkedin VARCHAR(300),
    github VARCHAR(300),
    portfolio VARCHAR(300),
    location VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- 4. Jobs (add company_id foreign key)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT,
    title VARCHAR(150) NOT NULL,
    emp_type ENUM('full-time','part-time','contract','internship') DEFAULT 'full-time',
    work_type ENUM('onsite','remote','hybrid') DEFAULT 'onsite',
    job_level ENUM('junior','intermediate','senior'),
    location VARCHAR(150) NOT NULL,
    education ENUM('high-school','bachelor','master'),
    experience INT NOT NULL DEFAULT 0,
    min_salary BIGINT,
    max_salary BIGINT,
    currency ENUM('PKR','USD') DEFAULT 'PKR',
    salary_period ENUM('yearly','monthly') DEFAULT 'yearly',
    expiry_date DATE,
    description TEXT NOT NULL,
    status ENUM('active','closed','draft') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES `user`(id) ON DELETE SET NULL
);

-- If jobs table already exists without company_id and status columns:
-- ALTER TABLE jobs ADD COLUMN company_id INT AFTER id;
-- ALTER TABLE jobs ADD COLUMN status ENUM('active','closed','draft') DEFAULT 'active' AFTER description;
-- ALTER TABLE jobs ADD FOREIGN KEY (company_id) REFERENCES `user`(id) ON DELETE SET NULL;
-- ALTER TABLE jobs MODIFY description TEXT NOT NULL;

-- -------------------------------------------------------
-- 5. Tags
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    tag VARCHAR(200) NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- 6. Applications
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    resume_url VARCHAR(500),
    cover_letter TEXT,
    status ENUM('pending','reviewed','shortlisted','interview','rejected','accepted') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (user_id, job_id)
);

-- -------------------------------------------------------
-- 7. Saved Jobs
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS saved_jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_saved (user_id, job_id)
);
