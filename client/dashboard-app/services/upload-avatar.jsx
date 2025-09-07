import axios from "axios";

export default async function uploadAvatar(file, AccountID) {
  if (!file) {
    console.warn("No avatar selected!");
    return "";
  }

  try {
    const formData = new FormData();
    formData.append("avatar", file);
    // nếu server cần userId thì append thêm
    formData.append("AccountID", AccountID);

    const resp = await axios.post(
      "https://audiox.space/api/upload-avatar",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (resp.data?.url) {
      console.log("Avatar uploaded:", resp.data.url);
      return resp.data.url;

      // 👉 đây bạn có thể setState hoặc lưu DB tuỳ logic
      // setUser((prev) => ({ ...prev, avatarLink: resp.data.url }));
    }
  } catch (err) {
    console.error("Upload failed:", err.response?.data || err.message);
  }
}
