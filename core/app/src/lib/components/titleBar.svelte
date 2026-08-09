<script lang="ts">
    import { getCurrentWindow } from '@tauri-apps/api/window';
    import { Minus, Diamond, X } from 'lucide-svelte';
    import LogoText from '$lib/assets/logoText.svelte';
    const appWindow = getCurrentWindow();

    const appVersion = import.meta.env.VITE_APP_VERSION || 'dev';
    const isRelease = import.meta.env.VITE_IS_RELEASE === 'true';
    const typeOfRelease = import.meta.env.VITE_TYPE_OF_RELEASE || 'preview';
</script>

<header
    data-tauri-drag-region
    class="flex items-center justify-between h-8 pl-3 pr-1.5 bg-bg text-text rounded-t-[10px] select-none"
>
    <!-- back/forward buttons that are invisible depending on the user's navigation history -->
    <div
        data-tauri-drag-region
        class="flex items-center h-3 w-auto opacity-80 pointer-events-none gap-2"
    >
        <LogoText />
        {#if !isRelease}
            <span class="text-xs text-white font-elms opacity-100">{isRelease ? appVersion : appVersion + "-" + typeOfRelease}</span>
        {/if}
    </div>

    <!-- a search bar in the center that searches app wide -->

    <div class="flex items-center h-full gap-0.5">
        <button
            class="group flex items-center justify-center w-7 h-6 rounded-md bg-transparent text-inherit opacity-55 cursor-pointer transition-colors duration-150 hover:bg-text/10 hover:opacity-90 active:bg-text/15"
            onclick={() => appWindow.minimize()}
            aria-label="Minimize"
        >
            <Minus size={12} strokeWidth={1.5} class="transition-transform duration-150 group-hover:scale-125" />
        </button>
        <button
            class="group flex items-center justify-center w-7 h-6 rounded-md bg-transparent text-inherit opacity-55 cursor-pointer transition-colors duration-150 hover:bg-text/10 hover:opacity-90 active:bg-text/15"
            onclick={() => appWindow.toggleMaximize()}
            aria-label="Maximize"
        >
            <Diamond size={10} strokeWidth={1.5} class="transition-transform duration-150 group-hover:scale-125" />
        </button>
        <button
            class="group flex items-center justify-center w-7 h-6 rounded-md bg-transparent text-inherit opacity-55 cursor-pointer transition-colors duration-150 hover:bg-accent hover:text-bg hover:opacity-100"
            onclick={() => appWindow.close()}
            aria-label="Close"
        >
            <X size={12} strokeWidth={1.5} class="transition-transform duration-150 group-hover:scale-125" />
        </button>
    </div>
</header>
