import { createContext } from "react"


export const txOutputContext = createContext<{
	txOutput: string | undefined,
	setTxOutput: (txOutput: string | undefined) => void
}>({
	txOutput: "",
	setTxOutput: () => undefined
})