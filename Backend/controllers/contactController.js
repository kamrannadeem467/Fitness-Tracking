const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');

// 1. Submit Contact Form (Public)
const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Database mein save karein
    const newContact = await Contact.create({ name, email, message });

    // Optional: Admin ko email notification bhejne ke liye (agar set ho)
    try {
      const emailContent = `
        <h2>New Contact Message Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `;
      await sendEmail({
        email: process.env.ADMIN_EMAIL || email, 
        subject: 'New Contact Form Submission - Fitness App',
        message: emailContent,
      });
    } catch (emailErr) {
      console.error("Email notification failed, but message saved:", emailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully! We will get back to you soon.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 2. Get All Contact Messages (Admin Only)
const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: messages.length, messages });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 3. Delete Contact Message (Admin Only)
const deleteMessage = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await message.deleteOne();
    return res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Export mein isay bhi shamil kar lein
module.exports = { submitContactForm, getAllMessages, deleteMessage };