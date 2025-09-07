import { updateGender } from "../services/updateGender.js";

async function updateGenderRouter(req, res, next) {
  try {
    console.log("running /api/set-gender");

    const AccountID = req.body.AccountID || req.user?.AccountID;
    const Gender = req.body.Gender;
    console.log("gender: ", Gender);

    if (!AccountID) {
      return res.status(400).json({ error: "Missing AccountID or Gender" });
    }

    const result = await updateGender(Gender, AccountID);

    return res.json({
      success: true,
      message: "Gender updated successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
export { updateGenderRouter };
