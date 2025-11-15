<script lang="ts">
  import { CircularProgressEstimate } from "m3-svelte";
  import { onDestroy } from "svelte";

  let { path: _path, fs }: { path: string; fs: Record<string, string> } = $props();

  const path = _path; // this component must be {#key}d

  const flush = fs.flush as any;
  onDestroy(() => {
    flush(path);
  });
</script>

<svelte:window
  onblur={() => {
    flush(path);
  }}
/>
{#if path.endsWith(".png")}
  <img src="data:image/png;base64,{btoa(fs[path])}" alt="" />
{:else if path.endsWith(".excalidraw")}
  {#await import("./ViewExcalidraw.svelte")}
    <CircularProgressEstimate thickness={8} style="margin:auto" />
  {:then { default: ViewExcalidraw }}
    <ViewExcalidraw bind:value={fs[path]} />
  {/await}
{:else}
  <textarea class="focus-none" placeholder="Write something, anything" bind:value={fs[path]}
  ></textarea>
{/if}

<style>
  textarea {
    flex-grow: 1;
    padding: 1rem;
    font: inherit;
    resize: none;
    border-radius: 1rem 0 0 1rem;
    background-color: rgb(var(--m3-scheme-background));
  }
</style>
