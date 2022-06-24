import { useUser } from "oreid-react"
import React from "react"
import LoginButton from "oreid-login-button"


const callFaucetSend = async ({
	amount,
    recipient
}: {
	amount: string;
	recipient: string;
}): Promise<string> => {
	const response = await fetch(
		`/api/faucet_send?amount=${amount}&recipient=${recipient}`
	);

	return response.text()
};


export const OreFaucet: React.FC = () => {
    const user = useUser()

    const recipientAccount = user?.chainAccounts.find(
        (ca) => ca.chainNetwork === "ore_test"
    )

    const claimFaucet = async () => {
        const chainAccount = recipientAccount?.chainAccount || ""
        const claimStatus: string = await callFaucetSend({amount: "100", recipient: chainAccount})
        console.log( `claimStatus: ${claimStatus}` )
    }


    return (
        <>
            <h1>ORE TestNet Faucet</h1>
            <br />
            <LoginButton
                provider="oreid"
                text="Claim Faucet!"
                onClick={() => 
                    claimFaucet()
                }
            />
        </>
    )
}