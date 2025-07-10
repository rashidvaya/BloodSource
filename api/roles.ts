import { roles, Role } from '../server/models/role';
import { v4 as uuidv4 } from 'uuid';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const {
    method,
    query: { id },
    body,
  } = req;

  if (method === 'GET') {
    return res.json(roles);
  }

  if (method === 'POST') {
    const { name, permissions } = body;
    if (!name || !Array.isArray(permissions)) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    if (roles.some(r => r.name === name)) {
      return res.status(400).json({ success: false, message: 'Role name already exists' });
    }
    const newRole: Role = {
      id: uuidv4(),
      name,
      permissions,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    roles.push(newRole);
    return res.status(201).json({ success: true, role: newRole });
  }

  if (method === 'PUT') {
    if (!id) return res.status(400).json({ success: false, message: 'Missing role id' });
    const role = roles.find(r => r.id === id);
    if (!role) return res.status(404).json({ success: false, message: 'Role not found' });
    const { name, permissions } = body;
    if (name) role.name = name;
    if (permissions) role.permissions = permissions;
    role.updatedAt = new Date();
    return res.json({ success: true, role });
  }

  if (method === 'DELETE') {
    if (!id) return res.status(400).json({ success: false, message: 'Missing role id' });
    const idx = roles.findIndex(r => r.id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Role not found' });
    roles.splice(idx, 1);
    return res.json({ success: true, message: 'Role deleted' });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
} 