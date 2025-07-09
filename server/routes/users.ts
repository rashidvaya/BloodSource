import { Router } from "express";
import { users, User } from "../models/user";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// List all users
router.get("/api/users", (req, res) => {
  res.json(users);
});

// Get user by ID
router.get("/api/users/:id", (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json(user);
});

// Create user
router.post("/api/users", (req, res) => {
  const { username, name, email, password, roleId, status } = req.body;
  if (!username || !name || !email || !password || !roleId) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  if (users.some(u => u.username === username || u.email === email)) {
    return res.status(400).json({ success: false, message: "Username or email already exists" });
  }
  const newUser: User = {
    id: uuidv4(),
    username,
    name,
    email,
    password, // In production, hash the password!
    roleId,
    status: status || "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  users.push(newUser);
  res.status(201).json({ success: true, user: newUser });
});

// Update user
router.put("/api/users/:id", (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  const { name, email, password, roleId, status } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password; // In production, hash the password!
  if (roleId) user.roleId = roleId;
  if (status) user.status = status;
  user.updatedAt = new Date();
  res.json({ success: true, user });
});

// Delete user
router.delete("/api/users/:id", (req, res) => {
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: "User not found" });
  users.splice(idx, 1);
  res.json({ success: true, message: "User deleted" });
});

export default router; 