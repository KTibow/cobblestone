import { getScopedFS, getStorage, getLoginRecognized, relog } from "monoidentity";
import { getToday } from "../lib";
import { addRundown, getRundown } from "../rundownkit/+rundown";

export const state = $state({
  status: "..." as string,
});

const config = getStorage("config");

const update = async () => {
  if (config["norundown"]) {
    state.status = "Rundown is disabled";
    return;
  }

  const fs = getScopedFS("Obsidian");

  let auth: { email: string; password: string };
  try {
    auth = getLoginRecognized();
  } catch {
    state.status = "Rundown needs auth";
    return;
  }

  state.status = "Rundown updating";

  try {
    const rundown = await getRundown(auth.email, auth.password);

    const today = getToday();
    const before = fs[today] || "";
    const after = addRundown(rundown, before);

    if (after != before) {
      fs[today] = after;
    }

    state.status = "Rundown updated";
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    state.status = `Rundown failed: ${message}`;
  }
};

export const start = () => {
  update();
  const interval = setInterval(update, 1000 * 60 * 60);

  return () => {
    clearInterval(interval);
  };
};
