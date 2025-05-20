import { render } from "ink";
import {
	diffTooBigMessage,
	handleCommit,
	noDiffMessage,
} from "../git/handleCommit.js";
import MySpinner from "../components/MySpinner.js";
import Message from "../components/Message.js";
import Confirmation from "../components/Confirmation.js";
import { addAllAndCommit } from "../git/git.js";
import React from "react";

export default async function commitMode({
	dryRun,
	verbose,
	yesCommit,
}: {
	dryRun: boolean;
	verbose: boolean;
	yesCommit: boolean;
}) {
	let message: string = "";
	render(<MySpinner />);
	message = await handleCommit({
		dryRun,
		verbose,
		yesCommit,
	});

	if (yesCommit || message === noDiffMessage || message === diffTooBigMessage) {
		render(<Message message={message} />);
	} else {
		render(
			<Confirmation
				message={message}
				onConfirm={async () => {
					if (dryRun) {
						console.log("Dry run, no changes will be made");
					} else {
						await addAllAndCommit(message);
					}
				}}
			/>
		);
	}
}
