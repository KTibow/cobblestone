import { districtApps, districtNews, schoolNWS } from "school-districts";
import { listBirthdays } from "./birthdaykit";
import { getTodayFormatted } from "./_today";
import { getSchoolAndTeachers } from "./_st";

// District dependent
const getAlerts = async (email: string): Promise<string[]> => {
  const domain = email.split("@")[1];
  const news = districtNews[domain];
  if (!news) {
    throw new Error("Unknown domain");
  }

  if (news.type == "flashalert") {
    const r = await fetch(news.url);
    const t = await r.text();
    const d = t
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line))
      .filter((item) => item.org == news.org);
    return d.map((line) => `District: ${line.headline}`);
  } else {
    throw new Error("Unknown news type");
  }
};

// School dependent
const WIND_WORD = /\bwind\b/i;
const getWeather = async (email: string, password: string, school: string): Promise<string[]> => {
  const domain = email.split("@")[1];
  const nwsGroup = schoolNWS[domain];
  if (!nwsGroup) {
    throw new Error("Unknown domain");
  }

  const nwsUrl = nwsGroup[school];
  if (!nwsUrl) {
    throw new Error("Unknown school");
  }

  const forecastResponse = await fetch(nwsUrl, {
    headers: { "user-agent": "RundownKit by @KTibow" },
  });
  const forecastData = await forecastResponse.json();

  const full: string = forecastData.properties.periods[0].detailedForecast;
  const minusWind = full
    .split(/(?<=\.) /)
    .filter((sentence) => !WIND_WORD.test(sentence))
    .join(" ");

  return [minusWind];
};

// Teacher dependent
const NSD_SUB_UUIDS: Record<string, string> = {
  "Bothell High School": "D43268D2-8620-4D75-933A-181C5A6CAE3C",
  "Inglemoor High School": "D756C7F1-13AA-46D6-9049-DED884923A73",
  "Innovation Lab High School": "0245B0BA-2DFA-45EF-9718-71E95DBE4A24",
  "North Creek High School": "B05F1594-8A33-4601-AF2D-8F17046346FD",
  "Woodinville High School": "1ECEDBF3-F608-46A6-AF21-AAFD1D009073",
  // ---
  "Canyon Park Middle School": "348EF711-785F-49A4-A161-408F3D50B8E6",
  "Kenmore Middle School": "9EBAF662-7D2B-4A5F-BFB9-C7398C6DF814",
  "Leota Middle School": "06AFC143-9890-4364-8AB1-C24A9C5597D1",
  "Northshore Middle School": "F2133E61-0E45-45D3-9519-995A1132E124",
  "Skyview Middle School": "F5B7F38B-E791-431F-8C9B-A90C7011DFFB",
  "Timbercrest Middle School": "A9E30772-C664-4618-B998-71CB566C76D2",
  // ---
  "Arrowhead Elementary": "47D0F9DB-4B79-46A9-9055-22479624D960",
  "Canyon Creek Elementary": "7C7B17E4-A390-46E5-A191-9AF1E39F9005",
  "Cottage Lake Elementary": "1DFE4F7C-8345-40B7-9C68-2BE4D1EC53A2",
  "Crystal Springs Elementary": "DE8A322E-E6DE-4F4C-B470-9F36E7714401",
  "East Ridge Elementary": "5FD5AA72-5124-46E4-B283-30A72D68FB3C",
  "Fernwood Elementary": "E98808A3-69C6-410D-A398-A65042BCD916",
  "Frank Love Elementary": "66386AA3-3B87-4683-A0CE-0709EBFF6DF9",
  "Hollywood Hill Elementary": "EE48C861-16A2-47E9-A208-551E969DF346",
  "Kenmore Elementary": "2A6E2F24-7972-4C50-B1C2-823102190AD3",
  "Kokanee Elementary": "E83A91FA-868D-4555-BC68-31EB6313AB47",
  "Maywood Hills Elementary": "D73211BC-67A4-4A7B-AB4F-F9FFB2E94309",
  "Moorlands Elementary": "30799D74-7DE3-4C53-B5BC-37AF3A6C08E8",
  "Shelton View Elementary": "3C5185E1-245D-4246-AC79-722911C0563F",
  "Sunrise Elementary": "14E8922F-00D1-462B-B78C-8D64440FA5A1",
  "Wellington Elementary": "10565F07-8CF4-4A58-94A5-28C3D0512744",
  "Westhill Elementary": "D59B4DF0-C671-43D5-842A-26EB3884BE18",
};
const getSynergySchoolUUID = (domain: string, school: string) => {
  if (domain == "apps.nsd.org") {
    const id = NSD_SUB_UUIDS[school];
    if (!id) {
      throw new Error("Unknown school");
    }
    return id;
  } else {
    throw new Error("Unknown domain");
  }
};
const getSubs = async (
  email: string,
  password: string,
  school: string,
  teachers: string[],
): Promise<string[]> => {
  const domain = email.split("@")[1];
  const apps = districtApps[domain];
  if (!apps) {
    throw new Error("Unknown domain");
  }
  const synergy = apps.find((a) => a.app == "Synergy");
  if (!synergy) {
    throw new Error("District does not use Synergy");
  }

  const uuid = getSynergySchoolUUID(domain, school);
  const r = await fetch(`${synergy.base}/Service/SubLogin.asmx/LoadSubs`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      curSchoolOrgYearGU: uuid,
      dn: "",
    }),
  });
  const { d }: { d: { Name: string }[] } = await r.json();
  return d
    .map((x) => x.Name)
    .filter((n) => n != "Select a substitute...")
    .map((x) => x.split(", ").reverse().join(" "))
    .filter((t) => teachers.includes(t))
    .map((t) => `${t} is out today`);
};
const getBirthdays = async (
  email: string,
  password: string,
  school: string,
  teachers: string[],
): Promise<string[]> => {
  const todayFormatted = getTodayFormatted();

  const domain = email.split("@")[1];
  const birthdays = await listBirthdays(domain, school, teachers);

  return teachers
    .filter((teacher) => birthdays[teacher] == todayFormatted)
    .map((t) => `Happy birthday ${t}`);
};

