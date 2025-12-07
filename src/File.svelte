<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { Icon, Layer } from "m3-svelte";
  import type { IconifyIcon } from "@iconify/types";

  let {
    text,
    icon,
    ...restProps
  }: HTMLButtonAttributes & {
    text: string;
    icon: IconifyIcon;
  } = $props();
</script>

<button class="file" {...restProps}>
  <Layer />
  {text}
  <Icon {icon} size={20} style="flex-shrink:0" />
</button>

<style>
  .file {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: start;

    min-height: 2.5rem;
    padding: 0 0.5rem;
    border-radius: 0.5rem;
    flex-shrink: 0;
    position: relative;

    &:disabled {
      background-color: var(--m3c-primary-container-subtle);
      color: var(--m3c-on-primary-container-subtle);
    }
  }
</style>
