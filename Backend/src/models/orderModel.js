import { sql } from "../utils/db.js";

export const createOrder = async ({
  user_id,
  order_date,
  total_amount,
  status,
}) => {
  await sql.query`
    INSERT INTO Orders (user_id, order_date, total_amount, status)
    VALUES (${user_id}, ${order_date}, ${total_amount}, ${status});
  `;

  // Query to retrieve the last inserted order by user_id and order_date (this assumes `order_id` is auto-incremented)
  const result = await sql.query`
    SELECT TOP 1 * FROM Orders 
    WHERE user_id = ${user_id} AND order_date = ${order_date}
    ORDER BY order_id DESC;
  `;

  return result.recordsets[0]; // Return the most recent order (including the generated order_id)
};

export const getAllOrders = async () => {
  const result = await sql.query`
    SELECT order_id, user_id, order_date, total_amount, status
    FROM Orders
   
  `;

  const orders = result.recordset;
  // console.log("orders: ", orders);

  const detailedOrders = [];

  for (const order of orders) {
    const { order_id } = order;
    // console.log("order: ", order);

    // Fetch Payment for this order_id
    const paymentResult = await sql.query`
      SELECT *
      FROM Payments
      WHERE order_id = ${order_id}
    `;
    const payment = paymentResult.recordset[0]; // Only one payment per order
    // console.log("payment: ", payment);

    const userResult = await sql.query`
    SELECT username, email
    FROM Users
    WHERE user_id = ${order.user_id}
    `;
    const user = userResult.recordset[0];

    // Fetch OrderItems + Game details for this order_id
    const orderItemsResult = await sql.query`
      SELECT 
        oi.*,          -- All columns from OrderItems
        g.title AS title, 
        g.price AS price,
        g.description AS description ,
        g.genre AS genre ,
        g.platform AS platform 
      FROM OrderItems oi
      JOIN Games g ON oi.game_id = g.game_id
      WHERE oi.order_id = ${order_id}
    `;
    const orderItems = orderItemsResult.recordset; // Multiple items possible
    // console.log("orderItems with game info: ", orderItems);

    detailedOrders.push({
      ...order,
      payment,
      orderItems,
      user,
    });
  }

  return detailedOrders;
};

export const getUserOrders = async (id) => {
  const result = await sql.query`
    SELECT order_id, order_date, total_amount, status
    FROM Orders
    WHERE user_id = ${id}
  `;

  const orders = result.recordset;
  // console.log("orders: ", orders);

  const detailedOrders = [];

  for (const order of orders) {
    const { order_id } = order;
    // console.log("order: ", order);

    // Fetch Payment for this order_id
    const paymentResult = await sql.query`
      SELECT *
      FROM Payments
      WHERE order_id = ${order_id}
    `;
    const payment = paymentResult.recordset[0]; // Only one payment per order
    // console.log("payment: ", payment);

    // Fetch OrderItems + Game details for this order_id
    const orderItemsResult = await sql.query`
      SELECT 
        oi.*,          -- All columns from OrderItems
        g.title AS title, 
        g.price AS price,
        g.description AS description ,
        g.genre AS genre ,
        g.platform AS platform 
      FROM OrderItems oi
      JOIN Games g ON oi.game_id = g.game_id
      WHERE oi.order_id = ${order_id}
    `;
    const orderItems = orderItemsResult.recordset; // Multiple items possible
    // console.log("orderItems with game info: ", orderItems);

    detailedOrders.push({
      ...order,
      payment,
      orderItems,
    });
  }

  return detailedOrders;
};

export const getOrderById = async (order_id) => {
  const result =
    await sql.query`SELECT * FROM Orders WHERE order_id = ${order_id}`;
  return result.recordsets[0];
};

export const updateOrder = async ({ order_id, total_amount, status }) => {
  // console.log("id, status, amount ", order_id, status, total_amount);
  await sql.query`
    UPDATE Orders
    SET status = ${status}, total_amount = ${total_amount}
    WHERE order_id = ${order_id}
  `;
};

export const deleteOrder = async (order_id) => {
  await sql.query`DELETE FROM Orders WHERE order_id = ${order_id}`;
};
