import { saveAvatar } from "../models/sql.js";

export async function saveAvatarToDB(AvatarLink, AccountID) {
  console.log(AvatarLink);

  await saveAvatar({ AvatarLink, AccountID });

  return {
    success: true,
  };
}
