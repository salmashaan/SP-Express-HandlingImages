const Category = require("../../db/models/Category");
const Product = require("../../db/models/Product");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("products");
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};

exports.categoryCreate = async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    return res.status(201).json(newCategory);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.productCreate = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `${req.protocol}://${req.get("host")}/${req.file.path}`;
    }
    const categoryId = req.params.categoryId;
    req.body = { ...req.body, category: categoryId };
    const newProduct = await Product.create(req.body);
    await Category.findOneAndUpdate(
      { _id: req.params.categoryId },
      { $push: { products: newProduct._id } }
    );
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};
