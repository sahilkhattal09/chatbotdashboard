// backend/server.ts
import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js"; // use .js even if it's TS due to how ESModules work

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", chatRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
