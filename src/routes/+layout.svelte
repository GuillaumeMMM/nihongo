<script lang="ts">
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<main class="container">
	{@render children()}
</main>

<style>
	:global {
		@import '@guillaumemmm/marquedefabrique/reset.css';
		@import '@guillaumemmm/marquedefabrique/variables.css';
		@import '@guillaumemmm/marquedefabrique/kit.css';

		body {
			font-family: 'Open Sans', 'system-ui', sans-serif;
			font-optical-sizing: auto;
			font-weight: 500;
			font-style: normal;
			font-variation-settings: 'wdth' 100;
			background: var(--mdf-background-gradient);
			line-height: 1.5;
		}
	}

	.container {
		padding: 1rem;
		min-height: 100vh;
		max-width: 75rem;
		margin: 0 auto;
	}
</style>
