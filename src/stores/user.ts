import type { User, UserData } from '$lib/types/user';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

export const currentUser = writable<{ user: User; data: UserData } | null>(
	null,
	browser ? me : undefined
);

export function me(
	set: (
		value: {
			user: User;
			data: UserData;
		} | null
	) => void
) {
	if (!localStorage.getItem('token')) {
		return;
	}
	fetch(`https://guillaume-getjapme.web.val.run/?token=${localStorage.getItem('token')}`)
		.then((res) => res.json())
		.then((user) => set(user?.user?.username ? user : null))
		.catch(() => {
			localStorage.removeItem('token');
			goto('/login');
		})
		.then(() => {
			goto('/profile');
		});
}
