import { transporter } from "../lib/mailer.js";

export const sendOrderConfirmation = async (order, user) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;

  const itemsRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 8px;border-bottom:1px solid #f3f4f6;font-size:14px;">
          ${item.product?.name || "Producto"}
        </td>
        <td style="padding:10px 8px;border-bottom:1px solid #f3f4f6;font-size:14px;color:#6b7280;">
          ${item.ml}ml × ${item.quantity}
        </td>
        <td style="padding:10px 8px;border-bottom:1px solid #f3f4f6;font-size:14px;font-weight:bold;text-align:right;">
          L ${Math.round(item.price * item.quantity).toLocaleString("es-HN")}
        </td>
      </tr>`
    )
    .join("");

  const discountRow =
    order.discount > 0
      ? `<div style="display:flex;justify-content:space-between;color:#059669;">
           <span>Descuento ${order.coupon ? `(${order.coupon})` : ""}</span>
           <span>-L ${Math.round(order.discount).toLocaleString("es-HN")}</span>
         </div>`
      : "";

  const shippingText =
    order.shipping === 0 ? "Gratis" : `L ${Math.round(order.shipping).toLocaleString("es-HN")}`;

  const address = order.address || {};
  const addressLine = [address.address, address.city].filter(Boolean).join(", ");

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#111827;padding:28px 32px;text-align:center;">
              <p style="margin:0;font-size:24px;font-weight:bold;letter-spacing:6px;color:#F59E0B;">
                ELITE <span style="color:#ffffff;">PARFUMS</span>
              </p>
              <p style="margin:8px 0 0;color:#9ca3af;font-size:13px;">
                Confirmación de pedido
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h2 style="margin:0 0 8px;font-size:22px;color:#111827;">¡Pedido confirmado! 🎉</h2>
              <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">
                Hola <strong>${user.name}</strong>, tu pedido ha sido recibido y está siendo procesado.
              </p>

              <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:12px 16px;margin-bottom:24px;">
                <p style="margin:0;font-size:12px;color:#92400e;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">
                  Número de pedido
                </p>
                <p style="margin:4px 0 0;font-size:20px;font-weight:bold;color:#b45309;font-family:monospace;">
                  #${order.id}
                </p>
              </div>

              <!-- Items -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <thead>
                  <tr style="border-bottom:2px solid #f3f4f6;">
                    <th style="text-align:left;padding:8px;font-size:11px;text-transform:uppercase;color:#9ca3af;font-weight:600;">Producto</th>
                    <th style="text-align:left;padding:8px;font-size:11px;text-transform:uppercase;color:#9ca3af;font-weight:600;">Cant.</th>
                    <th style="text-align:right;padding:8px;font-size:11px;text-transform:uppercase;color:#9ca3af;font-weight:600;">Precio</th>
                  </tr>
                </thead>
                <tbody>${itemsRows}</tbody>
              </table>

              <!-- Totals -->
              <div style="background:#f9fafb;border-radius:8px;padding:16px;margin-bottom:24px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                  <span style="color:#6b7280;font-size:14px;">Subtotal</span>
                  <span style="font-size:14px;">L ${Math.round(order.subtotal).toLocaleString("es-HN")}</span>
                </div>
                ${discountRow}
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                  <span style="color:#6b7280;font-size:14px;">Envío</span>
                  <span style="font-size:14px;">${shippingText}</span>
                </div>
                <div style="display:flex;justify-content:space-between;border-top:2px solid #e5e7eb;margin-top:10px;padding-top:10px;">
                  <span style="font-weight:bold;font-size:16px;">Total</span>
                  <span style="font-weight:bold;font-size:16px;color:#111827;">L ${Math.round(order.total).toLocaleString("es-HN")}</span>
                </div>
              </div>

              <!-- Address & delivery -->
              <div style="font-size:13px;color:#6b7280;line-height:1.8;">
                ${addressLine ? `<p style="margin:0;">📍 ${addressLine}</p>` : ""}
                <p style="margin:0;">📦 Entrega estimada: 3–6 días hábiles</p>
                <p style="margin:0;">📧 ${user.email}</p>
              </div>

              ${
                order.giftWrap && order.giftMessage
                  ? `<div style="margin-top:20px;background:#fdf2f8;border:1px solid #fbcfe8;border-radius:8px;padding:12px 16px;">
                       <p style="margin:0 0 4px;font-size:12px;font-weight:bold;color:#be185d;">🎁 Mensaje de regalo</p>
                       <p style="margin:0;font-style:italic;color:#6b7280;font-size:13px;">"${order.giftMessage}"</p>
                     </div>`
                  : ""
              }
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#111827;padding:20px 32px;text-align:center;">
              <p style="margin:0;color:#6b7280;font-size:12px;">
                Elite Parfums Honduras · Por favor no respondas a este correo
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Elite Parfums" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: `Pedido confirmado #${order.id} — Elite Parfums`,
    html,
  });
};
