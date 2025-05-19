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
			commit: {
				alias: "c",
				type: "boolean",
			},
		},
	}
);

render(<App commit={cli.flags.commit} />);
