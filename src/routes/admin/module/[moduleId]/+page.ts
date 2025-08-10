import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const response = await fetch(`https://guillaume-getjapmodules.web.val.run?id=${params.moduleId}`);
	const res = await response.json();

	if (!res.name) {
		error(404, 'Not found');
	}

	return res;
};
