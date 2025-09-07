import { updateDOB } from "../services/updateDOB.js";

async function updateDOBRouter(req, res, next) {
  try {
    console.log("running /api/set-dob");

    const AccountID = req.body.AccountID || req.user?.AccountID;
    const DateOfBirth = req.body.DateOfBirth;
    console.log("DOB: ", DateOfBirth);

    if (!AccountID) {
      return res
        .status(400)
        .json({ error: "Missing AccountID or DateOfBirth" });
    }

    const result = await updateDOB(DateOfBirth, AccountID);

    return res.json({
      success: true,
      message: "DateOfBirth updated successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
export { updateDOBRouter };
