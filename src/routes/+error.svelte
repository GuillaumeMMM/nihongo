<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="mdf-block mdf-block-error">
	<h1 class="mdf-title2 title">Error {page.status}</h1>
	<p>Something went wrong, try again later.</p>
</div>

<style>
	.title {
		margin-bottom: 1rem;
	}
</style>
