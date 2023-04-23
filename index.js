const express = require("express");
const PORT = 8000;
const app = express();
const { db } = require("./database/index");
const cors = require("cors");
const {
  userRouter,
  productRouter,
  categoryRouter,
} = require(`./routers/index`);

app.use(express.json()); //kalau ga ada ini ga bisa req.body cuy!
app.use(cors());

app.use(`/user`, userRouter);
app.use(`/product`, productRouter);
app.use(`/category`, categoryRouter);

app.listen(PORT, (error) => {
  console.log(`Server is running on PORT + ${PORT}`);
});
