import { users, User } from '../server/models/user';
import { v4 as uuidv4 } from 'uuid';

export default function handler(req, res) {
  const {
    method,
    query: { id },
    body,
  } = req;

  if (method === 'GET') {
    if (id) {
      const user = users.find(u => u.id === id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json(user);
    }
    return res.json(users);
  }

  if (method === 'POST') {
    const { username, name, email, password, roleId, status } = body;
    if (!username || !name || !email || !password || !roleId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    if (users.some(u => u.username === username || u.email === email)) {
      return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }
    const newUser: User = {
      id: uuidv4(),
      username,
      name,
      email,
      password, // In production, hash the password!
      roleId,
      status: status || 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(newUser);
    return res.status(201).json({ success: true, user: newUser });
  }

  if (method === 'PUT') {
    if (!id) return res.status(400).json({ success: false, message: 'Missing user id' });
    const user = users.find(u => u.id === id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const { name, email, password, roleId, status } = body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // In production, hash the password!
    if (roleId) user.roleId = roleId;
    if (status) user.status = status;
    user.updatedAt = new Date();
    return res.json({ success: true, user });
  }

  if (method === 'DELETE') {
    if (!id) return res.status(400).json({ success: false, message: 'Missing user id' });
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'User not found' });
    users.splice(idx, 1);
    return res.json({ success: true, message: 'User deleted' });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
} 