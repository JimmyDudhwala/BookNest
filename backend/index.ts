import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookiesParser from 'cookie-parser';
import connectDB from './config/dbConnect';
import authRoute from './routes/authRoute'
import productRoute from './routes/productRoute'
import cartRoute from './routes/cartRoute'
import whishListRoute from './routes/whishListRoute'
import addressRoute from './routes/addressRoute'
import userRoute from './routes/userRoute'
import orderRoute from './routes/orderRoute'
import passport from './controllers/strategy/googleStrategy';

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cookiesParser());
const allowedOrigins = [
  'http://localhost:3000',
  'https://book-nest-silk.vercel.app',
  'https://bookknest.info',
];

interface CorsOptions {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
  credentials: boolean;
}

const corsOptions: CorsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(passport.initialize())

connectDB()

// api endpoints

app.use('/api/auth', authRoute)
app.use('/api/products', productRoute)
app.use('/api/cart', cartRoute)
app.use('/api/wishList', whishListRoute)
app.use('/api/user/address', addressRoute)
app.use('/api/user', userRoute)
app.use('/api/order', orderRoute)


app.listen(PORT, () => {
  console.log(`Server is running on port successfully :- ${PORT}`);
});