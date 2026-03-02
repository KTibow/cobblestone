<script>
  import { Icon } from 'm3-svelte';
  import iconBackUp from '@ktibow/iconset-material-symbols/sync-desktop-rounded';
  import iconX from '@ktibow/iconset-material-symbols/close-rounded';
  import { localPull } from 'monoidentity-sync';
  const backup = () => {
    localPull().then(() => location.reload());
  };
</script>

<div id="localsetup" popover {@attach (node) => node.showPopover()}>
  <button class="m3-layer" onclick={backup}>
    <Icon icon={iconBackUp} />
    Back up to a folder
  </button>
  <button class="m3-layer" commandfor="localsetup" command="hide-popover">
    <Icon icon={iconX} />
  </button>
</div>

<style>
  div {
    @apply --m3-label-large;
    &:popover-open {
      display: flex;
    }
    height: 2rem;
    gap: 0.25rem;

    position: fixed;
    inset: auto;
    top: 0.5rem;
    right: 0.5rem;
    background-color: transparent;
  }

  button {
    display: flex;
    align-items: center;

    gap: 0.5rem;
    padding-inline: 0.5rem;
    background-color: var(--m3c-primary);
    color: var(--m3c-on-primary);
    border-radius: 0.5rem;
    &:first-child {
      border-start-start-radius: 1rem;
      border-end-start-radius: 1rem;
    }
    &:last-child {
      border-start-end-radius: 1rem;
      border-end-end-radius: 1rem;
    }
  }
</style>
