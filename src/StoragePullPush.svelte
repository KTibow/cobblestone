<script lang="ts">
  import { autopush, cloudStartPull, createCloudClient, KEY_CLOUD } from 'monoidentity-sync';
  import { onMount } from 'svelte';

  onMount(() => {
    const controller = new AbortController();
    const { signal } = controller;
    if (localStorage[KEY_CLOUD]) {
      const client = createCloudClient(JSON.parse(localStorage[KEY_CLOUD]));
      cloudStartPull(client);
    }
    autopush(signal);
    return () => controller.abort();
  });
</script>
