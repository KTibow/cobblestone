import { BIRTHDAYS } from "$env/static/private";
import { fn } from "monoserve";
import { object, array, string, pipe, maxLength } from "valibot";

const birthdaysData: Record<string, Record<string, Record<string, string>>> = JSON.parse(BIRTHDAYS);

export default fn(
  object({
    district: string(),
    school: string(),
    teachers: pipe(array(string()), maxLength(8)),
  }),
  ({ district, school, teachers }) => {
    const districtData = birthdaysData[district];
    if (!districtData) {
      throw new Response("Unknown district", { status: 500 });
    }

    const schoolData = districtData[school];
    if (!schoolData) {
      throw new Response("Unknown school", { status: 500 });
    }

    const result: Record<string, string> = {};
    for (const teacher of teachers) {
      if (schoolData[teacher]) {
        result[teacher] = schoolData[teacher];
      }
    }

    return result;
  },
);
