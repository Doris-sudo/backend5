import express from 'express';
import authenticate from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';

import {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", authenticate, getProducts);

router.post("/", authenticate, authorize("admin"), addProduct);

router.put("/:id", authenticate, authorize("admin"), updateProduct)

router.delete("/:id", authenticate, authorize("admin"), deleteProduct)

export default router