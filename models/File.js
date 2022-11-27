const { Schema, model } = require("mongoose");

const fileSchema = new Schema(
  {
    filename: { type: String, required: true },
    extension: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true, max: 1024 * 1024 * 5 },
    createdAt: { type: Date, required: true },
  },
  {
    versionKey: false,
  }
);

module.exports = model("File", fileSchema);
