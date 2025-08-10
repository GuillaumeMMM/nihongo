<script lang="ts">
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<main class="container">
	<h1 class="mdf-title1">Admin</h1>
	{@render children()}
</main>

<style>
	.container {
		position: relative;
	}
</style>
