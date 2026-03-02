<script module>
  import 'monoidentity/receive-callback';
</script>

<script lang="ts">
  import { loaded, monoidentitysync } from 'monoidentity/receive-callback';
  import { KEY_CLOUD, KEY_LOCAL_ENABLED, KEY_SKIP, localAvailable } from 'monoidentity-sync';
  import { openHub } from 'monoidentity';
  import StorageSetupCloud from './StorageSetupCloud.svelte';
  import StoragePullPush from './StoragePullPush.svelte';
  import StorageSetupLocal from './StorageSetupLocal.svelte';

  let cloudSet = $state(Boolean(localStorage[KEY_CLOUD]));
  let localSet = $state(Boolean(localStorage[KEY_LOCAL_ENABLED]));
  let skipSet = $state(Boolean(localStorage[KEY_SKIP]));
</script>

{#if skipSet && localAvailable && loaded}
  <StorageSetupLocal />
{/if}

{#if cloudSet || localSet || skipSet}
  <StoragePullPush />
{:else if loaded && monoidentitysync == 'cloud'}
  <StorageSetupCloud done={() => (cloudSet = true)} />
{:else if loaded}
  {((localStorage[KEY_SKIP] = 'true'), (skipSet = true), '')}
{:else}
  {(openHub('cobblestone:initial'), '')}
{/if}
