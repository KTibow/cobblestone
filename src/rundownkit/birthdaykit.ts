import { getStorage } from "monoidentity";
import birthdayRemote from "./birthday.remote";

const cache = getStorage("cache");

export const listBirthdays = async (
  district: string,
  school: string,
  teachers: string[],
): Promise<Record<string, string>> => {
  const key = `${district}:${school}:${teachers.sort().join(";")}`;
  const cached = cache.birthdays;

  if (cached?.key == key) {
    return cached.data;
  }

  const birthdays = await birthdayRemote({ district, school, teachers });
  cache.birthdays = { key, data: birthdays };
  return birthdays;
};
