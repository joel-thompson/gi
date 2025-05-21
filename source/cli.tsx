#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./app.js";
import commitMode from "./modes/commitMode.js";

const cli = meow(
	`
	Usage
	  $ gi

	Options
		--name  Your name

	Examples
	  $ gi --name=Jane
	  Hello, Jane
`,
	{
		importMeta: import.meta,
		flags: {
			dryRun: {
				alias: "d",
				type: "boolean",
			},
			commit: {
				alias: "c",
				type: "boolean",
			},
			verbose: {
				alias: "v",
				type: "boolean",
			},
			yesCommit: {
				alias: "y",
				type: "boolean",
			},
		},
	}
);

if (cli.flags.commit) {
	await commitMode({
		dryRun: cli.flags.dryRun ?? false,
		verbose: cli.flags.verbose ?? false,
		yesCommit: cli.flags.yesCommit ?? false,
	});
} else {
	render(
		<App
			flags={{
				dryRun: cli.flags.dryRun,
				commit: cli.flags.commit,
				verbose: cli.flags.verbose,
				yesCommit: cli.flags.yesCommit,
			}}
		/>
	);
}
