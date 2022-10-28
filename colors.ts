export interface Colors {
	[group: string]: {
		[key: string]: string;
	};
}

export const colors: Colors = {
	conifer: {
		"100": "#18201f",
		"200": "#1b2423",
		"300": "#232f2d",
		"400": "#2b3b37",
		"500": "#384d48",
		"600": "#455e59",
		"700": "#67837e",
		"800": "#a8c7c0",
		"900": "#dde5ed",
	},
	floral: {
		red: "#f37653",
		orange: "#ffc757",
		yellow: "#ffff57",
		green: "#a7e372",
		blue: "#79caf6",
		lilac: "#d488e7",
	},
};
