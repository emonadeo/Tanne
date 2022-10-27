import { renderFile } from "https://deno.land/x/mustache@v0.3.0/mod.ts";
import { walk } from "https://deno.land/std@0.160.0/fs/walk.ts";

import { colors } from "../colors.ts";

const encoder = new TextEncoder();
const dir = Deno.args[0] || "./";

for await (const walkEntry of walk(dir, {
	match: [/\.tpl/i],
})) {
	console.log(`Building ${walkEntry.path}`);
	const builtPath = walkEntry.path.replace(/\.tpl/i, "");
	const builtData = await renderFile(walkEntry.path, colors);
	await Deno.writeFile(builtPath, encoder.encode(builtData));
}
