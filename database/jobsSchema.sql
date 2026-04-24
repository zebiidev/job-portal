
SELECT * FROM jobs;

CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    emp_type ENUM('full-time','part-time','contract','internship') DEFAULT 'full-time',
    work_type ENUM('onsite','remote','hybrid') DEFAULT 'onsite',
    job_level ENUM('junior','intermediate','senior'),
    location VARCHAR(150) NOT NULL,
    education ENUM('high-school','bachelor','master'),
    experience INT NOT NULL,
    min_salary BIGINT,
    max_salary BIGINT,
    currency ENUM('PKR','USD') DEFAULT 'PKR',
    salary_period ENUM('yearly','monthly') DEFAULT 'yearly',
    expiry_date DATE,
    description VARCHAR(300) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS tags(
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    tag VARCHAR(200) NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);



