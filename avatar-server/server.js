const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 5001;

// CORS: chỉ cho phép server chính gọi
app.use(
  cors({
    origin: ["*"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    // origin: ["https://audiox.space", "http://192.168.1.26:5173/dashboard/"],
  })
);

// Folder lưu avatar
const uploadFolder = path.join(__dirname, "uploads/avatars");
if (!fs.existsSync(uploadFolder))
  fs.mkdirSync(uploadFolder, { recursive: true });

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // lấy đuôi file
    const uniqueName = Date.now() + "-" + req.body.AccountID + ext; // tên file duy nhất
    cb(null, uniqueName);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // giới hạn 5MB
});

// Route upload avatar
app.post("/api/upload-avatar", upload.single("avatar"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const fileUrl = `http://27.75.93.31:${PORT}/avatars/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// Public folder để client có thể xem ảnh
app.use("/avatars", express.static(uploadFolder));

app.listen(PORT, () => {
  console.log(`Avatar server running on http://localhost:${PORT}`);
});
