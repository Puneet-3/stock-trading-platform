const { Schema } = require("mongoose");

const HoldingsSchema = new Schema(
  {
    name: { type: String, required: true },
    qty: {
      type: Number,
      required: true,
      min: 1,
      validate: Number.isSafeInteger,
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
      validate: Number.isSafeInteger,
    },
  },
  { _id: false },
);

module.exports = { HoldingsSchema };
