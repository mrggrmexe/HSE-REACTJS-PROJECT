import { Router } from "express";

export const supportRouter = Router();

supportRouter.post("/support", (req, res) => {
  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const ticketId = `T-${Date.now().toString(36).toUpperCase()}`;
  return res.status(201).json({
    ok: true,
    ticketId,
    createdAt: new Date().toISOString(),
  });
});
