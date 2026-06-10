const { model } = require("mongoose");

const { HoldingsSchema } = require("../schemas/HoldingsSchema");

const HoldModel = new model("holding", HoldingsSchema);

module.exports = { HoldModel };
