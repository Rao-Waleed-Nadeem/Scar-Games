/*
  DB-Project-Game-Store - Database schema
  - Designed for SQL Server 2022
  - Creates DB + tables used by existing controllers/models
*/

IF DB_ID('GameStoreDB') IS NULL
BEGIN
  CREATE DATABASE GameStoreDB;
END
GO

USE GameStoreDB;
GO

/* Drop in dependency order */
IF OBJECT_ID('dbo.OrderItems','U') IS NOT NULL DROP TABLE dbo.OrderItems;
IF OBJECT_ID('dbo.Payments','U') IS NOT NULL DROP TABLE dbo.Payments;
IF OBJECT_ID('dbo.Orders','U') IS NOT NULL DROP TABLE dbo.Orders;
IF OBJECT_ID('dbo.Inventory','U') IS NOT NULL DROP TABLE dbo.Inventory;
IF OBJECT_ID('dbo.Games','U') IS NOT NULL DROP TABLE dbo.Games;
IF OBJECT_ID('dbo.Users','U') IS NOT NULL DROP TABLE dbo.Users;
GO

CREATE TABLE dbo.Users (
  user_id       INT IDENTITY(1,1) PRIMARY KEY,
  username      NVARCHAR(100) NOT NULL,
  email         NVARCHAR(255) NOT NULL,
  password      NVARCHAR(255) NOT NULL,
  role          NVARCHAR(50) NOT NULL,
  CONSTRAINT UQ_Users_email UNIQUE (email),
  CONSTRAINT CK_Users_role CHECK (role IN ('Admin','Customer'))
);
GO

/* Temporary signup verification table for email OTP */
IF OBJECT_ID('dbo.EmailVerifications','U') IS NOT NULL DROP TABLE dbo.EmailVerifications;
GO

CREATE TABLE dbo.EmailVerifications (
  verification_id INT IDENTITY(1,1) PRIMARY KEY,
  username        NVARCHAR(100) NOT NULL,
  email           NVARCHAR(255) NOT NULL,
  password_hash   NVARCHAR(255) NOT NULL,
  otp_hash        NVARCHAR(255) NOT NULL,
  expires_at      DATETIME2 NOT NULL,
  created_at      DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT UQ_EmailVerifications_email UNIQUE (email),
  CONSTRAINT CK_EmailVerifications_expires CHECK (expires_at > created_at)
);
GO

CREATE TABLE dbo.Games (
  game_id       INT IDENTITY(1,1) PRIMARY KEY,
  title         NVARCHAR(200) NOT NULL,
  description   NVARCHAR(MAX) NOT NULL,
  price         DECIMAL(18,2) NOT NULL,
  platform      NVARCHAR(100) NOT NULL,
  genre         NVARCHAR(100) NOT NULL,
  CONSTRAINT CK_Games_price CHECK (price >= 0)
);
GO

CREATE TABLE dbo.Inventory (
  game_id        INT NOT NULL,
  stock_quantity INT NOT NULL,
  CONSTRAINT PK_Inventory PRIMARY KEY (game_id),
  CONSTRAINT FK_Inventory_game FOREIGN KEY (game_id) REFERENCES dbo.Games(game_id) ON DELETE CASCADE,
  CONSTRAINT CK_Inventory_stock CHECK (stock_quantity >= 0)
);
GO

CREATE TABLE dbo.Orders (
  order_id     INT IDENTITY(1,1) PRIMARY KEY,
  user_id      INT NOT NULL,
  order_date   DATETIME2 NOT NULL,
  total_amount DECIMAL(18,2) NOT NULL,
  status       NVARCHAR(50) NOT NULL,
  CONSTRAINT FK_Orders_user FOREIGN KEY (user_id) REFERENCES dbo.Users(user_id),
  CONSTRAINT CK_Orders_total CHECK (total_amount >= 0),
  CONSTRAINT CK_Orders_status CHECK (status IN ('Pending','Paid','Cancelled','Completed'))
);
GO

CREATE TABLE dbo.OrderItems (
  order_item_id INT IDENTITY(1,1) PRIMARY KEY,
  order_id       INT NOT NULL,
  game_id        INT NOT NULL,
  quantity       INT NOT NULL,
  CONSTRAINT FK_OrderItems_order FOREIGN KEY (order_id) REFERENCES dbo.Orders(order_id) ON DELETE CASCADE,
  CONSTRAINT FK_OrderItems_game FOREIGN KEY (game_id) REFERENCES dbo.Games(game_id),
  CONSTRAINT CK_OrderItems_quantity CHECK (quantity > 0)
);
GO

CREATE TABLE dbo.Payments (
  payment_id      INT IDENTITY(1,1) PRIMARY KEY,
  order_id        INT NOT NULL,
  payment_status  NVARCHAR(50) NOT NULL,
  payment_method  NVARCHAR(100) NOT NULL,
  CONSTRAINT FK_Payments_order FOREIGN KEY (order_id) REFERENCES dbo.Orders(order_id) ON DELETE CASCADE,
  CONSTRAINT CK_Payments_status CHECK (payment_status IN ('Pending','Paid','Failed','Refunded'))
);
GO

/* Useful indexes */
CREATE INDEX IX_Inventory_game_id ON dbo.Inventory(game_id);
CREATE INDEX IX_OrderItems_order_id ON dbo.OrderItems(order_id);
CREATE INDEX IX_Orders_user_id ON dbo.Orders(user_id);
CREATE INDEX IX_Payments_order_id ON dbo.Payments(order_id);
GO

