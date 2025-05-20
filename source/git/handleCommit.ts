import { simpleGit } from "simple-git";
import { generateText } from "ai";
import openai from "../ai/openai.js";
import fs from "fs";

const gitSystemPrompt = `You are an expert at generating commit messages. 
Please provide a commit message for the changes in the diff. 
It should be a single line of text, no more than 50 characters. 

IMPORTANT: 
- ignore changes to lock files, node_modules, and other files that are not part of the project
- the commit message should be in the present tense
- use Conventional Commits
	IMPORTANT:If a change is in a readme, it should be a docs change
		examples:
		* feat: add new feature
		* fix: fix bug
		* chore: update dependencies
		* refactor: refactor code
		* style: style changes
		* perf: performance improvements
		* test: add tests
		* docs: update documentation
		* build: update build files
		* ci: update CI files
		* revert: revert changes
		* merge: merge changes
		* chore: other changes that don't fit into the other categories`;

const DIFF_SIZE_LIMIT = 5000;

export async function handleCommit({
	dryRun,
	verbose,
}: {
	dryRun: boolean;
	verbose: boolean;
}): Promise<string> {
	const git = simpleGit();
	const diff = await git.diff([
		".",
		":(exclude)pnpm-lock.yaml",
		":(exclude)package-lock.json",
		":(exclude)yarn.lock",
		":(exclude)node_modules",
		":(exclude)**/*.png",
		":(exclude)**/*.jpg",
		":(exclude)**/*.jpeg",
		":(exclude)**/*.gif",
		":(exclude)**/*.svg",
		":(exclude)**/*.webp",
		":(exclude)**/*.bmp",
		":(exclude)**/*.ico",
	]);

	// Get untracked files
	const untracked = await git.raw([
		"ls-files",
		"--others",
		"--exclude-standard",
	]);

	// For each untracked file, read its contents and format as a diff
	const untrackedFiles = untracked.split("\n").filter(Boolean);
	let untrackedDiff = "";
	for (const file of untrackedFiles) {
		const content = await fs.promises.readFile(file, "utf8");
		untrackedDiff += `\n--- a/${file}\n+++ b/${file}\n`;
		untrackedDiff += content
			.split("\n")
			.map((line) => `+${line}`)
			.join("\n");
	}

	const wholeRepoStatus = diff + untrackedDiff;

	if (wholeRepoStatus === "") {
		return "No changes to commit";
	}

	if (wholeRepoStatus.length > DIFF_SIZE_LIMIT) {
		return "Diff too big to process.";
	}

	const { text } = await generateText({
		model: openai.responses("gpt-4.1-nano"),
		system: gitSystemPrompt,
		prompt: `Here is the diffs of the repository:\n${wholeRepoStatus}`,
	});

	if (dryRun) {
		console.log("Dry run, no changes will be made");
		if (verbose) {
			console.log("\n=== Git Diff ===\n");
			console.log(wholeRepoStatus);
			console.log("\n=== End Diff ===\n");
		}
	} else {
		await git.add("./*").commit(text);
	}

	return text;
}
