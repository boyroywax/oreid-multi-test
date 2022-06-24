import { UserData } from "oreid-js";
import { useOreId, useUser } from "oreid-react";
import React from "react";
import LoginButton from "oreid-login-button"

import { 
    createAddCpuAndNetToUser,
    createAddCpuToUser,
    createAddNetToUser,
    createAddRamToUser
} from "../helpers/composeTransaction"


const callUserAddSys = async ( user: string ): Promise<string> => {
	const response = await fetch(
		`/api/user_add_sys?user=${user}`
	)

	return response.text()
}

export const UserResources: React.FC = () => {
    const user: UserData | undefined = useUser()
    const oreId = useOreId();
    const oreChainType = 'ore_test'

	if (!user) return null;

    const transferSys = async ( user: string ) => {
        callUserAddSys( user )
        .then( () => {
            console.log( `Added 5 SYS Resources to ${user}` )
        })
        .catch((error) => console.error(error))
    }

    // get first ore (e.g. ore_test) account in user's wallet
    const signingAccount = user.chainAccounts.find(
        (ca) => ca.chainNetwork === oreChainType
    )

    if (!signingAccount) {
        console.error(
            `User doesn not have any accounts on ${oreChainType}`
        )
        return null;
    }

    const handleSign = async ( resource: string ) => {
        console.error(undefined);
        
        let transactionBody = undefined
        switch (resource) {
            case 'cpu':
                transactionBody = createAddCpuToUser(
                    signingAccount.chainAccount
                )
                break
            case 'net':
                transactionBody = createAddNetToUser(
                    signingAccount.chainAccount
                )
                break
            case 'ram':
                transactionBody = createAddRamToUser(
                    signingAccount.chainAccount
                )
                break
            case 'cpunet':
                transactionBody = createAddCpuAndNetToUser(
                    signingAccount.chainAccount
                )
                break
        }


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
        <>
            <h1>User Resources</h1>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <LoginButton
                                provider="oreid"
                                text="Add SYS to User"
                                onClick={() => 
                                    transferSys( signingAccount.chainAccount )
                                }
                            />
                        </td>
                        <td>Add 5 SYS Test Net Tokens</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>
                            <LoginButton
                                provider="oreid"
                                text="Add CPU and NET"
                                onClick={() => 
                                    handleSign( 'cpunet' )
                                }
                            />
                        </td>
                        <td>Add 2.5 SYS of CPU and 2.5 SYS of NET</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>
                            <LoginButton
                                provider="oreid"
                                text="Add CPU to User"
                                onClick={() => 
                                    handleSign( 'cpu' )
                                }
                            />
                        </td>
                        <td>Add 5 SYS of CPU</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>
                        <LoginButton
                            provider="oreid"
                            text="Add NET to User"
                            onClick={() => 
                                handleSign( 'net' )
                            }
                        />
                        </td>
                        <td>Add 5 SYS of NET</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>
                            <LoginButton
                                provider="oreid"
                                text="Add RAM to User"
                                onClick={() => 
                                    handleSign( 'ram' )
                                }
                            />
                        </td>
                        <td>Add 500 Bytes of RAM</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}