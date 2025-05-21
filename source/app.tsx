import React from "react";
import { Box, Text } from "ink";

type Props = {
	flags: {
		dryRun: boolean | undefined;
		commit: boolean | undefined;
		verbose: boolean | undefined;
		yesCommit: boolean | undefined;
	};
};

export default function App({ flags }: Props) {
	return (
		<Box flexDirection="column" paddingBottom={1} paddingTop={1}>
			<Text>Flags passed: {JSON.stringify(flags)}</Text>
			<Text>No action taken. Please use one of the following options:</Text>
			<Text>--commit (-c) Generate and apply an AI commit message</Text>
			<Text>
				--dry-run (-d) Show what would be committed without making changes
			</Text>
			<Text>--verbose (-v) Show detailed output including full diff</Text>
			<Text>--yesCommit (-y) Skip confirmation and commit directly</Text>
		</Box>
	);
}
