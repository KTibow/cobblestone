<script lang="ts">
  import iconUp from "@ktibow/iconset-material-symbols/arrow-upward-rounded";
  import iconDots from "@ktibow/iconset-material-symbols/more-horiz";
  import iconFile from "@ktibow/iconset-material-symbols/draft-outline-rounded";
  import iconPlus from "@ktibow/iconset-material-symbols/add-2-rounded";
  import { getScopedFS } from "monoidentity";
  import { Icon, Layer, Button } from "m3-svelte";
  import { getToday } from "./lib";
  import AutoCharger from "./AutoCharger.svelte";
  import View from "./View.svelte";

  let currentDirectoryPath = $state("/");
  let currentOpenFilePath = $state("");

  const fs = getScopedFS("Obsidian");

  type Entry = { name: string; type: "directory" | "file" };

  const files = $derived.by<Entry[]>(() => {
    const prefix = currentDirectoryPath == "/" ? "" : currentDirectoryPath;
    const keys = Object.keys(fs);
    const dirSet = new Set<string>();
    const fileEntries: Entry[] = [];

    for (const key of keys) {
      if (!key.startsWith(prefix)) continue;
      const rest = key.slice(prefix.length);
      if (!rest) continue;
      const slash = rest.indexOf("/");
      if (slash !== -1) {
        const dirPath = prefix + rest.slice(0, slash + 1);
        dirSet.add(dirPath);
      } else {
        fileEntries.push({ name: prefix + rest, type: "file" });
      }
    }

    const dirEntries = Array.from(dirSet).map((name) => ({ name, type: "directory" as const }));
    dirEntries.sort((a, b) => a.name.localeCompare(b.name));
    fileEntries.sort((a, b) => a.name.localeCompare(b.name));
    return [...dirEntries, ...fileEntries];
  });

  const loadFile = (path: string) => {
    currentOpenFilePath = path;
  };

  const newDrawing = () => {
    const title = prompt("Title");
    if (!title) return;

    const path = (currentDirectoryPath == "/" ? "" : currentDirectoryPath) + title + ".excalidraw";
    loadFile(path);
  };

  const newNote = () => {
    const title = prompt("Title");
    if (!title) return;

    const path = (currentDirectoryPath == "/" ? "" : currentDirectoryPath) + title + ".md";
    loadFile(path);
  };
</script>

<AutoCharger />
<div class="files">
  <div class="location">
    <span>{currentDirectoryPath}</span>
    {#if currentDirectoryPath != "/"}
      <button
        class="up focus-inset"
        onclick={() =>
          (currentDirectoryPath =
            currentDirectoryPath.slice(0, -1).split("/").slice(0, -1).join("/") + "/")}
      >
        <Layer />
        <Icon icon={iconUp} size={24} />
      </button>
    {/if}
  </div>
  {#each files as file (file.name)}
    <button
      class="file"
      disabled={file.name == currentOpenFilePath}
      onclick={() => {
        if (file.type == "directory") {
          currentDirectoryPath = file.name;
        } else {
          loadFile(file.name);
        }
      }}
    >
      <Layer />
      {#if currentDirectoryPath != "/"}
        {file.name.slice(currentDirectoryPath.length)}
      {:else}
        {file.name}
      {/if}
      <Icon icon={file.type == "directory" ? iconDots : iconFile} size={20} />
    </button>
  {/each}
  <button class="file" onclick={newDrawing}>
    <Layer />
    New drawing
    <Icon icon={iconPlus} size={20} />
  </button>
  <button class="file" onclick={newNote}>
    <Layer />
    New note
    <Icon icon={iconPlus} size={20} />
  </button>
</div>
{#if currentOpenFilePath}
  {#key currentOpenFilePath}
    <View path={currentOpenFilePath} {fs} />
  {/key}
{:else}
  <Button variant="outlined" size="xl" style="margin:auto" onclick={() => loadFile(getToday())}
    >Open today's note</Button
  >
{/if}

<style>
  .files {
    display: flex;
    flex-direction: column;
    overflow: clip auto;
    border-start-end-radius: 1rem;
    border-end-end-radius: 1rem;
    width: 15rem;
    background-color: rgb(var(--m3-scheme-surface-container-lowest));
  }

  .location {
    display: flex;
    align-items: center;
    line-height: 2;
    justify-content: space-between;
    padding-inline-start: 0.5rem;
    color: rgb(var(--m3-scheme-on-surface-variant));

    .up {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1lh;
      height: 1lh;
      border-radius: var(--m3-util-rounding-full);

      position: relative;
    }
  }

  .file {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: start;

    min-height: 2.5rem;
    padding: 0 0.5rem;
    border-radius: 0.5rem;
    flex-shrink: 0;
    position: relative;

    &:disabled {
      background-color: rgb(var(--m3-scheme-primary-container-subtle));
      color: rgb(var(--m3-scheme-on-primary-container-subtle));
    }
  }
</style>
