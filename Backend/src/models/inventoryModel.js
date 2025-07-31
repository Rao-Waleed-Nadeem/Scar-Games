import { sql } from "../utils/db.js";

const fixBigInt = (obj) => {
  if (!obj) return obj;
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? Number(value) : value
    )
  );
};

export const addInventoryItem = async ({ game_id, stock_quantity }) => {
  await sql.query`
    INSERT INTO Inventory (game_id, stock_quantity)
    VALUES (${game_id}, ${stock_quantity})
  `;

  const result = await sql.query`
      SELECT TOP 1 * FROM Inventory 
      WHERE game_id = ${game_id} 
    `;

  return fixBigInt(result.recordset[0]);
};

export const getAllInventory = async () => {
  const result = await sql.query`SELECT * FROM Inventory`;
  return result.recordset;
};

export const getInventoryByGameId = async (game_id) => {
  const result = await sql.query`
    SELECT * FROM Inventory WHERE game_id = ${game_id}
  `;
  return result.recordset[0];
};

export const updateInventory = async (game_id, stock_quantity) => {
  await sql.query`
    UPDATE Inventory SET stock_quantity = ${stock_quantity}
    WHERE game_id = ${game_id}
  `;
};

export const deleteInventoryItem = async (game_id) => {
  await sql.query`DELETE FROM Inventory WHERE game_id = ${game_id}`;
};
