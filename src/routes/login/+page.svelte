<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { currentUser, me } from '../../stores/user';

	let username = $state('');
	let password = $state('');
	let error = $state('');

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		try {
			const res = await fetch('https://guillaume-postjaplogin.web.val.run/', {
				method: 'POST',
				body: JSON.stringify({
					username,
					password
				})
			});

			const response = await res.json();

			if (response.message !== 'Login successful') {
				throw Error(response.message);
			}

			if (browser) {
				localStorage.setItem('token', response.token);
				await me(currentUser.set);
			}
		} catch (e) {
			error = 'Something went wrong, try again later.';
			username = '';
			password = '';
		}
	}
</script>

<h1 class="mdf-title1">Login</h1>
<form onsubmit={onSubmit}>
	<div class="mdf-input-control">
		<label for="username">Username</label>
		<input
			id="username"
			type="text"
			name="username"
			class="mdf-input"
			bind:value={username}
			onchange={(e) => {
				username = (e.target as HTMLInputElement).value;
			}}
			required
		/>
	</div>
	<div class="mdf-input-control">
		<label for="password">Password</label>
		<input
			id="password"
			type="password"
			name="password"
			class="mdf-input"
			bind:value={password}
			required
			onchange={(e) => {
				password = (e.target as HTMLInputElement).value;
			}}
		/>
	</div>
	<div role="alert">
		{#if error}
			<p class="mdf-block mdf-block-error">{error}</p>
		{/if}
	</div>
	<button class="mdf-button submit" type="submit">Log in</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 1rem 0;
	}

	.submit {
		margin-top: 1rem;
		width: fit-content;
	}
</style>
