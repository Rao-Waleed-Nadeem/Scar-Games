import express from "express";
import {
  signup,
  login,
  logout,
  currentUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/current", currentUser);

export default router;
