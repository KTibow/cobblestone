<script lang="ts">
  import iconUp from "@ktibow/iconset-material-symbols/arrow-upward-rounded";
  import iconDots from "@ktibow/iconset-material-symbols/more-horiz";
  import iconFile from "@ktibow/iconset-material-symbols/draft-outline-rounded";
  import iconPlusRectangle from "@ktibow/iconset-material-symbols/rectangle-add-outline-rounded";
  import iconPlus from "@ktibow/iconset-material-symbols/add-2-rounded";
  import iconMarkdown from "@ktibow/iconset-material-symbols/article-rounded";
  import { getScopedFS, waitForSync } from "monoidentity";
  import { Icon, Layer } from "m3-svelte";
  import { onMount } from "svelte";
  import View from "./View.svelte";
  import File from "./File.svelte";
  import { start as startCharger } from "./auto/autocharger";
  import { start as startRundown } from "./auto/autorundown.svelte";
  import Home from "./Home.svelte";
  const iconExcalidraw = {
    body: `<path d="m24 19.8-2.6-3-2.6-3c-1.4.6-2.6 1.9-3.7 3 .2.2-1.8 1.2-.8 1.8q1.5 1.4 3.3 2.7l2.8 2.3c.5 0 .8-.6 1.1-.9L24 20zm-7.7-.1-1.9-1.5 1.9-1.8c-.6.7-1.9 2.1-.5 2.8zm4.1 3.1q-1.6-1.1-2.8-2.5l3 2.3zm.4.2q.1 0 0 0M.6 3.5q.3 2 1 3.8c.1 1 1.2 1.5 2 2.2.7.5 1.4 1.6 2.3 1.5q2.3-2.3 4.2-5c1-1.7-2.3-3-3.3-4C4.7 1.4 2.4 1.3.3.6c-.6.1 0 1 0 1.5Zm6-1.2c.4.3.8.7 0 .3-.4-.3-2.1-.8-.8-.5zm-5.8-1q.5 1.6.6 3.4L.6 1.3ZM.5 1c-.1-.1.5.2 0 0M23.7.8c-.5-.3.3-1-.8-.7q-3.7.7-7.3 1.7-1 .9-2 2.4A330 330 0 0 1 .3 18.9c0 .3-.5 1.2.3.7.4.2 1 1 .3.4-.6 0 .4.6.6.9l3.7 3c.9-.2 1.4-1.2 2.2-1.8q6.9-7 14.8-13 .6-1 .8-2.4a31 31 0 0 0 .7-5.9m-10.8 5 .3-.4zM7.5 21.2c.3-.3.7-.6.2-.1Zm.7-.7 3.6-3.5c1.4-1.5 3.6-3.1-3.6 3.5M15 4l-4 5.4q-4.5 5.4-9.7 10c.3-1 1.8-1.8 2.5-2.7q6.2-6 11.3-13v.1zm2.9 3.4c-1.2-.4-1-2.2 0-2.6.6-.8 2.3.5 2 1.4-.1 1-1.2 1.6-2 1.2M22 8.7l-2.3 1.8-1.6 1.3q1.9-1.6 3.6-3.3.5-.8.5-1.8c.9-.4-.2 1.8-.2 2" fill="currentColor"/>`,
    width: 24,
    height: 24,
  };

  onMount(() => {
    const endRundown = startRundown();
    const endCharger = startCharger();
    return () => {
      endRundown();
      endCharger();
    };
  });

  let currentDirectoryPath = $state("/");
  let currentFilePath = $state("");

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
      if (slash != -1) {
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

  const getFileDisplay = (file: Entry) => {
    const displayPath =
      currentDirectoryPath != "/" ? file.name.slice(currentDirectoryPath.length) : file.name;

    if (file.type == "directory") {
      return { text: displayPath, icon: iconDots };
    }

    if (file.name.endsWith(".md")) {
      return { text: displayPath.slice(0, -3), icon: iconMarkdown };
    }

    if (file.name.endsWith(".excalidraw")) {
      return { text: displayPath.slice(0, -11), icon: iconExcalidraw };
    }

    return { text: displayPath, icon: iconFile };
  };

  const loadFile = (path: string) => {
    currentFilePath = path;
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
    <File
      {...getFileDisplay(file)}
      disabled={file.name == currentFilePath}
      onclick={() => {
        if (file.type == "directory") {
          currentDirectoryPath = file.name;
        } else {
          currentFilePath = file.name;
        }
      }}
    />
  {/each}
  <File text="New drawing" icon={iconPlusRectangle} onclick={newDrawing} />
  <File text="New note" icon={iconPlus} onclick={newNote} />
</div>
{#if currentFilePath}
  {#key currentFilePath}
    <View path={currentFilePath} {fs} />
  {/key}
{:else}
  <div class="empty">
    {#await waitForSync("*")}
      <p style:margin="auto" style:color="var(--m3c-on-surface-variant)">Syncing</p>
    {:then}
      <Home {loadFile} />
    {/await}
  </div>
{/if}

<style>
  .files {
    display: flex;
    flex-direction: column;
    overflow: clip auto;
    width: 15rem;
    flex-shrink: 0;
  }

  .location {
    display: flex;
    height: 3rem;
    justify-content: space-between;
    padding-inline-start: 0.5rem;
    color: var(--m3c-on-surface-variant);

    span {
      align-self: center;
    }
    .up {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1lh;
      border-radius: var(--m3-shape-full);

      position: relative;
    }
  }

  .empty {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    border-radius: 1rem 0 0 1rem;
    padding: 0.5rem;
    background-color: var(--m3c-surface);
  }
</style>
