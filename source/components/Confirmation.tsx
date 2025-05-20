import React, { useState } from "react";
import { Text, Box, useInput, useApp } from "ink";

interface ConfirmationProps {
	message: string;
	onConfirm: () => void;
}

export default function Confirmation({
	message,
	onConfirm,
}: ConfirmationProps) {
	const { exit } = useApp();
	const [answered, setAnswered] = useState(false);

	useInput((input) => {
		if (answered) return;

		const key = input.toLowerCase();
		if (key === "y" || key === "n") {
			setAnswered(true);

			if (key === "y") {
				// Use setTimeout to ensure state update renders first
				setTimeout(() => {
					onConfirm();
					exit();
				}, 0);
			}
			if (key === "n") {
				setTimeout(() => {
					exit();
				}, 0);
			}
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
