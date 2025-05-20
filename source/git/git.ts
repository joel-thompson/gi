import { simpleGit } from "simple-git";

const git = simpleGit();

export async function addAllAndCommit(message: string) {
	await git.add("./*").commit(message);
}

export default git;
