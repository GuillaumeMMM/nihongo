<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Answer, Module } from '$lib/types/module';

	import {
		currentExerciseAnswersRecap,
		currentExerciseCards,
		currentModule
	} from '../../../../stores/exercise';

	let module = $state<Module>();
	let exerciseCards = $state<Module['cards']>([]);
	let recapAggregated = $state<Map<string, { a: string[]; isCorrect: boolean[] }>>(new Map());
	let correctCards = $state<Answer[]>([]);

	currentModule.subscribe((m) => {
		if (!m) {
			const destination = location.pathname.split('/');
			destination.pop();
			goto(destination.join('/'));
		}
		module = m;
	});

	currentExerciseCards.subscribe((c) => {
		exerciseCards = c;
	});

	currentExerciseAnswersRecap.subscribe((answers) => {
		correctCards = answers.filter((answer) => answer.isCorrect);

		const recapAggregatedTmp: Map<string, { a: string[]; isCorrect: boolean[] }> = new Map();
		for (const answer of answers) {
			if (recapAggregatedTmp.has(answer.q)) {
				recapAggregatedTmp.get(answer.q)?.isCorrect.push(answer.isCorrect);
			} else {
				recapAggregatedTmp.set(answer.q, {
					a: answer.a,
					isCorrect: [answer.isCorrect]
				});
			}
		}

		recapAggregated = recapAggregatedTmp;
	});
</script>

<svelte:head>
	<title>Exercise {module?.name} finished | nihongo</title>
	<meta name="description" content="Japanese exercise finished" />
</svelte:head>

<h1 class="mdf-title1">
	<span aria-hidden="true">🎉</span> Congrats! You finished the exercise
</h1>
<p>
	You have {correctCards.length} correct answers over {exerciseCards.length} questions.
</p>
<a href="./" class="mdf-link">Go back to the exercise</a>
<p>Here is the recap :</p>
<table>
	<thead>
		<tr>
			<th>Question</th>
			<th>Answer</th>
			<th>Correct</th>
		</tr>
	</thead>
	<tbody>
		{#each Array.from(recapAggregated) as answer}
			<tr>
				<td>{answer[0]}</td>
				<td>{answer[1].a.join(' | ')}</td>
				<td>
					<span class="visually-hidden"
						>{answer[1].isCorrect.filter((c) => c).length} correct answers and ${answer[1].isCorrect.filter(
							(c) => !c
						).length} incorrect answers.</span
					>
					<span aria-hidden="true">
						{answer[1].isCorrect.map((correct) => (correct ? '🟢' : '🔴')).join(' ')}
					</span>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	p {
		margin: 0.5rem 0;
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
