import { sql } from "../utils/db.js";

const fixBigInt = (obj) => {
  if (!obj) return obj;
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? Number(value) : value
    )
  );
};

export const insertGame = async ({
  title,
  description,
  price,
  platform,
  genre,
}) => {
  await sql.query`
    INSERT INTO Games (title, description, price, platform, genre)
    VALUES (${title}, ${description}, ${price}, ${platform}, ${genre})
  `;

  const result = await sql.query`
    SELECT TOP 1 * FROM Games 
    WHERE title = ${title} AND CAST(description AS NVARCHAR(MAX)) = ${description}
    ORDER BY game_id DESC;
  `;

  return fixBigInt(result.recordset[0]); // <-- fixed here
};

export const deleteGame = async (game_id) => {
  // console.log("game_id: ", game_id);
  const results = await sql.query`
    SELECT
      o.game_id,
      o.order_id,
      o.quantity,
      g.price AS price,
      g.price * o.quantity AS total
    FROM
      OrderItems o
    INNER JOIN
      Games g ON g.game_id = o.game_id
    WHERE
      o.game_id = ${game_id}
  `;

  const orders = results.recordset; // small correction: recordset (not recordsets[0])

  for (const order of orders) {
    await sql.query`
    UPDATE Orders
    SET total_amount = total_amount - ${order.total}
    WHERE order_id = ${order.order_id}
  `;
  }
  await sql.query`
  DELETE FROM OrderItems WHERE game_id = ${game_id}
  `;

  const order_id = await sql.query`
  select order_id FROM Orders WHERE total_amount = 0
  `;

  await sql.query`
  DELETE FROM Inventory WHERE game_id = ${game_id}
`;

  for (const order of order_id.recordset) {
    await sql.query`
    DELETE FROM Payments WHERE order_id = ${order.order_id}
  `;
  }

  await sql.query`
  DELETE FROM Orders WHERE total_amount <= 0
  `;

  await sql.query`
    DELETE FROM Games WHERE game_id = ${game_id}
  `;
};

export const updateGame = async ({
  game_id,
  title,
  description,
  price,
  platform,
  genre,
}) => {
  await sql.query`
    UPDATE Games
    SET title = ${title},
        description = ${description},
        price = ${price},
        platform = ${platform},
        genre = ${genre}
    WHERE game_id = ${game_id}
  `;
};

export const getAllGames = async () => {
  const result = await sql.query`SELECT * FROM Games`;
  return result.recordset;
};

export const getGameById = async (game_id) => {
  const result =
    await sql.query`SELECT * FROM Games WHERE game_id = ${game_id}`;
  return result.recordset[0];
};
