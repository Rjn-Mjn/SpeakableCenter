import axios from "axios";

export default async function handleSetAddress(address, accountId) {
  try {
    const resp = await axios.post("https://audiox.space/api/set-address", {
      AccountID: accountId,
      Address: address,
    });

    if (resp.data.success) {
      console.log("Address updated:", resp.data);
    }
  } catch (err) {
    console.error("Failed to update Address", err);
  }
}
