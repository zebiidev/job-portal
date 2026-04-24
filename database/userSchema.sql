CREATE DATABASE IF NOT EXISTS job_portal;

USE job_portal;

CREATE TABLE IF NOT EXISTS `user` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    image VARCHAR(200) NULL,
    role ENUM('job-seeker','company','admin') DEFAULT 'job-seeker',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE `user`
    ADD COLUMN image VARCHAR(200) NULL AFTER password;

ALTER TABLE `user`
    ADD COLUMN role ENUM('job-seeker','company','admin') DEFAULT 'job-seeker' AFTER image;
