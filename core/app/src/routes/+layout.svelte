<!-- src/routes/+layout.svelte -->
<script lang="ts">
    import '$lib/css/tailwind.css';
    import { onMount } from 'svelte';
    import TitleBar from '$lib/components/titleBar.svelte';
    import { getPlatform, type PlatformInfo } from '$lib/utils/platform';

    let platform = $state<PlatformInfo | null>(null);

    onMount(async () => {
        platform = await getPlatform();
    });

    let { children } = $props();
</script>

<div class="h-screen w-screen bg-bg text-text flex flex-col m-0">
    {#if platform?.isDesktop}
        <TitleBar />
    {/if}

    <main
        class="font-elms flex-1 px-3 overflow-auto decoration-accent selection:bg-accent selection:text-bg accent-accent"
        style={!platform?.isDesktop ? `
            padding-top: max(0.5rem, env(safe-area-inset-top));
            padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
        ` : ''}
    >
        {@render children()}
    </main>
</div>
