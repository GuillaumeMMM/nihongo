import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import type { User } from '$lib/types/user';

export const currentUser = writable<User | null>(
    null,
    browser ? me : undefined
);

export function me(
    set: (
        value: User | null
    ) => void
) {
    if (!localStorage.getItem('token')) {
        return;
    }
    fetch(`https://guillaume-getjapme.web.val.run/?token=${localStorage.getItem('token')}`)
        .then((res) => res.json())
        .then((user) => {
            set(user?.user?.username ? user : null)
        })
        .catch(() => {
            localStorage.removeItem('token');
            goto('/login');
        });
}