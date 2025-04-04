<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Answer, Module, ModuleCard } from '$lib/types/module';

	import {
		currentExerciseAnswersRecap,
		currentExerciseCards,
		currentModule
	} from '../../../../stores/exercise';

	let module = $state<Module>();
	let exerciseCards = $state<Module['cards']>([]);

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

	let currentQIndex = $state(0);
	let currentCard = $derived(exerciseCards[currentQIndex]);
	let moduleDescription = $derived(
		module?.meta.types.find((t) => t.id === module?.type)?.description
	);
	let typedValue = $state('');
	let isWrong = $state(false);
	let isLastQ = $derived(currentQIndex === exerciseCards.length - 1);
	let submitButton: HTMLButtonElement | null = $state(null);
	let input: HTMLInputElement | null = $state(null);
	let answersRecap: Answer[] = [];

	function goToFinish() {
		currentExerciseAnswersRecap.set(answersRecap);
		const destination = location.pathname.split('/');
		destination.pop();
		destination.push('finished');
		goto(destination.join('/'));
	}

	function onSubmitForm(event: Event) {
		event.preventDefault();
		if (typedValue.trim().length === 0 || isWrong) {
			return;
		}

		isWrong = !isCorrectAnswer(currentCard, typedValue);

		answersRecap.push({
			q: currentCard.q,
			a: currentCard.a,
			isCorrect: !isWrong
		});

		if (isLastQ && !isWrong) {
			goToFinish();
			return;
		}

		if (isWrong) {
			submitButton?.focus();
		} else {
			nextQ();
		}

		typedValue = '';
	}

	function isCorrectAnswer(card: ModuleCard, a: string) {
		return card.a.map((answer) => answer.toLowerCase()).includes(a.toLowerCase());
	}

	function nextQ() {
		currentQIndex++;
		isWrong = false;
		input?.focus();
	}
</script>

<svelte:head>
	<title>Exercise {module?.name} questions | nihongo</title>
	<meta name="description" content="Japanese exercise questions" />
</svelte:head>

<div><a href="./" class="mdf-link">Go back to the exercise</a></div>
{#if module}
	<div role="status">
		{currentQIndex + 1}/{exerciseCards.length}
	</div>
	<div class="type-description">
		{moduleDescription}
	</div>
	<div class="question-container">
		<div class="question">{currentCard.q}</div>
		<form onsubmit={onSubmitForm}>
			<div class="form-row">
				<input
					type="text"
					bind:value={typedValue}
					tabIndex={isWrong ? -1 : undefined}
					bind:this={input}
					oninput={(e) => {
						typedValue = (e.target as HTMLInputElement).value;
					}}
					spellcheck="false"
					autocomplete="off"
					autocorrect="off"
					autocapitalize="off"
					aria-hidden={isWrong ? 'true' : undefined}
					class={`mdf-input ${isWrong ? 'visually-hidden' : ''}`}
					aria-label="${`Question : ${currentCard.q}`}"
				/>
				<button
					class={`mdf-button ${isWrong ? 'full-button' : undefined}`}
					type={isWrong ? 'button' : 'submit'}
					bind:this={submitButton}
					onclick={isWrong ? (isLastQ ? goToFinish : nextQ) : () => {}}
				>
					{#if isWrong}
						{#if isLastQ}
							Finish
						{:else}
							Next
						{/if}
					{:else}
						Submit
					{/if}
				</button>
			</div>
			<div role="alert">
				{#if isWrong}
					<p class="error">
						Wrong answer. You should have typed
						<span class="mdf-emphasis">{currentCard.a[0]}</span>.
					</p>
					{#if currentCard.indication}
						<p class="indication">Indication : {currentCard.indication}</p>
					{/if}
				{/if}
			</div>
		</form>
	</div>
{/if}

<style>
	.question-container {
		display: flex;
		flex-direction: column;
	}

	.question {
		font-size: 3rem;
	}

	.form-row {
		display: flex;
		align-items: center;
	}

	.form-row > input {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.form-row > .mdf-button:not(.full-button) {
		margin-left: 1rem;
	}

	.error {
		color: var(--mdf-color-error);
		margin-top: 0.5rem;
	}

	.indication {
		color: var(--mdf-color-info);
	}

	.type-description {
		margin: 0.5rem 0;
	}

	@media screen and (min-width: 40rem) {
		.question {
			font-size: 5rem;
		}
	}

	@media screen and (min-width: 60rem) {
		.question {
			font-size: 6rem;
		}
	}
</style>
