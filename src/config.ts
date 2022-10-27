export const SITE = {
	title: 'Keebfolio',
	description: 'A awesome mechanical keyboard list.',
	defaultLanguage: 'en_US',
};

export const OPEN_GRAPH = {
	image: {
		src: 'https://github.com/BenRoe/awesome-mechanical-keyboard/blob/master/public/default-og-image.png?raw=true',
		alt:
			'astro logo on a starry expanse of space,' +
			' with a purple saturn-like planet floating in the right foreground',
	},
	// twitter: '',
};

// This is the type of the frontmatter you put in the docs markdown files.
export type Frontmatter = {
	title: string;
	description: string;
	layout: string;
	image?: { src: string; alt: string };
	dir?: 'ltr' | 'rtl';
	ogLocale?: string;
	lang?: string;
};

export const KNOWN_LANGUAGES = {
	English: 'en',
} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_EDIT_URL = `https://github.com/BenRoe/awesome-mechanical-keyboard`;

export const COMMUNITY_INVITE_URL = `https://github.com/BenRoe/awesome-mechanical-keyboard/discussions`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
	indexName: 'keebfolio',
	appId: 'E65BH61QN6',
	apiKey: 'e7521b417b0698781223223817233741',
};

export type Sidebar = Record<
	typeof KNOWN_LANGUAGE_CODES[number],
	Record<string, { text: string; link: string }[]>
>;
export const SIDEBAR: Sidebar = {
	en: {
		'Keyboards': [
			{ text: 'Staggered', link: 'en/staggered' },
			{ text: 'Ortho', link: 'en/ortholinear' },
			{ text: 'Split', link: 'en/split' },
			{ text: 'Other', link: 'en/other' },
		],
		'-------': [
			{ text: 'Firmware', link: 'en/firmware' },
			{ text: 'Miscellaneous', link: 'en/miscellaneous' },
			{ text: 'Tools', link: 'en/tools' },
			{ text: 'Tutorials', link: 'en/tutorials' }
		],
	},
};
