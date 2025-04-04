import type { Answer, Module } from '$lib/types/module';
import { writable } from 'svelte/store';

export const currentModule = writable<Module>();
export const currentExerciseCards = writable<Module['cards']>([]);
export const currentExerciseAnswersRecap = writable<Answer[]>([]);
