import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Monto inválido" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // centavos
      currency: "hnl",
      automatic_payment_methods: { enabled: true },
      metadata: { userId: String(req.user.id) },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (e) {
    res.status(500).json({ message: "Error al crear pago", error: e.message });
  }
};
