<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Module } from '$lib/types/module';

	let { module }: { module?: Module } = $props();

	let isJSONInvalid = $state(false);

	const DEFAULT_FORM = {
		module: {
			name: '',
			id: '',
			cards: [{ q: '', a: [''] }],
			sign: '',
			type: 'alpha'
		},
		token: localStorage.getItem('admin_token') || ''
	};

	let form = $derived<{ module: Omit<Module, 'meta'>; token?: string }>({
		module: module || DEFAULT_FORM.module,
		token: DEFAULT_FORM.token
	});

	let formError = $state<string[]>([]);

	function updateForm(updatedForm: { module: Omit<Module, 'meta'>; token?: string }) {
		formError = [];

		isJSONInvalid = false;
		form = { ...updatedForm };
	}

	function onUpdateToken(e: Event) {
		updateForm({ ...form, token: (e.target as HTMLInputElement).value });
	}

	function onUpdateName(e: Event) {
		const name = (e.target as HTMLInputElement).value;
		updateForm({
			...form,
			module: { ...form.module, name }
		});
	}

	function onUpdateType(e: Event) {
		const type = (e.target as HTMLInputElement).value;
		updateForm({
			...form,
			module: { ...form.module, type: type }
		});
	}

	function onAddCard() {
		updateForm({
			...form,
			module: { ...form.module, cards: [...form.module.cards, { q: '', a: [''] }] }
		});
	}

	function onAddAnswer(index: number) {
		updateForm({
			...form,
			module: {
				...form.module,
				cards: form.module.cards.map((c, i) => (i === index ? { ...c, a: [...c.a, ''] } : c))
			}
		});
	}

	function onUpdateQuestion(newValue: string, cardIndex: number) {
		updateForm({
			...form,
			module: {
				...form.module,
				cards: form.module.cards.map((c, i) => (i === cardIndex ? { ...c, q: newValue } : c))
			}
		});
	}

	function onUpdateAnswer(newValue: string, cardIndex: number, index: number) {
		updateForm({
			...form,
			module: {
				...form.module,
				cards: form.module.cards.map((c, i) =>
					i === cardIndex ? { ...c, a: c.a.map((ans, i) => (i === index ? newValue : ans)) } : c
				)
			}
		});
	}

	function onRemoveAnswer(cardIndex: number, answerIndex: number) {
		const newAnswers = [...form.module.cards[cardIndex].a];
		newAnswers.splice(answerIndex, 1);
		updateForm({
			...form,
			module: {
				...form.module,
				cards: form.module.cards.map((c, i) => (cardIndex === i ? { ...c, a: newAnswers } : c))
			}
		});
	}

	function onRemoveCard(index: number) {
		const newCards = [...form.module.cards];
		newCards.splice(index, 1);
		updateForm({
			...form,
			module: {
				...form.module,
				cards: newCards
			}
		});
	}

	function onChangeJson(e: Event) {
		const jsonStr = (e.target as HTMLInputElement).value;
		let json = null;
		isJSONInvalid = false;
		try {
			json = JSON.parse(jsonStr);
		} catch {
			console.error('Invalid JSON');
			isJSONInvalid = true;
		}
		if (json) {
			form = { ...form, module: { ...form.module, cards: json } };
		}
	}

	async function onDeleteModule() {
		if (!form.token) {
			formError = ['missing token'];
		}

		if (formError.length > 0) {
			return;
		}

		try {
			await fetch('https://guillaume--3acdb340760011f0afa40224a6c84d84.web.val.run', {
				method: 'DELETE',
				body: JSON.stringify({
					id: `${form.module.name.toLowerCase().split(' ').join('_')}_${form.module.type}`,
					token: form.token
				})
			});

			goto('/admin');
		} catch {
			formError = [...formError, 'something went wrong while deleting the module'];
		}
	}

	async function onSubmit() {
		if (!form.token) {
			formError = ['missing token'];
		}
		if (!form.module.name) {
			formError = [...formError, 'missing module name'];
		}
		if (form.module.cards.length === 0) {
			formError = [...formError, 'missing question'];
		}

		if (formError.length > 0) {
			return;
		}

		try {
			await fetch('https://guillaume--3acdb340760011f0afa40224a6c84d84.web.val.run', {
				method: 'PUT',
				body: JSON.stringify({
					module: {
						...form.module,
						id: `${form.module.name.toLowerCase().split(' ').join('_')}_${form.module.type}`
					},
					token: form.token
				})
			});

			localStorage.setItem('admin_token', form.token || '');

			if (!module) {
				updateForm({ ...DEFAULT_FORM });
			}
		} catch {
			formError = [...formError, 'something went wrong while updating the module data'];
		}
	}
