import { simpleGit } from "simple-git";
import { diffTooBigMessage, noDiffMessage } from "./handleCommit.js";

const git = simpleGit();

async function addAllAndCommit(message: string) {
	if (message === noDiffMessage || message === diffTooBigMessage) {
		return;
	}
	await git.add("./*").commit(message);
}

export async function addAllAndCommitWithDryRun({
	message,
	dryRun,
}: {
	message: string;
	dryRun: boolean;
}) {
	if (dryRun) {
		console.log("Dry run, no changes will be made");
	} else {
		await addAllAndCommit(message);
	}
}

export default git;
