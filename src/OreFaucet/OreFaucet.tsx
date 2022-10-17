import { AccountType, OreId } from "oreid-js";
import { ApiCustodialNewAccountBodyParams, ApiCustodialNewAccountParams } from "oreid-js/dist/api";
import { useUser, useOreId } from "oreid-react"
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
    const oreId = useOreId()
    const[ eligibleSend, setEligibleSend ] = useState(false)
    const[ txOutput, setTxOutput ] = useState("None")

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

            setTxOutput( claimStatus )
            
            await checkEligibility()
        }
    }

    const create_custodial_account = async () => {
        const params: ApiCustodialNewAccountParams ={
            "accountType": AccountType.Pending,
            "userPassword": "2233",
            "name": "Tray Aikon Test",
            "userName": "traytest",
            "email": "tray+test0917b@aikon.com",
            "picture": "https://notavalidurl.io//nothing.jpg",
            "phone": "+12223334444",
            // "is_test_user": true
        }
        await oreId.custodialNewAccount(params)
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
                <Button
                    onClick={() =>
                      create_custodial_account()
                    }
                >Create Custodial Account!
            </Button>
        </>
    )
}