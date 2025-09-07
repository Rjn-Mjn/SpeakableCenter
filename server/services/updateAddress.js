import { setAddress } from "../models/sql.js";

export async function updateAddress(Address, AccountID) {
  console.log(Address);

  await setAddress({ Address, AccountID });

  return {
    success: true,
  };
}
