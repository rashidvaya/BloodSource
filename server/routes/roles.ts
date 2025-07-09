import { Router } from "express";
import { roles, Role } from "../models/role";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// List all roles
router.get("/api/roles", (req, res) => {
  res.json(roles);
});

// Create role
router.post("/api/roles", (req, res) => {
  const { name, permissions } = req.body;
  if (!name || !Array.isArray(permissions)) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  if (roles.some(r => r.name === name)) {
    return res.status(400).json({ success: false, message: "Role name already exists" });
  }
  const newRole: Role = {
    id: uuidv4(),
    name,
    permissions,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  roles.push(newRole);
  res.status(201).json({ success: true, role: newRole });
});

// Update role
router.put("/api/roles/:id", (req, res) => {
  const role = roles.find(r => r.id === req.params.id);
  if (!role) return res.status(404).json({ success: false, message: "Role not found" });
  const { name, permissions } = req.body;
  if (name) role.name = name;
  if (permissions) role.permissions = permissions;
  role.updatedAt = new Date();
  res.json({ success: true, role });
});

// Delete role
router.delete("/api/roles/:id", (req, res) => {
  const idx = roles.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Role not found" });
  roles.splice(idx, 1);
  res.json({ success: true, message: "Role deleted" });
});

export default router; 