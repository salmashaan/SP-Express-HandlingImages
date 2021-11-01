const express = require("express");
const router = express.Router();
const upload = require("../../middleware/multer");

const {
  categoryCreate,
  getCategories,
  productCreate,
} = require("./controllers");

router.post("/:categoryId/products", upload.single("image"), productCreate);

router.get("/", getCategories);

router.get("/", categoryCreate);

module.exports = router;
