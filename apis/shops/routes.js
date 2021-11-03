const express = require("express");
const router = express.Router();
const upload = require("../../middleware/multer");

const { shopCreate, getShops, productCreate } = require("./controllers");

router.post("/:shopId/products", upload.single("image"), productCreate);

router.get("/", getShops);

router.post("/", shopCreate);

module.exports = router;
