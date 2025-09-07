import axios from "axios";

export default async function handleSetDOB(dob, accountId) {
  try {
    const resp = await axios.post("https://audiox.space/api/set-dob", {
      AccountID: accountId,
      DateOfBirth: dob,
    });

    if (resp.data.success) {
      console.log("DOB updated:", resp.data);
    }
  } catch (err) {
    console.error("Failed to update DOB", err);
  }
}
