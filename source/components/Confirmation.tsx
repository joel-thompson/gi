import React, { useState } from "react";
import { Text, Box, useInput } from "ink";

interface ConfirmationProps {
	message: string;
	onConfirm: () => void;
}

export default function Confirmation({
	message,
	onConfirm,
}: ConfirmationProps) {
	// const { exit } = useApp();
	const [answered, setAnswered] = useState(false);

	useInput((input) => {
		if (input.toLowerCase() === "y") {
			setAnswered(true);
			onConfirm();
			// exit();
			return;
		}

		if (input.toLowerCase() === "n") {
			setAnswered(true);
			// exit();
			return;
		}
	});

	return (
		<Box flexDirection="column" paddingTop={1} paddingBottom={1}>
			<Text>
				message: <Text color="green">{message}</Text>
			</Text>
			{!answered && <Text>Press Y to confirm or N to cancel</Text>}
		</Box>
	);
}
