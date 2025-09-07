import { updateAddress } from "../services/updateAddress.js";

async function updateAddressRouter(req, res, next) {
  try {
    console.log("running /api/set-gender");

    const AccountID = req.body.AccountID || req.user?.AccountID;
    const Address = req.body.Address;
    console.log("Address: ", Address);

    if (!AccountID) {
      return res.status(400).json({ error: "Missing AccountID or Address" });
    }

    const result = await updateAddress(Address, AccountID);

    return res.json({
      success: true,
      message: "Address updated successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
export { updateAddressRouter };
