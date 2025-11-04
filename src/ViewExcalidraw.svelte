<script lang="ts">
  import React from "react";
  import { createRoot } from "react-dom/client";
  import { Excalidraw, THEME } from "@excalidraw/excalidraw";
  import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
  import "@excalidraw/excalidraw/index.css";

  let {
    value,
    onSave,
  }: {
    value: string;
    onSave: (value: string) => void;
  } = $props();

  let api: ExcalidrawImperativeAPI | null = null;
  let saveTimeout: ReturnType<typeof setTimeout> | null = null;

  function parseValue(text: string) {
    try {
      const data = JSON.parse(text);
      return {
        elements: data.elements || [],
        appState: data.appState || {},
      };
    } catch {
      return { elements: [], appState: {} };
    }
  }

  function serializeScene(api: ExcalidrawImperativeAPI) {
    const elements = api.getSceneElements();
    const appState = api.getAppState();
    return JSON.stringify(
      {
        type: "excalidraw",
        version: 2,
        source: "https://excalidraw.com",
        elements,
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          gridSize: appState.gridSize,
        },
      },
      null,
      2,
    );
  }

  function scheduleSave() {
    // Debounce saves to avoid hammering network
    if (saveTimeout) clearTimeout(saveTimeout);

    saveTimeout = setTimeout(() => {
      if (!api) return;
      const serialized = serializeScene(api);
      if (serialized == value) return;
      onSave(serialized);
    }, 2000);
  }

  function mountExcalidraw(node: HTMLDivElement) {
    const root = createRoot(node);
    root.render(
      React.createElement(Excalidraw, {
        excalidrawAPI: (apiRef) => {
          api = apiRef;
        },
        onChange: () => {
          scheduleSave();
        },
        initialData: parseValue(value),
        theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? THEME.DARK : THEME.LIGHT,
      }),
    );

    return {
      destroy() {
        root.unmount();
      },
    };
  }

  // Update scene when value prop changes externally
  $effect(() => {
    if (!api) return;
    const currentSerialized = serializeScene(api);
    if (currentSerialized && value && currentSerialized != value) {
      const data = parseValue(value);
      api.updateScene(data);
    }
  });
</script>

<div use:mountExcalidraw style:display="contents"></div>
