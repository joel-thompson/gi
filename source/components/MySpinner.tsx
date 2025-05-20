import { Box } from "ink";
import Spinner from "ink-spinner";
import React from "react";

const MySpinner = () => {
	return (
		<Box paddingBottom={1} paddingTop={1}>
			<Spinner />
		</Box>
	);
};

export default MySpinner;
