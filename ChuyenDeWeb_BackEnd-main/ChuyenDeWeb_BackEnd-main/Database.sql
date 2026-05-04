CREATE TABLE image (
                    id bigint(20) NOT NULL AUTO_INCREMENT,
                    url varchar(255) NOT NULL,
                    public_id varchar(255) NOT NULL,
                    PRIMARY KEY (`id`)
)
ALTER TABLE users ADD COLUMN account_type INT DEFAULT 1;
UPDATE users SET account_type = 0 WHERE username = 'admin';
-- accountType số 0 là Admin
-- accountType số 1 là Tài khoản thường
-- accountType số 2 là tài khoản premium
/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MariaDB
 Source Server Version : 100432 (10.4.32-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : chuyendeweb

 Target Server Type    : MariaDB
 Target Server Version : 100432 (10.4.32-MariaDB)
 File Encoding         : 65001

 Date: 16/06/2025 13:43:16
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for article_contents
-- ----------------------------
DROP TABLE IF EXISTS `article_contents`;
CREATE TABLE `article_contents`  (
                                     `content_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
                                     `article_id` int(10) UNSIGNED NOT NULL,
                                     `content_type` enum('text','image') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
                                     `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
                                     `order_index` int(10) UNSIGNED NOT NULL,
                                     `version` int(11) NULL DEFAULT 1,
                                     `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
                                     PRIMARY KEY (`content_id`) USING BTREE,
                                     INDEX `article_id`(`article_id`) USING BTREE,
                                     CONSTRAINT `article_contents_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `articles` (`article_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 86 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for articles
-- ----------------------------
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles`  (
                             `article_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
                             `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
                             `link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
                             `image_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
                             `author_id` int(10) UNSIGNED NOT NULL,
                             `category_id` int(10) UNSIGNED NULL DEFAULT NULL,
                             `status` enum('draft','published','archived') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'draft',
                             `published_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
                             `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
                             `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
                             PRIMARY KEY (`article_id`) USING BTREE,
                             INDEX `author_id`(`author_id`) USING BTREE,
                             INDEX `category_id`(`category_id`) USING BTREE,
                             CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `authors` (`author_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
                             CONSTRAINT `articles_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 646 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for authors
-- ----------------------------
DROP TABLE IF EXISTS `authors`;
CREATE TABLE `authors`  (
                            `author_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
                            `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
                            `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
                            `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
                            PRIMARY KEY (`author_id`) USING BTREE,
                            UNIQUE INDEX `email`(`email`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories`  (
                               `category_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
                               `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
                               `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
                               PRIMARY KEY (`category_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments`  (
                             `comment_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
                             `article_id` int(10) UNSIGNED NOT NULL,
                             `user_id` int(10) UNSIGNED NOT NULL,
                             `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
                             `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
                             PRIMARY KEY (`comment_id`) USING BTREE,
                             INDEX `article_id`(`article_id`) USING BTREE,
                             INDEX `user_id`(`user_id`) USING BTREE,
                             CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `articles` (`article_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
                             CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for post
-- ----------------------------
DROP TABLE IF EXISTS `post`;
CREATE TABLE `post`  (
                         `id` bigint(20) NOT NULL AUTO_INCREMENT,
                         `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
                         `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
                         `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
                         PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
                          `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
                          `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
                          `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
                          `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
                          `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
                          `birthday` date NULL DEFAULT NULL,
                          `account_type` int(11) NOT NULL,
                          `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
                          PRIMARY KEY (`id`) USING BTREE,
                          UNIQUE INDEX `username`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

