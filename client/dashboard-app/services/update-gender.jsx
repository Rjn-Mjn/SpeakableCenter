import axios from "axios";

export default async function handleSetGender(gender, accountId) {
  try {
    const resp = await axios.post("https://audiox.space/api/set-gender", {
      AccountID: accountId,
      Gender: gender,
    });

    if (resp.data.success) {
      console.log("Gender updated:", resp.data);
    }
  } catch (err) {
    console.error("Failed to update gender", err);
  }
}
