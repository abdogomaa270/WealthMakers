const mongoose = require("mongoose");

const storeCouponSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Coupon name required"],
      unique: true,
      uppercase: true,
    },
    expire: {
      type: Date,
      required: [true, "Coupon expire time required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon expire value required"],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
storeCouponSchema.pre(/^find/, function (next) {
  this.populate({ path: "creator", select: "name email" })
  next();
});
module.exports = mongoose.model("StoreCoupon", storeCouponSchema);
