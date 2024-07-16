import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import blogRouter from './routes/blog-routes.js';
import router from './routes/user-routes.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();



app.use(cors({
  origin: 'https://blogtube-luoc.vercel.app/', // Your frontend URL in production
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(express.json({ limit: "1000kb" }));
app.use("/api/user", router);
app.use("/api/blog", blogRouter);

// Serve static files from the React app
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'build')));

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Connected to Database and Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({
    message: "404 Not Found",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
  });
});
