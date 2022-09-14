import React, { useCallback, useState } from "react";
import { txOutputContext } from "./FooterContext";

interface Props {}
export const txOutputProvider: React.FC<Props> = ({ children }) => {
	const [txOutput, setTxOutputContext] = useState<string | undefined>(undefined);

	const setTxOutput = useCallback(
		(newTxOutput: string | undefined | Error) => {
			if (typeof newTxOutput === "object") {
				setTxOutputContext(newTxOutput.message);
				return;
			}
			setTxOutputContext(newTxOutput);
		},
		[setTxOutputContext]
	);

	return (
		<txOutputContext.Provider
			value={{
				txOutput,
				setTxOutput,
			}}
		>
			{children}
		</txOutputContext.Provider>
	);
};