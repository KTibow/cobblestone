<script lang="ts">
  import { Button } from "m3-svelte";
  import AutoRundownInfo from "./auto/AutoRundownInfo.svelte";
  import { getToday } from "./lib";

  let { loadFile }: { loadFile: (path: string) => void } = $props();
</script>

<Button variant="outlined" size="xl" style="margin:auto" onclick={() => loadFile(getToday())}
  >Open today's note</Button
>
<div class="controls">
  <AutoRundownInfo />
</div>

<style>
  .controls {
    display: flex;
    justify-content: center;
  }
</style>
