<script lang="ts">
	import type { Module } from '$lib/types/module';
	import type { User, UserData } from '$lib/types/user';
	import { currentUser } from '../../stores/user';

	let user = $state<User | null>(null);
	let exercisesResults = $state<UserData['exercises'] | null>(null);
	let { data } = $props<{ modules: Module[] }>();

	currentUser.subscribe((u) => {
		user = u?.user || null;
		exercisesResults = u?.data.exercises || null;
		console.log(exercisesResults);
	});

	let modules = $derived(data.modules || []);
</script>

<h1 class="mdf-title1">{user?.username} profile</h1>

{#if user && exercisesResults}
	<ul>
		{#each Object.entries(exercisesResults) as [exerciseKey, exerciseValue]}
			<li>
				{(modules || []).find((m: Module) => m.id === exerciseKey)?.name}
				{(modules || []).find((m: Module) => m.id === exerciseKey)?.type} : {exerciseValue
					.map((v) => v.answers.toFixed(2))
					.join(' | ')}
			</li>
		{/each}
	</ul>
{/if}
