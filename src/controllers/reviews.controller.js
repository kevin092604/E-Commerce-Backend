import { prisma } from "../lib/prisma.js";

export const getReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(req.params.productId) },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch {
    res.status(500).json({ message: "Error al obtener reseñas" });
  }
};

export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = parseInt(req.params.productId);
    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ message: "Rating debe ser entre 1 y 5" });

    const existing = await prisma.review.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } },
    });
    if (existing) return res.status(409).json({ message: "Ya dejaste una reseña para este producto" });

    const review = await prisma.review.create({
      data: { userId: req.user.id, productId, rating: parseInt(rating), comment },
      include: { user: { select: { name: true } } },
    });
    res.status(201).json(review);
  } catch {
    res.status(500).json({ message: "Error al crear reseña" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!review) return res.status(404).json({ message: "Reseña no encontrada" });
    if (review.userId !== req.user.id && req.user.role !== "ADMIN")
      return res.status(403).json({ message: "No tienes permiso para eliminar esta reseña" });

    await prisma.review.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Reseña eliminada" });
  } catch {
    res.status(500).json({ message: "Error al eliminar reseña" });
  }
};
