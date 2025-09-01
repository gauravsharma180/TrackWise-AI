const express = require("express");
const authRoutes = require("./auth");
const expenseRoutes = require("./expenses");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/expenses", expenseRoutes);

module.exports = router;
