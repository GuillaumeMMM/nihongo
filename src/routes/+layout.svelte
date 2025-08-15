<script lang="ts">
	import Sidebar from '$lib/components/sidebar.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<main class="container">
	<div class="sidebar">
		<Sidebar />
	</div>
	<div class="content">
		{@render children()}
	</div>
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
		display: flex;
		gap: 2rem;
		flex-direction: column;
		position: relative;
		padding: 1rem;
		min-height: 100vh;
		max-width: 90rem;
		margin: 0 auto;

		.sidebar {
			top: 1rem;
			left: 0;
			height: fit-content;
		}

		.content {
			flex: 1;
		}
	}

	@media screen and (min-width: 63rem) {
		.container {
			flex-direction: row;
		}

		.sidebar {
			position: sticky;
		}
	}
</style>