</script>

<form onsubmit={onSubmit}>
	{#if formError.length > 0}
		{#each formError as error}
			<div class="mdf-block mdf-block-error form-error-block">{error}</div>
		{/each}
	{/if}
	<div class="mdf-input-control token-control">
		<label for="token">Token</label>
		<input
			type="password"
			id="token"
			value={form.token}
			oninput={onUpdateToken}
			class="mdf-input"
		/>
	</div>
	<div class="mdf-textarea-control json-control">
		<label for="json">JSON module</label>
		<textarea
			id="json"
			class="mdf-textarea json-textarea"
			value={JSON.stringify(form.module.cards)}
			oninput={onChangeJson}
		></textarea>
		{#if isJSONInvalid}
			<div class="mdf-block mdf-block-error error">Invalid JSON</div>
		{/if}
	</div>
	<div class="mdf-input-control name-control">
		<label for="name">Name</label>
		<input
			type="text"
			id="name"
			value={form.module.name}
			oninput={onUpdateName}
			class="mdf-input"
		/>
	</div>
	<div class="mdf-select-control type-control">
		<label for="type">Type</label>
		<select id="type" value={form.module.type} oninput={onUpdateType} class="mdf-select">
			<option value="alpha">Alphabet</option>
			<option value="h2e">Hiragana to English</option>
			<option value="e2r">English to Romaji</option>
		</select>
	</div>
	<ul>
		{#each form.module.cards as card, cardIndex}
			<li class="question">
				<div class="mdf-input-control">
					<label for="card-{card.q}"
						>Question{form.module.cards.length > 1 ? ` ${cardIndex + 1}` : ''}</label
					>
					<input
						type="text"
						class="mdf-input"
						id="card-{card.q}"
						value={card.q}
						oninput={(e: Event) =>
							onUpdateQuestion((e.target as HTMLInputElement).value, cardIndex)}
					/>
				</div>
				<ul>
					{#each card.a as answer, answerIndex}
						<li class="answers">
							<div class="mdf-input-control">
								<label for="answer-{card.q}-{answer}"
									>Answer{card.a.length > 1 ? ` ${answerIndex + 1}` : ''}</label
								>
								<input
									type="text"
									class="mdf-input"
									id="answer-{card.q}-{answer}"
									value={answer}
									oninput={(e: Event) =>
										onUpdateAnswer((e.target as HTMLInputElement).value, cardIndex, answerIndex)}
								/>
							</div>
							{#if card.a.length > 1}
								<button
									class="mdf-button"
									type="button"
									onclick={() => onRemoveAnswer(cardIndex, answerIndex)}>Remove answer</button
								>
							{/if}
						</li>
					{/each}
				</ul>
				<button class="mdf-button add-answer" type="button" onclick={() => onAddAnswer(cardIndex)}
					>Add answer</button
				>
				{#if form.module.cards.length > 1}
					<button class="mdf-button" type="button" onclick={() => onRemoveCard(cardIndex)}
						>Remove question</button
					>
				{/if}
			</li>
		{/each}
		<button class="mdf-button add-card" type="button" onclick={onAddCard}>Add question</button>
	</ul>

	<div class="submit-container">
		<button type="submit" class="mdf-button mdf-button-secondary">Submit module</button>
	</div>
</form>

{#if module}
	<button type="button" class="mdf-button mdf-button-tertiary" onclick={onDeleteModule}
		>Delete module</button
	>
{/if}

<style>
	.json-control,
	.json-textarea {
		width: 100%;
	}

	.form-error-block {
		margin: 1rem 0;
	}

	.token-control {
		margin: 1rem 0;
	}

	.type-control {
		margin-left: 0.5rem;
	}

	.answers {
		display: inline-flex;
		align-items: flex-end;
		gap: 0.5rem;
		margin-right: 1rem;
	}

	.question {
		margin: 1rem 0;
		padding-bottom: 1rem;

		border-bottom: 4px solid var(--mdf-color-secondary);
	}

	.add-answer,
	.add-card {
		margin: 0.5rem 0 1rem 0;
	}

	.name-control {
		margin: 1rem 0;
	}

	.error {
		margin-top: 1rem;
	}

	.submit-container {
		position: sticky;
		padding: 1rem 0;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: flex-end;
	}
</style>
