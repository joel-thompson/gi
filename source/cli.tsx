#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./app.js";
import { handleCommit } from "./git/handleCommit.js";
import Message from "./Message.js";
import MySpinner from "./MySpinner.js";

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
		},
	}
);

let message: string | null = null;

if (cli.flags.commit) {
	render(<MySpinner />);
	message = await handleCommit({
		dryRun: cli.flags.dryRun ?? false,
		verbose: cli.flags.verbose ?? false,
	});
	render(<Message message={message} />);
} else {
	render(
		<App
			flags={{
				dryRun: cli.flags.dryRun,
				commit: cli.flags.commit,
				verbose: cli.flags.verbose,
			}}
		/>
	);
}
