import { completeSync, getScopedFS } from "monoidentity";
import { getToday } from "../lib";

const CHARGE_TASK =
  "- [ ] Charge " +
  (navigator.userAgent.includes("CrOS")
    ? "Chromebook"
    : navigator.userAgent.includes("Mobi")
      ? "phone"
      : "laptop");

export const start = () => {
  if (!("getBattery" in navigator)) return () => {};

  const controller = new AbortController();
  const signal = controller.signal;
  const fs = getScopedFS("Obsidian");

  navigator.getBattery().then((battery) => {
    const handlePercent = async () => {
      if (battery.charging) return;
      if (battery.level > 0.3) return;

      // Pause before writing
      await completeSync();
      signal.throwIfAborted();

      const today = getToday();
      const content = fs[today] || "";
      if (content.includes(CHARGE_TASK)) return;

      fs[today] =
        content + (content.length > 0 && !content.endsWith("\n") ? "\n" : "") + CHARGE_TASK;
    };

    signal.throwIfAborted();
    handlePercent();
    battery.addEventListener("levelchange", handlePercent, { signal });
  });

  return () => {
    controller.abort();
  };
};
