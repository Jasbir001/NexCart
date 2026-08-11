const express = require('express');
const router = express.Router();
const { sendEmail } = require('../utils/mailer');
const {
  getOrderPlacedTemplate,
  getOrderShippedTemplate,
  getOrderOutForDeliveryTemplate,
  getOrderDeliveredTemplate,
  getOrderCancelledTemplate,
  getWelcomeEmailTemplate
} = require('../utils/emailTemplates');

// @route   POST /api/email/order-event
// @desc    Send order notification email for specific status events
// @access  Public (or Private)
router.post('/order-event', async (req, res) => {
  try {
    const { event, order, recipientEmail } = req.body;

    if (!order || !order.id) {
      return res.status(400).json({ success: false, message: 'Order object is required' });
    }

    // Recipient email selection (provided email or dummy email if not specified)
    const targetEmail = recipientEmail || (order.address && order.address.email) || 'customer@nexcart.com';

    let subject = `Order #${order.id} Notification - NexCart`;
    let htmlContent = '';

    switch (event) {
      case 'placed':
      case 'Confirmed':
        subject = `🎉 Order #${order.id} Confirmed - NexCart`;
        htmlContent = getOrderPlacedTemplate(order);
        break;

      case 'shipped':
      case 'Shipped':
        subject = `🚚 Order #${order.id} Shipped - NexCart`;
        htmlContent = getOrderShippedTemplate(order);
        break;

      case 'out_for_delivery':
      case 'Out For Delivery':
        subject = `📍 Order #${order.id} Out For Delivery Today - NexCart`;
        htmlContent = getOrderOutForDeliveryTemplate(order);
        break;

      case 'delivered':
      case 'Delivered':
        subject = `🎉 Order #${order.id} Delivered Successfully - NexCart`;
        htmlContent = getOrderDeliveredTemplate(order);
        break;

      case 'cancelled':
      case 'Cancelled':
        subject = `✕ Order #${order.id} Cancellation Notice - NexCart`;
        htmlContent = getOrderCancelledTemplate(order);
        break;

      default:
        subject = `Order #${order.id} Status Update: ${order.status}`;
        htmlContent = getOrderPlacedTemplate(order);
        break;
    }

    const result = await sendEmail({
      to: targetEmail,
      subject,
      html: htmlContent
    });

    if (result.success) {
      return res.json({
        success: true,
        message: `Email notification sent for event "${event}"`,
        previewUrl: result.previewUrl
      });
    } else {
      return res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    console.error('Error in /api/email/order-event:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/email/welcome
// @desc    Send welcome email to new user signup
// @access  Public
router.post('/welcome', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'User email is required' });
    }

    const subject = `Welcome to NexCart, ${name || 'Shopper'}! 🎁`;
    const htmlContent = getWelcomeEmailTemplate(name, email);

    const result = await sendEmail({
      to: email,
      subject,
      html: htmlContent
    });

    if (result.success) {
      return res.json({
        success: true,
        message: 'Welcome email sent successfully',
        previewUrl: result.previewUrl
      });
    }

    return res.status(500).json({ success: false, message: result.error });
  } catch (error) {
    console.error('Error in /api/email/welcome:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
