<script lang="ts">
	import { currentUser } from '../../stores/user';
	import { page } from '$app/state';

	const isOnHome = $derived(page.route.id === '/');
	const isOnProfile = $derived(page.route.id === '/profile');
	const isOnLogin = $derived(page.route.id === '/login');

	let hasUser = $state(false);

	currentUser.subscribe((user) => {
		hasUser = Boolean(user);
	});
</script>

<nav>
	<ul class="container">
		<li>
			<a class={`header ${isOnHome ? 'active' : ''}`} href="/">
				<div class="logo" aria-hidden="true">🏡</div>
				<div class="mdf-muted subtitle">Home</div>
			</a>
		</li>

		{#if hasUser}
			<li>
				<a class={`header ${isOnProfile ? 'active' : ''}`} href="/profile">
					<div class="logo" aria-hidden="true">👨🏻‍💼</div>
					<div class="mdf-muted subtitle">Profile</div>
				</a>
			</li>
		{/if}

		{#if !hasUser}
			<li>
				<a class={`header ${isOnLogin ? 'active' : ''}`} href="/login">
					<div class="logo" aria-hidden="true">🗝️</div>
					<div class="mdf-muted subtitle">Login</div>
				</a>
			</li>
		{/if}
	</ul>
</nav>

<style>
	.container {
		display: flex;
		flex-direction: row;
		gap: 1rem;

		.header {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-decoration: none;
			color: black;
			box-shadow: 4px 8px 8px hsla(0, 0%, 0%, 0.046);
			background-color: var(--mdf-color-secondary-transparent);
			border: 2px solid var(--mdf-color-secondary-transparent-2);
			border-radius: 2rem;
			width: 7rem;
			height: 7rem;

			&:hover,
			&.active {
				background-color: var(--mdf-color-secondary-transparent-2);
			}

			.logo {
				font-size: 2.5rem;
			}

			.subtitle {
				margin-top: -0.4rem;
			}
		}
	}

	@media screen and (min-width: 63rem) {
		.container {
			flex-direction: column;
		}
	}
</style>
