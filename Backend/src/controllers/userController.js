import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import {
  findUserByEmail,
  createUser,
  getUserById,
  findUserByUsername,
} from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const finalRole = role || "Customer";

    const hashedPassword = await bcrypt.hash(password, 10);

    // SQL Server generates user_id automatically
    const newUser = await createUser({
      username,
      email,
      password: hashedPassword,
      role: finalRole,
    });

    // req.session.user = {
    //   user_id: newUser.user_id,
    //   username: newUser.username,
    //   email: newUser.email,
    //   role: newUser.role,
    // };

    const accessToken = jwt.sign(
      {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    console.log("Login request body:", req.body);

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Email/Username and password are required" });
    }

    var user = await findUserByEmail(identifier);
    if (!user) {
      user = await findUserByUsername(identifier);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "6h",
      },
    );

    // Save userId in session
    // req.session.userId = user.user_id;

    // console.log("user: ", user);

    res.json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken: token,
    });

    // res.json({ token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// export const logout = (req, res) => {
//   // req.session.destroy((err) => {
//   //   if (err) {
//   //     console.error("Logout Error:", err);
//   //     return res.status(500).json({ message: "Failed to logout" });
//   //   }
//   //   res.clearCookie("connect.sid"); // Make sure cookie name matches your session setup
//   //   res.json({ message: "Logged out successfully" });
//   // });
//   if (req.session) {
//     req.session.destroy((err) => {
//       if (err) {
//         console.error("Logout Error:", err);
//         res.status(500).json({ error: "Logout failed" });
//       } else {
//         res.clearCookie("connect.sid"); // Clear the cookie
//         res.json({ message: "Logged out successfully" });
//       }
//     });
//   } else {
//     res.status(400).json({ error: "No active session" });
//   }
// };

export const logout = (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout Error:", err);
        res.status(500).json({ error: "Logout failed" });
      } else {
        res.clearCookie("connect.sid"); // Clear session cookie
        res.json({ message: "Logged out successfully" });
      }
    });
  } else {
    res.status(400).json({ error: "No active session" });
  }
};

export const currentUser = async (req, res) => {
  try {
    if (!req.user.userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const user = await getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get Current User Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// app.get("/api/profile", verifyToken, async (req, res) => {
//   res.json({ message: `Welcome, user ${req.user.email}` });
// });

// function verifyToken(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader?.split(" ")[1];
//   if (!token) return res.status(401).json({ error: "Access denied" });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ error: "Invalid token" });
//   }
// }
