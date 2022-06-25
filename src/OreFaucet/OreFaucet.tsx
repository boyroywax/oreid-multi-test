import { useUser } from "oreid-react"
import React, { useEffect, useState } from "react"
import { Button } from "src/Button";
import { getOreBalance } from "src/helpers/eos";


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
    const[ eligibleSend, setEligibleSend ] = useState(false)

    const recipientAccount = user?.chainAccounts.find(
        (ca) => ca.chainNetwork === "ore_test"
    )

    const chainAccount = recipientAccount?.chainAccount || ""

    const checkEligibility = async (): Promise<void> => {
        let eligibility = false
        const balance = await getOreBalance(chainAccount || "")
        if (Number(balance.split(' ')[0]) <= 99) {
            eligibility = true
        }
        setEligibleSend( eligibility )
    }

    const claimFaucet = async () => {
        await checkEligibility()

        if (eligibleSend) {
            const claimStatus: string = await callFaucetSend({amount: "100", recipient: chainAccount})
            console.log( `claimStatus: ${claimStatus}` )
            await checkEligibility()
        }
    }

    useEffect(() => {
        checkEligibility()
    })

    return (
        <>
            <h1>ORE TestNet Faucet</h1>
            <br />
            { eligibleSend ?
                <Button
                    onClick={() => 
                        claimFaucet()
                    }
                > Claim Now </Button> : 
                <Button
                    onClick={() =>
                        checkEligibility()
                    }
                >Already Claimed!
                </Button>
            }
        </>
    )
}