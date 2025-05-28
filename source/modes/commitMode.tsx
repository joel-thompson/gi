import { render } from "ink";
import {
	diffTooBigMessage,
	handleCommit,
	noDiffMessage,
} from "../git/handleCommit.js";
import MySpinner from "../components/MySpinner.js";
import Message from "../components/Message.js";
import Confirmation from "../components/Confirmation.js";
import { addAllAndCommitWithDryRun } from "../git/git.js";
import React from "react";
import clipboardy from "clipboardy";

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
		verbose,
	});

	await clipboardy.write(`git commit -m "${message}"`);

	if (message === noDiffMessage || message === diffTooBigMessage) {
		render(<Message message={message} />);
		return;
	}

	if (yesCommit) {
		await addAllAndCommitWithDryRun({ message, dryRun });
		render(<Message message={message} />);
	} else {
		render(
			<Confirmation
				message={message}
				onConfirm={async () => {
					await addAllAndCommitWithDryRun({ message, dryRun });
				}}
			/>
		);
	}
}
