import studentvue from "fast-studentvue";
import { relog } from "monoidentity";
import { getTodayFormatted } from "./_today";
import { getStorage } from "monoidentity";

const iterating = <T>(thing: T | T[]) => (Array.isArray(thing) ? thing : !thing ? [] : [thing]);
const first = <T>(thing: T | T[]): T => (Array.isArray(thing) ? thing[0] : thing);
const cache = getStorage("cache");

export const getSchoolAndTeachers = async (
  email: string,
  password: string,
): Promise<{ school: string; teachers: string[] }> => {
  const key = getTodayFormatted();
  const cached = cache.schoolAndTeachers;

  if (cached?.key == key) {
    return cached.data;
  }

  const data = await studentvue({ email, password }, relog, "StudentClassList");
  const {
    StudentClassSchedule: { ClassLists, TodayScheduleInfoData },
  } = data;
  const classList = iterating(ClassLists?.ClassListing);
  const teachers = classList
    .map((c) => c["@_Teacher"])
    .map((t) => t.split(", ").reverse().join(" "));

  const school = first(TodayScheduleInfoData.SchoolInfos.SchoolInfo)["@_SchoolName"];

  const result = { school, teachers };
  cache.schoolAndTeachers = { key, data: result };
  return result;
};
