<script lang="ts">
  import { Monoidentity } from "monoidentity";
  import App from "./App.svelte";

  const isObsidian = (path: string) =>
    path.startsWith("Obsidian") &&
    !path.includes(".obsidian") &&
    (path.endsWith(".md") || path.endsWith(".excalidraw"));
  const isLogin = (path: string) => path == ".core/login.encjson";
</script>

<Monoidentity
  app="cobblestone"
  getSyncStrategy={(path) =>
    isLogin(path)
      ? { mode: "immediate" }
      : isObsidian(path)
        ? { mode: "debounced", debounceMs: 10000 }
        : { mode: "none" }}
>
  <App />
</Monoidentity>
