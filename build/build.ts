import { renderFile } from "https://deno.land/x/mustache@v0.3.0/mod.ts";
import { walk } from "https://deno.land/std@0.160.0/fs/walk.ts";

import { colors, Colors } from "../colors.ts";

const encoder = new TextEncoder();
const dir = Deno.args[0] || "./";

for await (const walkEntry of walk(dir, {
	match: [/\.tpl/i],
})) {
	console.log(`Building ${walkEntry.path}`);
	const model = {
		...colors,
		_xml: xmlColors(),
		_rgba: rgbaColors(),
	};
	const builtPath = walkEntry.path.replace(/\.tpl/i, "");
	const builtData = await renderFile(walkEntry.path, model);
	await Deno.writeFile(builtPath, encoder.encode(builtData));
}

function xmlColors() {
	return transformColor((hex) => hex.substring(1));
}

function rgbaColors() {
	return transformColor((hex) => {
		const _hex = hex.substring(1);
		const rgb = _hex.match(/.{2}/g)?.map((v) => {
			const num = parseInt(v, 16);
			const normalized = num / 255;
			// Don't include decimals for 0 and 1
			if (normalized === 0 || normalized === 1) {
				return normalized.toString();
			}
			// Include 6 decimal digits
			return normalized.toFixed(6);
		});
		// Return #ff0000 (red) if RegEx fails
		if (!rgb) {
			return "1 0 0 1";
		}
		return rgb.join(" ").concat(" 1");
	});
}

// Helper function to apply a map function to hex colors of format #??????
function transformColor(map: (hex: string) => string): Colors {
	const res: Colors = {};
	for (const group in colors) {
		const entries: [string, string][] = Object.entries(colors[group]);
		const mappedEntries = entries.map(([k, hex]) => [k, map(hex)]);
		res[group] = Object.fromEntries(mappedEntries);
	}
	return res;
}
