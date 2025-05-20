import React, { useEffect, useCallback, useState } from "react";
import { Text } from "ink";
import { useApp } from "ink";

import Spinner from "ink-spinner";
import { handleCommit } from "./git/handleCommit.js";

type Props = {
	commit: boolean | undefined;
	dryRun: boolean | undefined;
};

export default function App({ commit = false, dryRun = false }: Props) {
	const [aiResponse, setAIResponse] = useState<string | null>(null);
	const { exit } = useApp();

	const handleCommitCallback = useCallback(async () => {
		await handleCommit({ setAIResponse, dryRun });
	}, [setAIResponse, dryRun]);

	useEffect(() => {
		if (commit) {
			handleCommitCallback().finally(() => exit());
		} else {
			exit();
		}
	}, [commit, handleCommitCallback, exit]);

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
