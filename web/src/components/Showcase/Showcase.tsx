import "./Showcase.scss";

import imgJetbrains from "../../assets/apps/jetbrains.svg";
import imgVSCode from "../../assets/apps/vscode.svg";
import imgXcode from "../../assets/apps/xcode.svg";

import { Dynamic } from "solid-js/web";
import { Component, createSignal, For } from "solid-js";

interface Editor {
	name: string;
	icon: Component;
	showcase: string;
}

const editors: Editor[] = [
	{
		name: "JetBrains",
		icon: imgJetbrains,
		showcase: "JETBRAINS",
	},
	{
		name: "Visual Studio Code",
		icon: imgVSCode,
		showcase: "VSCODE",
	},
];

export default function () {
	const [selected, select] = createSignal(0);

	return (
		<section class="grid showcase">
			<ol role="list">
				<For each={editors}>
					{(editor, i) => (
						<li classList={{ selected: selected() === i() }}>
							<button onClick={() => select(i)}>
								<Dynamic component={editor.icon}></Dynamic>
							</button>
						</li>
					)}
				</For>
			</ol>
			<div id="showcase-placeholder">
				<h1>{editors[selected()].showcase}</h1>
			</div>
		</section>
	);
}
