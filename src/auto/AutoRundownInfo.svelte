<script lang="ts">
  import { Button } from "m3-svelte";
  import { state } from "./autorundown.svelte";
  import { getStorage, relog } from "monoidentity";

  const config = getStorage("config");
</script>

<div title="Rundown tracks the weather, special alerts, and teacher events for you">
  <span>{state.status}</span>
  {#if state.status == "Rundown is disabled"}
    <Button
      variant="text"
      onclick={() => {
        delete config["norundown"];
      }}>Turn on</Button
    >
  {:else if state.status == "Rundown needs auth"}
    <Button variant="text" onclick={relog}>Log in</Button>
  {:else}
    <Button
      variant="text"
      onclick={() => {
        config["norundown"] = true;
      }}>Turn off</Button
    >
  {/if}
</div>
