<script lang="ts">
	import type { ExerciseMode, Module } from '$lib/types/module';
	import { shuffleCards } from '$lib/utils/cards';
	import { currentExerciseCards, currentModule } from '../../../stores/exercise';

	let { data: module }: { data: Module } = $props();

	currentModule.set(module);
	currentExerciseCards.set(shuffleCards(module.cards));

	let mode = $state<ExerciseMode>('all');

	function onModeChanges(e: Event) {
		mode = (e.target as HTMLSelectElement).value as ExerciseMode;
	}
</script>

<svelte:head>
	<title>Exercise {module.name} | nihongo</title>
	<meta name="description" content="Japanese exercise" />
</svelte:head>

<h1 class="mdf-title1">{module.name}</h1>
<a href="../" class="mdf-link back">Go back to the exercises list</a>

<form>
	<div class="mdf-select-control">
		<label for="mode-select">How many questions do you want to answer ?</label>
		<select
			name="mode"
			bind:value={mode}
			id="mode-select"
			class="mdf-select"
			onchange={onModeChanges}
		>
			<option value="all" selected={mode === 'all'}> Every question once </option>
			<option value="20" selected={mode === '20'}> 20 questions </option>
			<option value="100" selected={mode === '100'}> 100 questions </option>
			<option value="200" selected={mode === '200'}> 200 questions </option>
			<option value="500" selected={mode === '500'}> 500 questions </option>
		</select>
	</div>
</form>
<div>
	<a class="mdf-button start" href="./{module.id}/questions"
		>Start the exercise<span aria-hidden="true">&nbsp;📚</span></a
	>
</div>

<table>
	<caption class="caption">List of questions in this exercise :</caption>
	<thead>
		<tr>
			<th>Question</th>
			<th>Answer</th>
		</tr>
	</thead>
	<tbody>
		{#each module.cards as card}
			<tr>
				<td>{card.q}</td>
				<td>{card.a.join(' | ')}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.back {
		margin: 1rem 0;
		display: inline-block;
	}

	.start {
		display: inline-block;
		margin: 1rem 0;
	}

	.caption {
		font-weight: 500;
		text-align: left;
	}

	table {
		min-width: 16rem;
	}

	td,
	th {
		padding: 0.5rem;
		border: 1px solid var(--mdf-color-secondary);
	}

	th,
	:nth-child(even) > td {
		background-color: var(--mdf-color-secondary-transparent);
	}
</style>
