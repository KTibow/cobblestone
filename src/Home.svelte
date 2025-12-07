<script lang="ts">
  import { Button } from "m3-svelte";
  import type { StorageSetup } from "monoidentity";
  import AutoRundownInfo from "./auto/AutoRundownInfo.svelte";
  import { getToday } from "./lib";

  let { loadFile }: { loadFile: (path: string) => void } = $props();
  const setup = JSON.parse(localStorage["monoidentity-x/setup"]) as StorageSetup;
</script>

<Button variant="outlined" size="xl" style="margin:auto" onclick={() => loadFile(getToday())}
  >Open today's note</Button
>
<div class="controls">
  <AutoRundownInfo />
  {#if setup.method == "cloud"}
    {@const [endpoint, bucket] = [
      setup.base.split("/").slice(0, -1).join("/"),
      setup.base.split("/").at(-1)!,
    ]}
    <div class="cr">
      <Button variant="text" popovertarget="connect-obsidian">Connect Obsidian</Button>
      <div class="m3-font-body-medium" id="connect-obsidian" popover>
        <p>0. Download <a href="https://obsidian.md/">Obsidian</a></p>
        <p>1. Enable community plugins</p>
        <p>2. Download and enable Remotely Save</p>
        <p>3. Set these settings:</p>
        <p class="indented">- Endpoint = <strong>{endpoint}</strong></p>
        <p class="indented">- Access Key ID = <strong>{setup.accessKeyId}</strong></p>
        <p class="indented">- Secret Access Key = <strong>{setup.secretAccessKey}</strong></p>
        <p class="indented">- Bucket Name = <strong>{bucket}</strong></p>
        <p class="indented">- Change The Remote Prefix = <strong>Obsidian/</strong></p>
        <p>4. Save and sync</p>
        <br />
        <p><em>Yes, Cobblestone is named in reference to Obsidian</em></p>
      </div>
    </div>
  {/if}
</div>

<style>
  .controls {
    display: flex;
    justify-content: center;
    gap: 1rem;

    > :global(*) {
      display: flex;
      height: 2.5rem;
      background-color: var(--m3c-surface-container-low);
      color: var(--m3c-on-surface-variant);
      border-radius: var(--m3-shape-full);
      > :global(span) {
        align-self: center;
        margin-left: 1rem;
        margin-right: 0.5rem;
      }
    }
  }
  .cr {
    anchor-name: --connect;
  }
  #connect-obsidian {
    interpolate-size: allow-keywords;
    overflow: hidden;
    padding-inline: 1rem;
    padding-block: 1rem;

    transition:
      opacity,
      overlay allow-discrete,
      display allow-discrete;
    transition-duration: var(--m3-duration-fast);
    transition-timing-function: var(--m3-timing-function-fast);

    flex-direction: column;
    border-radius: 1.5rem;
    background-color: var(--m3c-surface-container-highest);

    position-anchor: --connect;
    position: absolute;
    inset: auto auto anchor(bottom) anchor(center);
    translate: -50% 0;

    &:not(:popover-open) {
      opacity: 0;
    }
    &:popover-open {
      display: flex;
      transition:
        height,
        padding,
        overlay allow-discrete,
        display allow-discrete;
      transition-duration: var(--m3-duration-spatial);
      transition-timing-function: var(--m3-timing-function-spatial);
      @starting-style {
        height: 0;
        padding-block: 0;
      }
    }

    a {
      color: var(--m3c-primary);
    }
    em {
      color: var(--m3c-on-surface-variant);
    }
    .indented {
      margin-left: 1rem;
    }
  }
</style>
