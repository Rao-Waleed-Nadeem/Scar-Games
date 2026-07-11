/*
  DB-Project-Game-Store - Seed data
  Inserts minimal data to make the backend usable.
*/

USE GameStoreDB;
GO

/* Avoid duplicates where practical */
IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE email = 'admin@example.com')
BEGIN
  INSERT INTO dbo.Users (username, email, password, role)
  VALUES ('Admin', 'admin@example.com', 'admin_password_hash', 'Admin');
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE email = 'demo@example.com')
BEGIN
  INSERT INTO dbo.Users (username, email, password, role)
  VALUES ('Demo User', 'demo@example.com', 'demo_password_hash', 'Customer');
END
GO

/* Seed a couple of games */
DECLARE @g1 INT, @g2 INT;

SELECT @g1 = game_id FROM dbo.Games WHERE title = 'Cyber Runner';
IF @g1 IS NULL
BEGIN
  INSERT INTO dbo.Games (title, description, price, platform, genre)
  VALUES ('Cyber Runner','A fast-paced cyber game.', 29.99, 'PC', 'Action');
  SELECT @g1 = SCOPE_IDENTITY();
END

SELECT @g2 = game_id FROM dbo.Games WHERE title = 'Space Detective';
IF @g2 IS NULL
BEGIN
  INSERT INTO dbo.Games (title, description, price, platform, genre)
  VALUES ('Space Detective','Solve mysteries across the galaxy.', 19.99, 'PC', 'Adventure');
  SELECT @g2 = SCOPE_IDENTITY();
END
GO

/* Inventory */
IF NOT EXISTS (SELECT 1 FROM dbo.Inventory WHERE game_id = @g1)
  INSERT INTO dbo.Inventory (game_id, stock_quantity) VALUES (@g1, 50);

IF NOT EXISTS (SELECT 1 FROM dbo.Inventory WHERE game_id = @g2)
  INSERT INTO dbo.Inventory (game_id, stock_quantity) VALUES (@g2, 25);
GO

/* Orders + payments */
DECLARE @adminId INT, @custId INT;
SELECT @adminId = user_id FROM dbo.Users WHERE email = 'admin@example.com';
SELECT @custId  = user_id FROM dbo.Users WHERE email = 'demo@example.com';

/* Create one order for demo user */
DECLARE @orderId INT;
SELECT TOP 1 @orderId = order_id FROM dbo.Orders WHERE user_id = @custId ORDER BY order_id DESC;

IF @orderId IS NULL
BEGIN
  DECLARE @total DECIMAL(18,2) = (SELECT price FROM dbo.Games WHERE game_id = @g1);

  INSERT INTO dbo.Orders (user_id, order_date, total_amount, status)
  VALUES (@custId, GETDATE(), @total, 'Pending');

  SET @orderId = SCOPE_IDENTITY();

  INSERT INTO dbo.OrderItems (order_id, game_id, quantity)
  VALUES (@orderId, @g1, 1);

  INSERT INTO dbo.Payments (order_id, payment_status, payment_method)
  VALUES (@orderId, 'Pending', 'Card');
END
GO

