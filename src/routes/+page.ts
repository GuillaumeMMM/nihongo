import type { Module, ModuleType } from '$lib/types/module';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch('https://guillaume-getjapmodules.web.val.run');
	const { meta, modules }: { meta: { types: ModuleType[] }; modules: Module[] } =
		await response.json();

	return {
		modules: modules.map((m) => ({ ...m, metaType: meta.types.find((t) => t.id === m.type) }))
	};
};
