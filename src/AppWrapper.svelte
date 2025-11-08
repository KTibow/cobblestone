<script lang="ts">
  import { Monoidentity } from "monoidentity";
  import App from "./App.svelte";

  const isObsidian = (path: string) =>
    path.startsWith("Obsidian") &&
    !path.includes(".obsidian") &&
    (path.endsWith(".md") || path.endsWith(".excalidraw"));
</script>

<Monoidentity
  app="cobblestone"
  shouldBackup={(path) => path.startsWith(".core") || isObsidian(path)}
>
  <App />
</Monoidentity>
