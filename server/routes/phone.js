import { updatePhone } from "../services/updatePhone.js";

async function updatePhoneRouter(req, res, next) {
  try {
    console.log("running /api/set-phone");

    const AccountID = req.body.AccountID || req.user?.AccountID;
    const PhoneNumber = req.body.PhoneNumber;
    console.log("Phone: ", PhoneNumber);

    if (!AccountID) {
      return res.status(400).json({ error: "Missing AccountID or Gender" });
    }

    const result = await updatePhone(PhoneNumber, AccountID);

    return res.json({
      success: true,
      message: "Phone updated successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
export { updatePhoneRouter };
