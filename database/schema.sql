-- MySQL 8 schema for the Together website (import in cPanel > phpMyAdmin, then seed.sql).
-- One table per former Base44 entity, plus users/sessions for sign-in.
-- Ids are 24-char hex strings, the same shape Base44 used, so exported records keep their ids.

CREATE TABLE IF NOT EXISTS users (
  id            VARCHAR(32)  NOT NULL PRIMARY KEY,
  email         VARCHAR(254) NOT NULL UNIQUE,
  full_name     VARCHAR(200) NULL,
  role          VARCHAR(10)  NOT NULL DEFAULT 'user',
  password_hash VARCHAR(255) NOT NULL,
  created_date  DATETIME     NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash CHAR(64)    NOT NULL PRIMARY KEY,
  user_id    VARCHAR(32) NOT NULL,
  created_at DATETIME    NOT NULL,
  expires_at DATETIME    NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS login_attempts (
  ip           VARCHAR(45) NOT NULL,
  attempted_at DATETIME    NOT NULL
);
CREATE INDEX idx_login_attempts_ip ON login_attempts (ip, attempted_at);

CREATE TABLE IF NOT EXISTS projects (
  id           VARCHAR(32)   NOT NULL PRIMARY KEY,
  title        VARCHAR(300)  NOT NULL,
  title_ar     VARCHAR(300)  NULL,
  client       VARCHAR(300)  NULL,
  client_ar    VARCHAR(300)  NULL,
  summary      TEXT          NULL,
  summary_ar   TEXT          NULL,
  division     VARCHAR(20)   NOT NULL,
  year         INT           NOT NULL,
  year_label   VARCHAR(50)   NULL,
  video_url    VARCHAR(1000) NULL,
  featured     TINYINT(1)    NULL,
  images       TEXT          NULL,
  created_date DATETIME      NOT NULL,
  updated_date DATETIME      NOT NULL
);
CREATE INDEX idx_projects_division ON projects (division, year);

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id           VARCHAR(32)  NOT NULL PRIMARY KEY,
  name         VARCHAR(200) NOT NULL,
  organisation VARCHAR(200) NULL,
  email        VARCHAR(254) NOT NULL,
  phone        VARCHAR(50)  NULL,
  division     VARCHAR(20)  NULL,
  message      TEXT         NOT NULL,
  ip           VARCHAR(45)  NULL,
  created_date DATETIME     NOT NULL
);
CREATE INDEX idx_inquiries_ip ON contact_inquiries (ip, created_date);

CREATE TABLE IF NOT EXISTS site_content_draft (
  id              VARCHAR(32)  NOT NULL PRIMARY KEY,
  `key`           VARCHAR(20)  NOT NULL UNIQUE,
  content         MEDIUMTEXT   NULL,
  updated_by_name VARCHAR(200) NULL,
  created_date    DATETIME     NOT NULL,
  updated_date    DATETIME     NOT NULL
);

CREATE TABLE IF NOT EXISTS site_content_published (
  id                VARCHAR(32)  NOT NULL PRIMARY KEY,
  `key`             VARCHAR(20)  NOT NULL UNIQUE,
  content           MEDIUMTEXT   NULL,
  published_at      DATETIME     NULL,
  published_by_name VARCHAR(200) NULL,
  created_date      DATETIME     NOT NULL,
  updated_date      DATETIME     NOT NULL
);

CREATE TABLE IF NOT EXISTS site_settings (
  id                  VARCHAR(32)  NOT NULL PRIMARY KEY,
  `key`               VARCHAR(20)  NOT NULL UNIQUE,
  maintenance_enabled TINYINT(1)   NOT NULL DEFAULT 0,
  changed_by_name     VARCHAR(200) NULL,
  created_date        DATETIME     NOT NULL,
  updated_date        DATETIME     NOT NULL
);
