-- TekVion CMS – Database schema (MySQL 5.7+ / MariaDB 10.2+)
-- Run this file once to create tables and default admin user.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Database (create if not exists)
CREATE DATABASE IF NOT EXISTS tekvion_cms
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
USE tekvion_cms;

-- Admin users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Site settings (key-value: address, phone, email, copyright, hero titles, intros, etc.)
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `key_name` varchar(100) NOT NULL,
  `value` text,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_name` (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Hero / banner slides
CREATE TABLE IF NOT EXISTS `hero_slides` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `title` varchar(255) NOT NULL DEFAULT '',
  `description` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Services (What we do)
CREATE TABLE IF NOT EXISTS `services` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `title` varchar(255) NOT NULL DEFAULT '',
  `description` text,
  `image` varchar(500) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Testimonials
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `name` varchar(100) NOT NULL DEFAULT '',
  `text` text,
  `image` varchar(500) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact form submissions
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '',
  `email` varchar(255) NOT NULL DEFAULT '',
  `phone` varchar(50) NOT NULL DEFAULT '',
  `message` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `read_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- Default admin user is created by install.php (email: admin@tekvion.ae, password: admin)

-- Default site settings
INSERT INTO `site_settings` (`key_name`, `value`) VALUES
('address', 'Sapphire Tower, Dubai, UAE'),
('phone', '+971 522 900 966'),
('email', 'Info@tekvion.ae'),
('copyright', '© 2026 All Rights Reserved. TekVion Technologies'),
('we_do_intro', 'We design and deliver end-to-end digital transformation solutions.'),
('about_intro', 'We design and deliver end-to-end digital transformation solutions—strategy, cloud, data, and automation—helping organizations modernize, scale, and achieve measurable business outcomes.')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- Default hero slides
INSERT INTO `hero_slides` (`sort_order`, `title`, `description`) VALUES
(1, 'Innovating with AI & Cloud', 'We deliver AI, cloud and automation solutions to accelerate business outcomes and drive measurable value.'),
(2, 'Cloud-Native Platforms', 'Build and operate resilient cloud platforms that scale with your business and reduce time-to-market.'),
(3, 'Data & Analytics at Scale', 'Turn data into actionable insights with analytics, machine learning and trustworthy data platforms.'),
(4, 'Digital Transformation Solutions', 'We design and deliver end-to-end digital transformation — strategy, cloud, data and automation to drive measurable business outcomes.')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Default services (insert if table empty)
INSERT IGNORE INTO `services` (`sort_order`, `title`, `description`, `image`) VALUES
(1, 'AI & Machine Learning', 'Applied AI and ML solutions to automate decisions, personalize experiences and unlock new revenue streams.', 'images/AI & Machine-Learning.jpeg'),
(2, 'Cloud Computing', 'Cloud strategy, migration and managed services to build resilient, scalable platforms for modern apps.', 'images/Cloud-Computing.jpeg'),
(3, 'Big Data & Analytics', 'Scalable data platforms and analytics pipelines that turn raw data into actionable business insight.', 'images/BigData & Analytics.jpeg'),
(4, 'Cybersecurity', 'Comprehensive security services to protect data, secure applications and manage risk across your estate.', 'images/CyberSecurity.jpeg'),
(5, 'API & Integration', 'Connect platforms and workflows with secure APIs, integrations, and scalable orchestration.', 'images/API\'s & System Integration.jpeg'),
(6, 'Mobile & Web Development', 'Modern web and mobile products with exceptional UX, scalable architecture and rapid delivery.', 'images/Mobile & Web Development.jpeg'),
(7, 'Intelligent Automation', 'Streamline operations with workflow automation, RPA, and AI-driven process optimization.', 'images/Automations.jpeg'),
(8, 'IT & Infrastructure', 'Resilient infrastructure, observability, and managed services to keep systems secure and fast.', 'images/It & Infrastructures Services.webp');

-- Default testimonials (insert if table empty)
INSERT IGNORE INTO `testimonials` (`sort_order`, `name`, `text`, `image`) VALUES
(1, 'Nafidh', 'Tekvion transformed our digital infrastructure with their exceptional cloud and AI solutions. Their end-to-end approach to digital transformation delivered measurable business outcomes within months. Highly recommended for enterprises seeking quality and expertise.', 'images/clint.jpg'),
(2, 'Nafidh', 'Tekvion transformed our digital infrastructure with their exceptional cloud and AI solutions. Their end-to-end approach to digital transformation delivered measurable business outcomes within months. Highly recommended for enterprises seeking quality and expertise.', 'images/clint.jpg'),
(3, 'Nafidh', 'Tekvion transformed our digital infrastructure with their exceptional cloud and AI solutions. Their end-to-end approach to digital transformation delivered measurable business outcomes within months. Highly recommended for enterprises seeking quality and expertise.', 'images/clint.jpg');