export const getRundown = async (email: string, password: string): Promise<string[]> => {
  const schoolTeachersPromise = getSchoolAndTeachers(email, password);
  const [alerts, weather, subs, birthdays] = await Promise.allSettled([
    getAlerts(email),
    schoolTeachersPromise.then(({ school }) => getWeather(email, password, school)),
    schoolTeachersPromise.then(({ school, teachers }) =>
      getSubs(email, password, school, teachers),
    ),
    schoolTeachersPromise.then(({ school, teachers }) =>
      getBirthdays(email, password, school, teachers),
    ),
  ]);

  const output: string[] = [];

  const addResult = (title: string, result: PromiseSettledResult<string[]>) => {
    if (result.status == "fulfilled") {
      output.push(...result.value);
    } else {
      const message =
        result.reason instanceof Error ? result.reason.message : String(result.reason);
      output.push(`Could not get ${title}: ${message}`);
    }
  };

  addResult("alerts", alerts);
  addResult("weather", weather);
  addResult("substitutes", subs);
  addResult("birthdays", birthdays);

  return output;
};

const RUNDOWN_HEADER = "## Rundown\n";
export const addRundown = (rundown: string[], page: string) => {
  let rundownStart = page.indexOf(RUNDOWN_HEADER);
  if (rundownStart == -1) {
    page = RUNDOWN_HEADER + page;
    rundownStart = 0;
  }
  const rundownAnchor = rundownStart + RUNDOWN_HEADER.length;

  for (const item of rundown) {
    const text = `- ${item}\n`;
    if (page.includes(text, rundownAnchor)) {
      continue;
    }
    page = page.slice(0, rundownAnchor) + text + page.slice(rundownAnchor);
  }

  return page;
};
