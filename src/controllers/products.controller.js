import { prisma } from "../lib/prisma.js";
import { uploadToCloudinary } from "../middleware/upload.js";

const withRating = (products) =>
  products.map((p) => {
    const avg = p.reviews?.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0;
    return { ...p, avgRating: parseFloat(avg.toFixed(1)), reviewCount: p.reviews?.length ?? 0, reviews: undefined };
  });

export const getProducts = async (req, res) => {
  try {
    const { cat, q, brand, type, minPrice, maxPrice, onlyOffers, page = 1, limit = 40, sort = "default" } = req.query;

    const where = { active: true };
    if (cat && cat !== "todos") where.category = cat;
    if (brand) where.brand = { in: brand.split(",") };
    if (type) where.type = { in: type.split(",") };
    if (onlyOffers === "true") where.NOT = { originalPrice: null };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { brand: { contains: q, mode: "insensitive" } }];

    const orderBy =
      sort === "price-asc" ? { price: "asc" }
      : sort === "price-desc" ? { price: "desc" }
      : sort === "name" ? { name: "asc" }
      : { createdAt: "desc" };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip, take: parseInt(limit), include: { reviews: { select: { rating: true } } } }),
      prisma.product.count({ where }),
    ]);

    res.json({ products: withRating(items), total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (e) {
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await prisma.product.findFirst({
      where: { id: parseInt(req.params.id), active: true },
      include: { reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } } },
    });
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch {
    res.status(500).json({ message: "Error al obtener producto" });
  }
};

export const createProduct = async (req, res) => {
  try {
    let image = req.body.image;
    if (req.file) image = await uploadToCloudinary(req.file.buffer);

    const { name, brand, price, originalPrice, category, ml, type, description, badge, stock, notes } = req.body;
    const product = await prisma.product.create({
      data: {
        name, brand, price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        category, ml: parseInt(ml), type, description, image,
        badge: badge || null,
        stock: parseInt(stock ?? 100),
        notes: typeof notes === "string" ? JSON.parse(notes) : notes,
      },
    });
    res.status(201).json(product);
  } catch (e) {
    res.status(500).json({ message: "Error al crear producto", error: e.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const data = {};
    const fields = ["name", "brand", "category", "type", "description", "badge"];
    fields.forEach((f) => { if (req.body[f] !== undefined) data[f] = req.body[f]; });
    if (req.body.price !== undefined) data.price = parseFloat(req.body.price);
    if (req.body.originalPrice !== undefined) data.originalPrice = req.body.originalPrice ? parseFloat(req.body.originalPrice) : null;
    if (req.body.ml !== undefined) data.ml = parseInt(req.body.ml);
    if (req.body.stock !== undefined) data.stock = parseInt(req.body.stock);
    if (req.body.active !== undefined) data.active = req.body.active === "true" || req.body.active === true;
    if (req.body.notes !== undefined) data.notes = typeof req.body.notes === "string" ? JSON.parse(req.body.notes) : req.body.notes;
    if (req.file) data.image = await uploadToCloudinary(req.file.buffer);
    else if (req.body.image) data.image = req.body.image;

    const product = await prisma.product.update({ where: { id: parseInt(req.params.id) }, data });
    res.json(product);
  } catch {
    res.status(500).json({ message: "Error al actualizar producto" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await prisma.product.update({ where: { id: parseInt(req.params.id) }, data: { active: false } });
    res.json({ message: "Producto desactivado" });
  } catch {
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};
