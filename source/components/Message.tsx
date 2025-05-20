import React from "react";
import { Text, Box } from "ink";
import Spinner from "ink-spinner";

type Props = {
	message: string | null;
};

export default function Message({ message }: Props) {
	return (
		<Box paddingBottom={1} paddingTop={1}>
			{message ? (
				<Text>
					message: <Text color="green">{message}</Text>
				</Text>
			) : (
				<Spinner />
			)}
		</Box>
	);
}
