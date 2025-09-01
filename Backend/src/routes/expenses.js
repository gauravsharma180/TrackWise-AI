const express = require("express");
const Joi = require("joi");
const { verifyToken } = require("../middleware/auth");
const { addExpense, getExpenses } = require("../utils/db");

const router = express.Router();

const expenseSchema = Joi.object({
  description: Joi.string().min(3).required(),
  amount: Joi.number().positive().required()
});

// Add expense
router.post("/", verifyToken, async (req, res) => {
  try {
    const { error } = expenseSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { description, amount } = req.body;
    await addExpense(req.user.email, { description, amount });

    res.status(201).json({ message: "Expense added" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// Get expenses
router.get("/", verifyToken, async (req, res) => {
  try {
    const expenses = await getExpenses(req.user.email);
    res.json({ expenses });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
