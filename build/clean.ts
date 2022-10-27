import { walk } from "https://deno.land/std@0.160.0/fs/walk.ts";

const dir = Deno.args[0] || "./";

let n = 0;
for await (const walkEntry of walk(dir, {
	match: [/\.tpl/i],
})) {
	const builtPath = walkEntry.path.replace(/\.tpl/i, "");
	try {
		await Deno.remove(builtPath);
		++n;
	} catch (e) {
		if (!(e instanceof Deno.errors.NotFound)) {
			console.log(e);
		}
	}
}

console.log(`Removed ${n} files.`);
