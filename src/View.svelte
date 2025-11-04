<script lang="ts">
  let { path, fs }: { path: string; fs: Record<string, string> } = $props();

  let content = $derived(fs[path] || "");
</script>

{#if path.endsWith(".png")}
  <img src="data:image/png;base64,{btoa(content)}" alt="" />
{:else}
  <textarea
    class="focus-none"
    value={content}
    onchange={(e) => {
      const value = e.currentTarget.value;
      fs[path] = value;
    }}
  ></textarea>
{/if}

<style>
  textarea {
    flex-grow: 1;
    padding: 1rem;
    font: inherit;
    border-radius: inherit;
    resize: none;
  }
</style>
