<script lang="ts">
  import { getLoginRecognized } from 'monoidentity';
  import { createBucket, KEY_CLOUD } from 'monoidentity-sync';
  import { produceStudentVue, consumeStudentVue } from 'monoidentity-verification';
  import { onMount } from 'svelte';
  import { Spring } from 'svelte/motion';
  import { fade } from 'svelte/transition';

  let { done }: { done: () => void } = $props();
  let progress = new Spring(0, { stiffness: 0.02, damping: 1 });
  onMount(async () => {
    const login = getLoginRecognized();
    progress.target = 0.3;
    const token = await produceStudentVue(login.email, login.password);

    progress.target = 0.7;
    const jwt = await consumeStudentVue({ token, email: login.email }, undefined);

    progress.target = 1.0;
    const bucket = await createBucket(jwt);

    localStorage[KEY_CLOUD] = bucket;
    done();
  });
</script>

<div style:--progress="{progress.current * 100}%" out:fade={{ duration: 200 }}>
  <span>Connecting to Cloud</span>
</div>

<style>
  div {
    @apply --m3-label-large;
    display: grid;

    height: 2rem;
    border-radius: 0.5rem;
    background-image: linear-gradient(
      to right,
      var(--m3c-primary) var(--progress),
      var(--m3c-primary-container-subtle) var(--progress)
    );

    position: fixed;
    top: 0.5rem;
    right: 0.5rem;
  }
  span {
    display: flex;
    align-items: center;
    padding-inline: 0.75rem;

    background-clip: text;
    background-image: linear-gradient(
      to right,
      var(--m3c-on-primary) var(--progress),
      var(--m3c-on-primary-container-subtle) var(--progress)
    );
    color: transparent;
  }
</style>
