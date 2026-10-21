const { Schema, model } = require("mongoose");
const { HoldingsSchema } = require("../schemas/HoldingsSchema");
const { OrdersSchema } = require("../schemas/OrdersSchema");

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, select: false },
    authVersion: { type: Number, default: 0 },
    cash: {
      type: Number,
      default: 10000000,
      min: 0,
      validate: Number.isSafeInteger,
    },
    holdings: { type: [HoldingsSchema], default: [] },
    orders: { type: [OrdersSchema], default: [] },
    transfers: [
      {
        requestId: { type: String, required: true },
        amount: {
          type: Number,
          required: true,
          min: 1,
          validate: Number.isSafeInteger,
        },
        mode: { type: String, enum: ["DEPOSIT", "WITHDRAW"], required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true, optimisticConcurrency: true },
);

module.exports = model("User", userSchema);
