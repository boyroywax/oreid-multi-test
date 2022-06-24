import React, { useState } from "react";
import LoginButton from "oreid-login-button"
import { useOreId, useUser } from "oreid-react";
import { createUserTransferTransaction } from "src/helpers/composeTransaction";

// interface Props {
// 	amount: string
// 	setAmount: (amount: string) => void
// 	toAddress: string
// 	setToAddress: (txAddress: string) => void
// }

export const SendTransfer: React.FC = () => {
	
    const [ amount, setAmount ] = useState("0.00")
    const [ toAddress, setToAddress ] = useState("Null")
	const userData = useUser();
    const oreId = useOreId();
    const oreChainType = 'ore_test'

	if (!userData) return null;

	const handleSign = async () => {
		console.error(undefined);
		
		// get first ore (e.g. ore_test) account in user's wallet
		const signingAccount = userData.chainAccounts.find(
			(ca) => ca.chainNetwork === oreChainType
		)

		if (!signingAccount) {
			console.error(
				`User does not have any accounts on ${oreChainType}`
			)
			return
		}

		const transactionBody = await createUserTransferTransaction(
			signingAccount.chainAccount,
			toAddress,
			amount
		)

		if (!transactionBody) {
			console.error("Transaction cannot be created")
			return
		}

		console.log("transactionBody:", transactionBody)

		const transaction = await oreId.createTransaction({
			chainAccount: signingAccount.chainAccount,
			chainNetwork: signingAccount.chainNetwork,
			//@ts-ignore
			transaction: transactionBody,
			signOptions: {
				broadcast: true,
				returnSignedTransaction: false,
			},
		})

		oreId.popup
			.sign({ transaction })
			.then((result: any) => {
				console.log( `result: ${result}`);
			})
			.finally(() => console.log( `txnid: ${transaction.data.transactionRecordId}`));
    }

    return (
		<div style={{ marginTop: 10, marginBottom: 20 }}>
			<h2>Transfer</h2>
			<div className="input-wrapper">
				<div>
					Amount
					<br />
					<input 
						name="amount"
						onChange={(e) => {
							e.preventDefault();
							setAmount(e.target.value);
						}} id={amount}></input>
				</div>
				<br />
				<div>
					Recipient
					<br />
					<input 
						name="toAddress"
						onChange={(e) => {
							e.preventDefault();
							setToAddress(e.target.value);
						}} id={toAddress}></input>
				</div>
			</div>
            <div className="App-button">
                <LoginButton
                    provider="oreid"
                    text="Make Transfer"
                    onClick={() => handleSign()}
                />
		    </div>
		</div>
	);
};
