import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import errorHandler from './middleware/errorMiddleware.js'

const app = express();

app.use(helmet());

app.use(express.json());

app.use(morgan("dev"));

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, 
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }

});

app.use(generalLimiter);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too auhentication attempts. Please try again later."
    }
});

app.get("/", (req, res)=>{
    res.status(200).json({
        success: true,
        message: "Backend API is running..."
    });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", productRoutes);

app.use((req, res)=>{
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.use(errorHandler);

export default app
