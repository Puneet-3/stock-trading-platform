const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
  requestId: { type: String, required: true },
  name: { type: String, required: true },
  qty: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
  price: {
    type: Number,
    required: true,
    min: 1,
    validate: Number.isSafeInteger,
  },
  mode: { type: String, enum: ["BUY", "SELL"], required: true },
  realizedPnl: { type: Number, default: 0, validate: Number.isSafeInteger },
  createdAt: { type: Date, default: Date.now },
});

module.exports = { OrdersSchema };
