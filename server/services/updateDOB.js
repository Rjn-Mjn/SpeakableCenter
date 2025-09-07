import { setDOB } from "../models/sql.js";

export async function updateDOB(DateOfBirth, AccountID) {
  console.log(DateOfBirth);

  await setDOB({ DateOfBirth, AccountID });

  return {
    success: true,
  };
}
