import React, { useEffect, useState } from "react";
import { Text } from "ink";
// import { SimpleGitOptions } from "simple-git";

import { simpleGit } from "simple-git";
import { generateText } from "ai";
import openai from "./ai/openai.js";
import Spinner from "ink-spinner";
import fs from "fs";

type Props = {
	commit: boolean | undefined;
	dryRun: boolean | undefined;
};

// const options: Partial<SimpleGitOptions> = {
// 	baseDir: process.cwd(),
// 	binary: "git",
// 	maxConcurrentProcesses: 6,
// 	trimmed: false,
// };

// when setting all options in a single object

const gitSystemPrompt = `You are an expert at generating commit messages. 
Please provide a commit message for the changes in the diff. 
It should be a single line of text, no more than 50 characters. 

IMPORTANT: 
- ignore changes to lock files, node_modules, and other files that are not part of the project
- the commit message should be in the present tense
- use Conventional Commits
	If a change is in a readme, it should be a docs change
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

const DIFF_SIZE_LIMIT = 5000; // e.g., 5000 characters

export default function App({ commit = false, dryRun = false }: Props) {
	const [aiResponse, setAIResponse] = useState<string | null>(null);
	useEffect(() => {
		if (commit) {
			const fetchStatus = async () => {
				const git = simpleGit();
				const diff = await git.diff([
					".",
					":(exclude)pnpm-lock.yaml",
					":(exclude)package-lock.json",
					":(exclude)yarn.lock",
					":(exclude)node_modules",
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
					setAIResponse("No changes to commit");
					return;
				}

				if (wholeRepoStatus.length > DIFF_SIZE_LIMIT) {
					setAIResponse("Diff too big to process.");
					return;
				}
				// console.log("wholeRepoStatus", wholeRepoStatus);
				const { text } = await generateText({
					model: openai.responses("gpt-4.1-nano"),
					system: gitSystemPrompt,
					prompt: `
					Here is the diffs of the repository:
					${JSON.stringify(wholeRepoStatus, null, 2)}
					`,
				});
				setAIResponse(text);

				if (dryRun) {
					console.log("Dry run, no changes will be made");
					console.log("\n=== Git Diff ===\n");
					console.log(wholeRepoStatus);
					console.log("\n=== End Diff ===\n");
				} else {
					await git.add("./*").commit(text);
				}
			};
			fetchStatus();
		}
	}, [commit]);

	if (!commit) {
		return <Text>Must pass --commit flag to run the commit tool</Text>;
	}

	return (
		<Text>
			{aiResponse ? (
				<Text>
					message: <Text color="green">{aiResponse}</Text>
				</Text>
			) : (
				<Text>
					<Spinner />
				</Text>
			)}
		</Text>
	);
}
