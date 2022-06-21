const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema(
  {
    home_address: { type: String, default: "" },

    land_mark: { type: String, default: "" },
    city: { type: String, default: "" },
    country: { type: String, default: "" },
    passport_photo: { type: String, default: "" },
    photo_id: { type: String, default: "" },

    owner: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Kyc = mongoose.model("KYC", kycSchema);

module.exports = Kyc;
