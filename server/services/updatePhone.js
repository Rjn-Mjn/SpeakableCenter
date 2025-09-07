import { setPhone } from "../models/sql.js";

export async function updatePhone(PhoneNumber, AccountID) {
  console.log(PhoneNumber);

  await setPhone({ PhoneNumber, AccountID });

  return {
    success: true,
  };
}
