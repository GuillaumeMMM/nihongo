<script lang="ts">
	import type { Module, ModuleType } from '$lib/types/module';

	let { data }: { data: { modules: (Module & { metaType: ModuleType })[] } } = $props();
</script>

<svelte:head>
	<title>Admin | nihongo</title>
	<meta name="description" content="Admin panel" />
</svelte:head>

<h2 class="mdf-title2">Modules</h2>
<div><a class="mdf-button add-button" href="/admin/addmodule">Add a module</a></div>
<ul class="modules">
	{#each data.modules as module}
		<li class="module">
			<a href="/admin/module/{module.id}/" class="mdf-link module">{module.name} {module.type}</a>
		</li>
	{/each}
</ul>

<style>
	.add-button {
		display: inline-block;
	}

	.module {
		margin: 1rem 0;
	}
</style>
