import React, { useEffect, useState } from "react";
import { Text } from "ink";
// import { SimpleGitOptions } from "simple-git";

import { simpleGit } from "simple-git";
import { generateText } from "ai";
import openai from "./ai/openai.js";
import Spinner from "ink-spinner";

type Props = {
	commit: boolean | undefined;
};

// const options: Partial<SimpleGitOptions> = {
// 	baseDir: process.cwd(),
// 	binary: "git",
// 	maxConcurrentProcesses: 6,
// 	trimmed: false,
// };

// when setting all options in a single object

export default function App({ commit = false }: Props) {
	const [aiResponse, setAIResponse] = useState<string | null>(null);
	useEffect(() => {
		if (commit) {
			const fetchStatus = async () => {
				const git = simpleGit();
				const wholeRepoStatus = await git.diffSummary();
				// console.log("wholeRepoStatus", wholeRepoStatus);
				const { text } = await generateText({
					model: openai.responses("gpt-4o-mini"),
					system:
						"You are an expert at generating commit messages. Please provide a commit message for the changes in the diff. It should be a single line of text, no more than 50 characters. IMPORTANT: ignore changes to lock files, node_modules, and other files that are not part of the project.",
					prompt: `
					Here is the diffs of the repository:
					${JSON.stringify(wholeRepoStatus, null, 2)}
					`,
				});
				setAIResponse(text);

				await git.add("./*").commit(text);
			};
			fetchStatus();
		}
	}, [commit]);

	return (
		<Text>
			{aiResponse ? (
				<Text>Commit message: {aiResponse}</Text>
			) : (
				<Text>
					<Spinner />
				</Text>
			)}
		</Text>
	);
}
