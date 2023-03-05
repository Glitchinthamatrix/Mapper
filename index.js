import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import entityRoutes from "./routes/entity.js";
import entityModelRoutes from "./routes/entityModel.js";
import userRoutes from "./routes/user.js";
import { nullifyPseudoNull } from "./utils/validation.js";

dotenv.config();
mongoose.set("strictQuery", false);
const app = express();
const PORT = process.env.PORT || 9000;
const clientURL = "http://localhost:3000";
const corsOptions = {
  origin: function(origin, callback) {
    if (origin === clientURL) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());
app.use((req, _, next) => {
  nullifyPseudoNull(req.body);
  next();
});

app.use("/auth", authRoutes);
// TODO: fix the order of routes
app.use("/entities/models", entityModelRoutes);
app.use("/entities", entityRoutes);
app.use("/users", userRoutes);

(async() => {
  while (true){
    try {
      // eslint-disable-next-line max-len
      await mongoose.connect(`mongodb+srv://nitesh:${process.env.MONGO_DB_PASSWORD}@cluster0.z0byrzc.mongodb.net/?retryWrites=true&w=majority`);
      // eslint-disable-next-line no-console
      console.log("mongodb connection establised");
      break;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log("Failed to connect to MongoDB: ", err.message);
      // Try to connect again in 2 seconds
      await new Promise((resolve) => setTimeout(() => resolve(), 2000));
    }
  }
})();

app.listen(PORT, (err) => {
  if (err){
    // eslint-disable-next-line no-console
    console.log(err);
    return;
  }
  // eslint-disable-next-line no-console
  console.log(`server listening on port ${PORT}`);
});
