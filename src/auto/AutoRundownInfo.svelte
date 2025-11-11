<script lang="ts">
  import { Button } from "m3-svelte";
  import { state } from "./autorundown.svelte";
  import { getStorage, relog } from "monoidentity";

  const config = getStorage("config");
</script>

<div
  class="rundown-controls"
  title="Rundown tracks the weather, special alerts, and teacher events for you"
>
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

<style>
  .rundown-controls {
    display: flex;
    height: 2.5rem;
    background-color: rgb(var(--m3-scheme-surface-container-low));
    color: rgb(var(--m3-scheme-on-surface-variant));
    border-radius: var(--m3-util-rounding-full);
    align-self: end;
  }
  span {
    align-self: center;
    margin-left: 1rem;
    margin-right: 0.5rem;
  }
</style>
