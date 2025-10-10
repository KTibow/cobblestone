<script lang="ts">
  import { getScopedFS } from "monoidentity";
  import { onMount } from "svelte";
  import { getToday } from "./lib";

  const fs = getScopedFS("Obsidian");
  const CHARGE_TASK = "- [ ] Charge Chromebook";
  const handlePercent = (percent: number) => {
    if (percent > 0.3) return;

    const today = fs[getToday()] || "";
    if (today.includes("- [ ] Charge Chromebook")) return;
    const separator = today.length > 0 && !today.endsWith("\n") ? "\n" : "";
    fs[getToday()] = today + separator + CHARGE_TASK;
  };

  onMount(() => {
    // @ts-expect-error unknown stuff
    navigator.getBattery().then((battery) => {
      handlePercent(battery.level);
      battery.addEventListener("levelchange", () => {
        handlePercent(battery.level);
      });
    });
  });
</script>
