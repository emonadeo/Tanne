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
	};
	const builtPath = walkEntry.path.replace(/\.tpl/i, "");
	const builtData = await renderFile(walkEntry.path, model);
	await Deno.writeFile(builtPath, encoder.encode(builtData));
}

function xmlColors() {
	const res: Colors = {};
	for (const group in colors) {
		const entries: [string, string][] = Object.entries(colors[group]);
		const mappedEntries = entries.map(([k, hex]) => [k, hex.substring(1)]);
		res[group] = Object.fromEntries(mappedEntries);
	}
	return res;
}
