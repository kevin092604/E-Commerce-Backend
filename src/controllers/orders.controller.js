import { prisma } from "../lib/prisma.js";
import { sendOrderConfirmation } from "../services/email.service.js";

export const createOrder = async (req, res) => {
  try {
    const { items, subtotal, discount, coupon, shipping, giftWrap, giftMessage, total, address, paymentIntentId } = req.body;
    if (!items?.length) return res.status(400).json({ message: "El carrito está vacío" });

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        subtotal, discount: discount ?? 0, coupon,
        shipping, giftWrap: giftWrap ?? false,
        giftMessage: giftWrap ? giftMessage : null,
        total, address,
        ...(paymentIntentId ? { paymentIntentId } : {}),
        items: {
          create: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            ml: item.ml,
          })),
        },
      },
      include: {
        items: { include: { product: { select: { name: true, image: true } } } },
        user: { select: { name: true, email: true } },
      },
    });

    // Send confirmation email (non-blocking)
    sendOrderConfirmation(order, order.user).catch(console.error);

    res.status(201).json(order);
  } catch (e) {
    res.status(500).json({ message: "Error al crear orden", error: e.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { product: { select: { name: true, image: true, brand: true } } },
        },
      },
    });
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Error al obtener órdenes" });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
      include: { items: { include: { product: true } } },
    });
    if (!order) return res.status(404).json({ message: "Orden no encontrada" });
    res.json(order);
  } catch {
    res.status(500).json({ message: "Error al obtener orden" });
  }
};
