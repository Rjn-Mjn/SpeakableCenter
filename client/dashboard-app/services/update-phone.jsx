import axios from "axios";

export default async function handleSetPhone(phone, accountId) {
  try {
    const resp = await axios.post("https://audiox.space/api/set-phone", {
      AccountID: accountId,
      PhoneNumber: phone,
    });

    if (resp.data.success) {
      console.log("Phone updated:", resp.data);
    }
  } catch (err) {
    console.error("Failed to update phone", err);
  }
}
