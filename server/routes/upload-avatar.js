// service/upload-avatar.js
const multer = require("multer");
const FormData = require("form-data");
const axios = require("axios");

const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("avatar");

// middleware express để handle upload + forward
function uploadAvatarHandler(req, res, next) {
  memoryUpload(req, res, async function (err) {
    if (err) return res.status(400).json({ error: err.message });

    if (!req.file) return res.status(400).json({ error: "No file" });

    try {
      // build FormData to forward
      const form = new FormData();
      // append buffer with filename
      form.append("avatar", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });
      // pass AccountID (đảm bảo req.AccountID có sẵn hoặc từ body)
      const AccountID = req.body.AccountID || req.user?.id;
      form.append("AccountID", AccountID ?? "");

      // nếu cần auth tới avatar-server, thêm header Authorization
      const avatarServerUrl = "http://27.75.93.31:5001/upload";

      const resp = await axios.post(avatarServerUrl, form, {
        headers: {
          ...form.getHeaders(),
          // 'Authorization': `Bearer ${process.env.AVATAR_SERVER_KEY}`
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      const avatarUrl = resp.data.url;
      if (!avatarUrl) throw new Error("No url from avatar-server");

      // Lưu avatarUrl vào DB - tùy DB của tui
      // Ví dụ dùng mssql / mysql / pg: gọi function updateAccountAvatar(AccountID, avatarUrl)
      // await db.updateAvatar(AccountID, avatarUrl);

      // Trả về cho client
      return res.json({ ok: true, url: avatarUrl });
    } catch (error) {
      console.error("Forward error:", error?.response?.data || error.message);
      return res
        .status(500)
        .json({ error: "Upload failed", detail: error.message });
    }
  });
}

module.exports = { uploadAvatarHandler };
