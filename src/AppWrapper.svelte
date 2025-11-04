<script lang="ts">
  import { Monoidentity } from "monoidentity";
  import App from "./App.svelte";

  const SAVED_EXTS = [".md", ".excalidraw"];
</script>

<Monoidentity
  app="cobblestone"
  shouldBackup={(path) =>
    path.startsWith("Obsidian") &&
    !path.includes(".obsidian") &&
    SAVED_EXTS.some((ext) => path.endsWith(ext))}
>
  <App />
</Monoidentity>
