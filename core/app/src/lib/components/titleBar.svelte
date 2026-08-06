<script lang="ts">
	import { getCurrentWindow } from '@tauri-apps/api/window';
	import { Minus, Diamond, X } from 'lucide-svelte';
	import LogoText from '$lib/assets/logoText.svelte';
	const appWindow = getCurrentWindow();
</script>

<header
	data-tauri-drag-region
	class="flex items-center justify-between h-8 pl-3 pr-1.5 bg-bg text-text rounded-t-[10px] select-none"
>
	<div
		data-tauri-drag-region
		class="flex items-center h-3 w-auto opacity-80 pointer-events-none"
	>
		<LogoText />
	</div>
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
