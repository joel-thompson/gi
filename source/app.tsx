import React from "react";
import { Box, Text } from "ink";

type Props = {
	flags: {
		dryRun: boolean | undefined;
		commit: boolean | undefined;
		verbose: boolean | undefined;
	};
};

export default function App({ flags }: Props) {
	return (
		<Box flexDirection="column" gap={1} paddingBottom={1} paddingTop={1}>
			<Text>Flags passed: {JSON.stringify(flags)}</Text>
			<Text>
				No action taken. Please pass --commit to run the commit tool, optionally
				--dry-run to see what would be done without actually committing.
			</Text>
		</Box>
	);
}
