const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString('en-IN')}`;

const buildItemsRows = (items = []) => {
  if (!items.length) {
    return `<tr><td colspan="3" style="padding:12px;color:#666;">No items listed</td></tr>`;
  }

  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #eee;">${item.product?.name || 'Product'}</td>
          <td style="padding:12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity || 1}</td>
          <td style="padding:12px;border-bottom:1px solid #eee;text-align:right;">${formatCurrency((item.product?.price || 0) * (item.quantity || 1))}</td>
        </tr>`
    )
    .join('');
};

const buildAddressBlock = (address) => {
  if (!address) return '<p style="color:#666;">Address not available</p>';

  return `
    <p style="margin:0 0 4px;font-weight:600;">${address.fullName || 'Customer'}</p>
    <p style="margin:0 0 4px;color:#555;">${address.addressLine || ''}</p>
    <p style="margin:0 0 4px;color:#555;">${address.city || ''}, ${address.state || ''} ${address.pinCode || ''}</p>
    <p style="margin:0;color:#555;">${address.phone || ''}</p>`;
};

const baseTemplate = ({ title, headline, body, order, ctaText, ctaUrl }) => {
  const addr = order?.address;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;">
          <tr>
            <td style="background:#18181b;color:#ffffff;padding:24px 32px;">
              <h1 style="margin:0;font-size:24px;">NexCart</h1>
              <p style="margin:8px 0 0;color:#a1a1aa;">${headline}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${body}
              ${
                order
                  ? `
              <div style="margin-top:24px;padding:16px;background:#fafafa;border-radius:8px;">
                <p style="margin:0 0 8px;font-size:14px;color:#71717a;">Order ID</p>
                <p style="margin:0 0 16px;font-size:18px;font-weight:700;">#${order.id}</p>
                <p style="margin:0 0 8px;font-size:14px;color:#71717a;">Order Date</p>
                <p style="margin:0 0 16px;">${order.date || new Date().toISOString().split('T')[0]}</p>
                <p style="margin:0 0 8px;font-size:14px;color:#71717a;">Payment</p>
                <p style="margin:0 0 16px;">${order.paymentMethod || 'N/A'}</p>
              </div>
              <h3 style="margin:24px 0 12px;font-size:16px;">Order Items</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
                <thead>
                  <tr style="background:#f4f4f5;">
                    <th style="padding:12px;text-align:left;">Item</th>
                    <th style="padding:12px;text-align:center;">Qty</th>
                    <th style="padding:12px;text-align:right;">Price</th>
                  </tr>
                </thead>
                <tbody>${buildItemsRows(order.items)}</tbody>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;font-size:14px;">
                <tr><td style="padding:4px 0;color:#71717a;">Subtotal</td><td style="padding:4px 0;text-align:right;">${formatCurrency(order.subtotal)}</td></tr>
                <tr><td style="padding:4px 0;color:#71717a;">GST</td><td style="padding:4px 0;text-align:right;">${formatCurrency(order.gst)}</td></tr>
                <tr><td style="padding:4px 0;color:#71717a;">Delivery</td><td style="padding:4px 0;text-align:right;">${formatCurrency(order.deliveryCharge)}</td></tr>
                <tr><td style="padding:8px 0;font-weight:700;">Grand Total</td><td style="padding:8px 0;text-align:right;font-weight:700;">${formatCurrency(order.grandTotal)}</td></tr>
              </table>
              <h3 style="margin:24px 0 12px;font-size:16px;">Delivery Address</h3>
              ${buildAddressBlock(addr)}`
                  : ''
              }
              ${
                ctaText && ctaUrl
                  ? `<p style="margin-top:28px;text-align:center;">
                <a href="${ctaUrl}" style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">${ctaText}</a>
              </p>`
                  : ''
              }
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background:#fafafa;text-align:center;color:#71717a;font-size:12px;">
              <p style="margin:0;">Thank you for shopping with NexCart.</p>
              <p style="margin:8px 0 0;">Need help? Reply to this email or visit our support center.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const getOrderPlacedTemplate = (order) =>
  baseTemplate({
    title: `Order #${order.id} Confirmed`,
    headline: 'Your order has been confirmed!',
    body: `<p style="margin:0 0 12px;font-size:16px;line-height:1.6;">Hi ${order.address?.fullName || 'there'},</p>
           <p style="margin:0;font-size:16px;line-height:1.6;">Thank you for your order. We are preparing your items and will notify you when they ship.</p>`,
    order,
    ctaText: 'View Your Orders',
    ctaUrl: 'http://localhost:3000/orders'
  });

const getOrderShippedTemplate = (order) =>
  baseTemplate({
    title: `Order #${order.id} Shipped`,
    headline: 'Your order is on the way!',
    body: `<p style="margin:0 0 12px;font-size:16px;line-height:1.6;">Hi ${order.address?.fullName || 'there'},</p>
           <p style="margin:0;font-size:16px;line-height:1.6;">Great news — your order has been shipped and is heading to you. Track your delivery from your account.</p>`,
    order,
    ctaText: 'Track Order',
    ctaUrl: 'http://localhost:3000/orders'
  });

const getOrderOutForDeliveryTemplate = (order) =>
  baseTemplate({
    title: `Order #${order.id} Out For Delivery`,
    headline: 'Arriving today!',
    body: `<p style="margin:0 0 12px;font-size:16px;line-height:1.6;">Hi ${order.address?.fullName || 'there'},</p>
           <p style="margin:0;font-size:16px;line-height:1.6;">Your order is out for delivery today. Please keep your phone handy for delivery updates.</p>`,
    order,
    ctaText: 'View Order Details',
    ctaUrl: 'http://localhost:3000/orders'
  });

const getOrderDeliveredTemplate = (order) =>
  baseTemplate({
    title: `Order #${order.id} Delivered`,
    headline: 'Delivered successfully!',
    body: `<p style="margin:0 0 12px;font-size:16px;line-height:1.6;">Hi ${order.address?.fullName || 'there'},</p>
           <p style="margin:0;font-size:16px;line-height:1.6;">Your order has been delivered. We hope you love your purchase! Share your feedback to help other shoppers.</p>`,
    order,
    ctaText: 'Shop Again',
    ctaUrl: 'http://localhost:3000'
  });

const getOrderCancelledTemplate = (order) =>
  baseTemplate({
    title: `Order #${order.id} Cancelled`,
    headline: 'Order cancellation notice',
    body: `<p style="margin:0 0 12px;font-size:16px;line-height:1.6;">Hi ${order.address?.fullName || 'there'},</p>
           <p style="margin:0;font-size:16px;line-height:1.6;">Your order has been cancelled as requested. If a payment was captured, your refund will be processed within 5–7 business days.</p>`,
    order,
    ctaText: 'Continue Shopping',
    ctaUrl: 'http://localhost:3000'
  });

const getWelcomeEmailTemplate = (name, email) =>
  baseTemplate({
    title: 'Welcome to NexCart',
    headline: `Welcome, ${name || 'Shopper'}!`,
    body: `<p style="margin:0 0 12px;font-size:16px;line-height:1.6;">Hi ${name || 'there'},</p>
           <p style="margin:0 0 12px;font-size:16px;line-height:1.6;">Your NexCart account (${email}) is ready. Explore top deals, track orders, and save items to your wishlist.</p>
           <p style="margin:0;font-size:16px;line-height:1.6;">Happy shopping!</p>`,
    order: null,
    ctaText: 'Start Shopping',
    ctaUrl: 'http://localhost:3000'
  });

module.exports = {
  getOrderPlacedTemplate,
  getOrderShippedTemplate,
  getOrderOutForDeliveryTemplate,
  getOrderDeliveredTemplate,
  getOrderCancelledTemplate,
  getWelcomeEmailTemplate
};
