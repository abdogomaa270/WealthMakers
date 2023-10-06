const mongoose = require("mongoose");

const storeCartStoreSchema = mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "StoreProduct",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
      },
    ],
    totalCartprice: Number,
    coupon: String,
    totalCartpriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// ^find => it mean if part of of teh word contains find

storeCartStoreSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name -_id",
  });
  this.populate({
    path: "cartItems.product",
    populate: "title imageCover category",
  });
  next();
});

module.exports = mongoose.model("StoreCart", storeCartStoreSchema);
