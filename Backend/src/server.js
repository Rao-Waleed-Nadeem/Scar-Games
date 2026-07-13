import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// import session from "express-session";
// import MSSQLStore from "connect-mssql-v2";
import { connectDB, sql } from "./utils/db.js";
import gamesRoutes from "./routes/gameRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // Optional if you handle login
import orderItemsRoutes from "./routes/orderItemRoutes.js";
import paymentsRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// console.log("Server.js printing before connecting db");
// console.log(process.env);

// CORS setup for frontend communication
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5174",
    ],
    credentials: true,
  }),
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // Session configuration
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "super-secret-key",
//     resave: false,
//     saveUninitialized: false,
//     store: new MSSQLStore({
//       ttl: 3600,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       server: process.env.DB_SERVER,
//       database: process.env.DB_DATABASE,
//       options: {
//         encrypt: false,
//         enableArithAbort: true,
//       },
//       table: "sessions",
//     }),
//     cookie: {
//       httpOnly: true,
//       secure: false, // Set to true if using HTTPS
//       maxAge: 1000 * 60 * 60, // 1 hour
//     },
//   }),
// );

// console.log("Server.js printing before connecting db");

// console.log({
//   DB_USER: process.env.DB_USER,
//   DB_PASSWORD: process.env.DB_PASSWORD,
//   DB_SERVER: process.env.DB_SERVER,
//   DB_DATABASE: process.env.DB_DATABASE,
//   DB_PORT: process.env.DB_PORT,
// });

// Connect DB
connectDB();

// Routes

app.use("/api/v1/games", gamesRoutes);

app.use("/api/v1/users", userRoutes); // For login/logout routes

app.use("/api/v1/orders", orderRoutes);

app.use("/api/v1/inventory", inventoryRoutes);

app.use("/api/v1/orderitem", orderItemsRoutes);

app.use("/api/v1/payment", paymentsRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Game Store API!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
