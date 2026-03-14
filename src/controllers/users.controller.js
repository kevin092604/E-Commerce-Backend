import { prisma } from "../lib/prisma.js";

export const getWishlist = async (req, res) => {
  try {
    const items = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(items.map((i) => i.product));
  } catch {
    res.status(500).json({ message: "Error al obtener favoritos" });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const productId = parseInt(req.body.productId);
    await prisma.wishlist.upsert({
      where: { userId_productId: { userId: req.user.id, productId } },
      update: {},
      create: { userId: req.user.id, productId },
    });
    res.json({ message: "Agregado a favoritos" });
  } catch {
    res.status(500).json({ message: "Error al agregar a favoritos" });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    await prisma.wishlist.delete({
      where: { userId_productId: { userId: req.user.id, productId: parseInt(req.params.productId) } },
    });
    res.json({ message: "Eliminado de favoritos" });
  } catch {
    res.status(500).json({ message: "Error al eliminar de favoritos" });
  }
};
