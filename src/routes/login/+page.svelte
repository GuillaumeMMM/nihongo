<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import type { User } from '$lib/types/user';
	import { currentUser, me } from '../../stores/user';

	let loggedIn = $state<boolean>(false);
	let error = $state('');

	currentUser.subscribe((u) => {
		loggedIn = Boolean(u);
	});

	let username = $state('');
	let password = $state('');

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
				goto('/');
			}
		} catch (e) {
			error = 'Something went wrong, try again later.';
			username = '';
			password = '';
		}
	}

	async function onLogout() {
		localStorage.removeItem('token');
		currentUser.set(null);
	}
</script>

<svelte:head>
	<title>Login | nihongo</title>
	<meta name="description" content="Login" />
</svelte:head>

{#if loggedIn}
	<p class="mdf-block mdf-block-info logout-message">Already logged in</p>
	<button type="button" class="mdf-button mdf-button-tertiary" onclick={onLogout}>Logout</button>
{/if}

{#if !loggedIn}
	<form onsubmit={onSubmit}>
		<div class="form">
			<div class="mdf-input-control">
				<label for="username">Username</label>
				<input id="username" type="text" class="mdf-input" bind:value={username} />
			</div>
			<div class="mdf-input-control">
				<label for="password">Password</label>
				<input id="password" type="password" class="mdf-input" bind:value={password} />
			</div>
		</div>
		<button type="submit" class="mdf-button">Login</button>
	</form>
{/if}

<style>
	.form {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.logout-message {
		margin-bottom: 1rem;
	}
</style>
