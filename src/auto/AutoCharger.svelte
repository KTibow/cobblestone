<script lang="ts">
  import { getScopedFS } from "monoidentity";
  import { onMount } from "svelte";
  import { getToday } from "../lib";

  const fs = getScopedFS("Obsidian");
  const CHARGE_TASK =
    "- [ ] Charge " +
    (navigator.userAgent.includes("CrOS")
      ? "Chromebook"
      : navigator.userAgent.includes("Mobi")
        ? "phone"
        : "laptop");

  onMount(() => {
    if ("getBattery" in navigator) {
      navigator.getBattery().then((battery) => {
        const handlePercent = () => {
          if (battery.charging) return;
          if (battery.level > 0.3) return;

          const today = fs[getToday()] || "";
          if (today.includes(CHARGE_TASK)) return;
          fs[getToday()] =
            today + (today.length > 0 && !today.endsWith("\n") ? "\n" : "") + CHARGE_TASK;
        };
        handlePercent();
        battery.addEventListener("levelchange", handlePercent);
      });
    }
  });
</script>
