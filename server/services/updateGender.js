import { setGender } from "../models/sql.js";

export async function updateGender(Gender, AccountID) {
  console.log(Gender);

  await setGender({ Gender, AccountID });

  return {
    success: true,
  };
}
