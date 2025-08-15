import type { Module, ModuleType } from '$lib/types/module';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch('https://guillaume-getjapmodules.web.val.run');
	const { modules }: { meta: { types: ModuleType[] }; modules: Module[] } = await response.json();
	console.log(modules);
	return { modules: modules };
};
