<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '$lib/css/tailwind.css';
	import TitleBar from '$lib/components/titleBar.svelte';
	let { children } = $props();
</script>

<div class="h-screen w-screen bg-bg text-text flex flex-col m-0">
	<TitleBar />
	<main
		class="font-elms flex-1 px-3 overflow-auto decoration-accent selection:bg-accent selection:text-bg accent-accent"
	>
		{@render children()}
	</main>
</div>
