<script lang="ts">
  import { Monoidentity } from "monoidentity";
  import App from "./App.svelte";
</script>

<Monoidentity app="cobblestone" shouldBackup={(path) => path.startsWith("Obsidian")}>
  <App />
</Monoidentity>
