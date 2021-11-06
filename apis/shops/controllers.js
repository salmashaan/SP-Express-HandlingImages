const Shop = require("../../db/models/Shop");
const Product = require("../../db/models/Product");

exports.getShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate("products");
    return res.json(shops);
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

exports.fetchShop = async (shopId, next) => {
  try {
    const shop = await Shop.findById(shopId);
    return shop;
  } catch (error) {
    next(error);
  }
};

exports.shopCreate = async (req, res) => {
  console.log(req.user);
  try {
    if (req.file) {
      req.body.image = `${req.protocol}://${req.get("host")}/${req.file.path}`;
    }
    req.body.owner = req.user._id;
    const newShop = await Shop.create(req.body);
    return res.status(201).json(newShop);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//req.user => from passport jwt
//req.shop => from param middleware
exports.productCreate = async (req, res, next) => {
  // check if the signed in user is the owner of this shop:
  console.log(req.shop._id);
  try {
    if (req.user._id.toString() !== req.shop.owner._id.toString())
      return next({
        status: 401,
        message: "You're not the owner!",
      });
    if (req.file) {
      req.body.image = `${req.protocol}://${req.get("host")}/${req.file.path}`;
    }
    const shopId = req.params.shopId;
    req.body = { ...req.body, shop: shopId };
    const newProduct = await Product.create(req.body);
    await Shop.findOneAndUpdate(
      { _id: req.params.shopId },
      { $push: { products: newProduct._id } }
    );
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};
