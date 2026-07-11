import { sql } from "../utils/db.js";

const fixBigInt = (obj) => {
  if (!obj) return obj;
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? Number(value) : value,
    ),
  );
};

export const findUserByEmail = async (email) => {
  const result = await sql.query`
    SELECT * FROM Users WHERE email = ${email}
  `;
  return result.recordset[0];
};

export const createUser = async ({ username, email, password, role }) => {
  await sql.query`
    INSERT INTO Users (username, email, password, role)
    VALUES (${username}, ${email}, ${password}, ${role})
  `;
  const result = await sql.query`
  SELECT TOP 1 user_id,username,email FROM Users 
    WHERE username = ${username} 
  `;
  return fixBigInt(result.recordset[0]);
};

export const getUserById = async (id) => {
  const result = await sql.query`
    SELECT user_id, username, email, role FROM Users WHERE user_id = ${id}
  `;
  return result.recordset[0];
};
