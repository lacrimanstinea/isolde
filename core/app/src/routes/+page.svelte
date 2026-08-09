<script lang="ts">
    import { onMount } from 'svelte';
    import { getPlatform, type PlatformInfo } from '$lib/utils/platform';
    let platform = $state<PlatformInfo | null>(null);

    const appVersion = import.meta.env.VITE_APP_VERSION || 'dev';
    const isRelease = import.meta.env.VITE_IS_RELEASE === 'true';
    const typeOfRelease = import.meta.env.VITE_TYPE_OF_RELEASE || 'preview';

    onMount(async () => {
        platform = await getPlatform();
    });
</script>

<div class="flex flex-col min-h-full">
    <!-- stick to top -->
    <div>
        <h1 class="text-8xl">first official release</h1> <h2 class="text-9xl text-accent font-thin italic">{appVersion + (isRelease ? '' : '-' + typeOfRelease)}</h2>
        <p>i call it release, but it's just to test github actions really</p>
        <p>hello:)</p>
        <a href="https://github.com/lacrimanstinea/isolde">test link to repo</a> - does not open a separate browser window
        <br>
        <a href="https://github.com/lacrimanstinea/isolde" target="_blank">open in new tab</a> - this does
        <p>idk what else to add here but yeah that's the rough jist of it, this will also be released under preview 0.0.something anyway, the 0.1.0 release is just temporary</p>
    </div>

    {#if platform?.isMobile}
    <!-- stick to bottom -->
    <div class="mt-auto pt-4">
        <p class="text-white opacity-35 underline">this is some text at the bottom to test mobile nav bar thingy, it only shows on mobile though</p>
    </div>
    {/if}
</div>
