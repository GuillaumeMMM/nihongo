<script lang="ts">
	import AdminModuleForm from '$lib/components/AdminModuleForm/AdminModuleForm.svelte';
	import type { Module } from '$lib/types/module';

	let { data: module }: { data: Module } = $props();
</script>

<a class="mdf-link" href="/admin">Back to admin home</a>
<h2 class="mdf-title2">Update module {module.name} {module.type}</h2>
<AdminModuleForm {module} />
