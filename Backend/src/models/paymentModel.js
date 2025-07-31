import { sql } from "../utils/db.js";

export const createPayment = async ({
  order_id,
  payment_status,
  payment_method,
}) => {
  await sql.query`
    INSERT INTO Payments (order_id, payment_status, payment_method)
    VALUES (${order_id}, ${payment_status}, ${payment_method})
  `;
};

export const getAllPayments = async () => {
  const result = await sql.query`SELECT * FROM Payments`;
  return result.recordsets;
};

export const getPaymentByOrderId = async (order_id) => {
  const result = await sql.query`
    SELECT * FROM Payments WHERE order_id = ${order_id}
  `;
  return result.recordsets[0];
};

export const updatePaymentStatus = async (payment_id, payment_status) => {
  await sql.query`
    UPDATE Payments
    SET payment_status = ${payment_status}
    WHERE payment_id = ${payment_id}
  `;
};

export const deletePayment = async (payment_id) => {
  await sql.query`
    DELETE FROM Payments WHERE payment_id = ${payment_id}
  `;
};
