#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./app.js";

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
		},
	}
);

render(<App commit={cli.flags.commit} dryRun={cli.flags.dryRun} />);
