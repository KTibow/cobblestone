import { getScopedFS, getStorage, getLoginRecognized } from "monoidentity";
import { getToday } from "../lib";
import { addRundown, getRundown } from "../rundownkit/+rundown";

export const state = $state({
  status: "..." as string,
});

const config = getStorage("config");

const update = async (signal: AbortSignal) => {
  if (signal.aborted) return;

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
    signal.throwIfAborted();

    const today = getToday();
    await fs.sync(today);
    signal.throwIfAborted();

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
  const controller = new AbortController();

  update(controller.signal);
  const interval = setInterval(() => update(controller.signal), 1000 * 60 * 60);

  return () => {
    controller.abort();
    clearInterval(interval);
  };
};
