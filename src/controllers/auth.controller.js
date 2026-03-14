import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

const safeUser = (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone });

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Nombre, email y contraseña son requeridos" });

    if (await prisma.user.findUnique({ where: { email } }))
      return res.status(409).json({ message: "El email ya está registrado" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashed, phone } });
    res.status(201).json({ token: generateToken(user), user: safeUser(user) });
  } catch {
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Credenciales incorrectas" });

    res.json({ token: generateToken(user), user: safeUser(user) });
  } catch {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

export const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });
    res.json(user);
  } catch {
    res.status(500).json({ message: "Error al obtener perfil" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    const data = {};
    if (name) data.name = name;
    if (phone) data.phone = phone;
    if (password) data.password = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({ where: { id: req.user.id }, data });
    res.json(safeUser(user));
  } catch {
    res.status(500).json({ message: "Error al actualizar perfil" });
  }
};
