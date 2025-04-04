<script lang="ts">
	import type { Module, ModuleType } from '$lib/types/module';

	let { data }: { data: { modules: (Module & { metaType: ModuleType })[] } } = $props();

	let search = $state('');
	const searchedModules = $derived(
		data.modules.filter((m) => m.name.toLowerCase().includes(search))
	);
</script>

<svelte:head>
	<title>Exercises | nihongo</title>
	<meta name="description" content="Japanese exercises" />
</svelte:head>

<h1 class="mdf-title1">Exercises</h1>
<div>
	<div class="search-container">
		<label for="search-input">Search for an exercise</label>
		<div class="search-input">
			<span aria-hidden="true" class="search-icon">🔎</span>
			<input
				id="search-input"
				type="search"
				placeholder="Search"
				bind:value={search}
				oninput={(e) => {
					search = (e.target as HTMLInputElement)?.value || '';
				}}
				autocomplete="off"
				autocorrect="off"
				class="mdf-input"
			/>
		</div>
	</div>
	<ul class="modules">
		{#each searchedModules as module}
			<li>
				<a href="/module/{module.id}/" class="mdf-link module">
					<div class="badges">
						{#each module.metaType?.tags as tag}
							<span class="badge">
								{#if tag.emoji}
									<span aria-hidden="true">{tag.emoji}&nbsp;</span>
								{/if}
								{tag.label}</span
							>
						{/each}
					</div>
					<div class="decoration" aria-hidden="true">
						{module.sign}
					</div>
					<div class="title-container">
						<h2 class="module-title">{module.name}</h2>
						<div class="arrow" aria-hidden="true">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
								<polygon
									fill="currentColor"
									points="11.293 4.707 17.586 11 4 11 4 13 17.586 13 11.293 19.293 12.707 20.707 21.414 12 12.707 3.293 11.293 4.707"
								/>
							</svg>
						</div>
					</div>
				</a>
			</li>
		{/each}
	</ul>
	{#if searchedModules.length === 0}
		<p class="no-result">No exercise was found for your search.</p>
		<button
			type="button"
			class="mdf-button"
			onclick={() => {
				search = '';
			}}
		>
			Reset the search
		</button>
	{/if}
</div>

<style>
	.modules {
		display: flex;
		flex-wrap: wrap;
		max-width: 1200px;
		gap: 1rem;
		margin: 1rem 0;
	}

	.module {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		background: var(--mdf-color-primary-light);
		background: linear-gradient(
			28deg,
			var(--mdf-color-primary) 10%,
			var(--mdf-color-primary-light) 100%
		);
		padding: 1rem;
		border-radius: 1.5rem;
		width: 350px;
		max-width: 100%;
		min-height: 150px;
		position: relative;
		box-shadow: 2px 2px 27px -32px rgba(0, 0, 0, 0.75);
		color: white;

		transition: padding ease-out 0.1s;
		text-decoration: none;
	}

	li:nth-child(even) > .module {
		background: var(--mdf-color-secondary-light);
		background: linear-gradient(
			28deg,
			var(--mdf-color-secondary) 10%,
			var(--mdf-color-secondary-light) 100%
		);
	}

	li:nth-child(even) .badge {
		background-color: var(--mdf-color-secondary-transparent);
	}

	li:nth-child(even) .decoration {
		color: var(--mdf-color-secondary-transparent);
	}

	.module:hover {
		background: var(--mdf-color-primary);
		padding: 1rem 1.3rem;
	}

	.module:hover .decoration {
		top: 15px;
	}

	.badges {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.badge {
		background-color: var(--mdf-color-primary-transparent);
		padding: 2px 5px;
		border-radius: 3px;
		font-size: 0.75rem;
	}

	.decoration {
		position: absolute;
		top: 10px;
		right: 10px;
		color: var(--mdf-color-primary-transparent);
		font-size: 4rem;
		line-height: 1;
		transition: top ease-out 0.1s;
	}

	.title-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.arrow {
		display: flex;
		align-items: center;
	}

	.search-container {
		margin: 1rem 0;
	}

	label {
		display: block;
		margin-bottom: 0.25rem;
	}

	.search-container > .search-input {
		width: 400px;
		max-width: 50%;
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-container > .search-input input {
		padding-left: 2rem;
	}

	.search-icon {
		position: absolute;
		left: 10px;
		transform: scale(1.2);
		filter: grayscale(1);
	}

	.no-result {
		margin: 1rem 0 0.5rem 0;
		color: var(--mdf-color-text-muted);
	}
</style>
