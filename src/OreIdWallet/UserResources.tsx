import { ChainNetwork, UserData } from "oreid-js";
import { useOreId, useUser } from "oreid-react";
import React, { useEffect, useState } from "react";
import LoginButton from "oreid-login-button"

import { 
    createAddCpuAndNetToUser,
    createAddCpuToUser,
    createAddNetToUser,
    createAddRamToUser
} from "../helpers/composeTransaction"
import { getSysBalance } from "src/helpers/eos";
import { Button } from "src/Button";


const callUserAddSys = async ( user: string ): Promise<string> => {
    const response = await fetch(
        `/api/user_add_sys?user=${user}`
    )
    return response.text()
}

export const UserResources: React.FC = () => {
    const user: UserData | undefined = useUser()
    const oreId = useOreId();
    const[ eligible, setEligible ] = useState(false)
    const oreChainType = 'ore_test'

    // get first ore (e.g. ore_test) account in user's wallet
    const signingAccount = user?.chainAccounts.find(
        (ca) => ca.chainNetwork === oreChainType
    )

    const chainAccount = signingAccount?.chainAccount || ""
    const chainNetwork = signingAccount?.chainNetwork || ChainNetwork.OreTest

    const checkEligibility = async (): Promise<void> => {
        let eligibility = false
        const balance = await getSysBalance(chainAccount)
        if (Number(balance.split(' ')[0]) <= 4.9999) {
            eligibility = true
        }
        setEligible( eligibility )
    }

    const transferSys = async ( user: string ) => {
        await checkEligibility()

        if (eligible) {
            callUserAddSys( user )
            .then( () => {
                console.log( `Added 5 SYS Resources to ${user}` )
            })
            .catch((error) => console.error(error))
            .finally(async () => await checkEligibility())
        }
    }

    const handleSign = async ( resource: string ) => {
        let transactionBody = undefined
        switch (resource) {
            case 'cpu':
                transactionBody = createAddCpuToUser(
                    chainAccount
                )
                break
            case 'net':
                transactionBody = createAddNetToUser(
                    chainAccount
                )
                break
            case 'ram':
                transactionBody = createAddRamToUser(
                    chainAccount
                )
                break
            case 'cpunet':
                transactionBody = createAddCpuAndNetToUser(
                    chainAccount
                )
                break
        }

        if (!transactionBody) {
            console.error("Transaction cannot be created")
            return
        }

        console.log("transactionBody:", transactionBody)

        const transaction = await oreId.createTransaction({
            chainAccount: chainAccount,
            chainNetwork: chainNetwork,
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
        
            await checkEligibility()
    }

    useEffect(() => {
        checkEligibility()
    })

    return (
        <>
            <h1>User Resources</h1>
            <table>
                <tbody>
                    <tr>
                        <td>
                            { eligible ? 
                                <LoginButton
                                    provider="oreid"
                                    text="Add SYS to User"
                                    onClick={() => {
                                        transferSys( chainAccount )
                                        checkEligibility()
                                    }}
                                /> :  
                                <Button
                                    onClick={() => 
                                        checkEligibility()
                                    }
                                >Already Claimed!</Button>
                                }
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