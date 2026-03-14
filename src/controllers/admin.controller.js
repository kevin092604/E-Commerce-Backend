import { prisma } from "../lib/prisma.js";

export const getStats = async (req, res) => {
  try {
    const [totalOrders, revenueAgg, totalUsers, totalProducts, ordersByStatus, topItems, recentOrders] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.aggregate({ _sum: { total: true } }),
        prisma.user.count(),
        prisma.product.count({ where: { active: true } }),
        prisma.order.groupBy({ by: ["status"], _count: { id: true } }),
        prisma.orderItem.groupBy({
          by: ["productId"],
          _sum: { quantity: true },
          orderBy: { _sum: { quantity: "desc" } },
          take: 5,
        }),
        prisma.order.findMany({
          take: 8,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { name: true, email: true } } },
        }),
      ]);

    const topProductIds = topItems.map((i) => i.productId);
    const topProducts = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true, brand: true, image: true, price: true },
    });

    res.json({
      totalOrders,
      totalRevenue: revenueAgg._sum.total ?? 0,
      totalUsers,
      totalProducts,
      ordersByStatus: ordersByStatus.reduce((acc, s) => ({ ...acc, [s.status]: s._count.id }), {}),
      topProducts: topItems.map((item) => ({
        ...item,
        product: topProducts.find((p) => p.id === item.productId),
      })),
      recentOrders,
    });
  } catch (e) {
    res.status(500).json({ message: "Error al obtener estadísticas", error: e.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = status ? { status } : {};
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: { select: { name: true, image: true } } } },
        },
      }),
      prisma.order.count({ where }),
    ]);
    res.json({ orders, total, pages: Math.ceil(total / parseInt(limit)) });
  } catch {
    res.status(500).json({ message: "Error al obtener órdenes" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    });
    res.json(order);
  } catch {
    res.status(500).json({ message: "Error al actualizar estado" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true, _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(user);
  } catch {
    res.status(500).json({ message: "Error al actualizar rol" });
  }
};
