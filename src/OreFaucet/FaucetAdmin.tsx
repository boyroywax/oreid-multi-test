import React, { useEffect, useState } from "react"
import LoginButton from "oreid-login-button"
import { REACT_APP_TREASURY_OREID } from "src/constants"
import { getOreBalance, getSysBalance } from "src/helpers/eos"


const callFaucetAddOre = async (): Promise<string> => {
	const response = await fetch(
		`/api/faucet_add_ore`
	)

	return response.text()
}

const callFaucetAddSys = async (): Promise<string> => {
    const response = await fetch(
        `/api/faucet_add_sys`
    )

    return response.text()
}

const callFaucetAddCpu = async (): Promise<string> => {
    const response = await fetch(
        `/api/faucet_add_cpu`
    )

    return response.text()
}

const callFaucetAddNet = async (): Promise<string> => {
    const response = await fetch(
        `/api/faucet_add_net`
    )

    return response.text()
}

const callFaucetAddRam = async (): Promise<string> => {
    const response = await fetch(
        `/api/faucet_add_ram`
    )

    return response.text()
}

const callUserAddSys = async ( user: string ): Promise<string> => {
    const response = await fetch(
        `/api/user_add_sys?user=${user}`
    )
    return response.text()
}

const callFaucetAddSysSystem = async (): Promise<string> => {
    const response = await fetch(
        `/api/faucet_add_sys_system`
    )
    return response.text()
}

const callFaucetAddRamSystem = async (): Promise<string> => {
    const response = await fetch(
        `/api/faucet_add_ram_system`
    )
    return response.text()
}

export const FaucetAdmin: React.FC = () => {
    const addOre = async () => {
        const response = await callFaucetAddOre()
        console.log( `addFunds: ${response}` )
    }

    const addCpu = async () => {
        callFaucetAddSys()
        .then(async () => {
            const response = await callFaucetAddCpu()
            console.log( `Added 100 SYS Resources to CPU: \n${response}` )
        })
        .catch((error) => console.error(error))
    }

    const addNet = async () => {
        callFaucetAddSys()
        .then(async () => {
            const response = await callFaucetAddNet()
            console.log( `Added 100 SYS Resources to NET: \n${response}` )
        })
        .catch((error) => console.error(error))
    }

    const addRam = async () => {
        callFaucetAddSys()
        .then(async () => {
            const response = await callFaucetAddRam()
            console.log( `Added 100000 Bytes to RAM: \n${response}` )
        })
        .catch((error) => console.error(error))
    }

    const addSysSystem = async () => {
        await callFaucetAddSysSystem()
        .then(async (response) => {
            console.log( `Added 100 SYS to system.ore: \n${response}` )
        })
        .catch((error) => console.error(error))
    }

    const addRamSystem = async () => {
        await callFaucetAddRamSystem()
        .then(async (response) => {
            console.log( `Added 260000 Bytes RAM to system.ore: \n${response}` )
        })
        .catch((error) => console.error(error))
    }


    const [ faucetBalance, setFaucetBalance ] = useState("0.00")
    const [ faucetSysBalance, setFaucetSysBalance ] = useState("0.00")

    const fetchBalance = async ( user: string ): Promise<void> => {
        const balance = await getOreBalance( user || "" )
        setFaucetBalance( balance )

        const sysBalance = await getSysBalance( user || "" )
        setFaucetSysBalance( sysBalance )
    } 

    useEffect(() => {
        fetchBalance( REACT_APP_TREASURY_OREID )
    })

    return (
        <>
        <h1>Admin</h1>
        <h2>{ REACT_APP_TREASURY_OREID } Testnet Balance</h2>
        <h3><i>{ faucetBalance }</i> Test Tokens </h3>
        <h3><i>{ faucetSysBalance }</i> Test Tokens </h3>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <LoginButton
                                provider="oreid"
                                text="Add ORE to Faucet"
                                onClick={() => 
                                    addOre()
                                }
                            />
                        </td>
                        <td>Add 10,000 ORE Test Net Tokens</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>
                            <LoginButton
                                provider="oreid"
                                text="Add CPU to Faucet"
                                onClick={() => 
                                    addCpu()
                                }
                            />
                        </td>
                        <td>Add 100 SYS of CPU</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>
                        <LoginButton
                            provider="oreid"
                            text="Add NET to Faucet"
                            onClick={() => 
                                addNet()
                            }
                        />
                        </td>
                        <td>Add 100 SYS of NET</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>
                            <LoginButton
                                provider="oreid"
                                text="Add RAM to Faucet"
                                onClick={() => 
                                    addRam()
                                }
                            />
                        </td>
                        <td>Add 100,000 Bytes of RAM</td>
                    </tr>
                    <tr>
                        <td>
                        <LoginButton
                                provider="oreid"
                                text="Add RAM to system.ore"
                                onClick={() => 
                                    addRamSystem()
                                }
                            />
                        </td>
                        <td>Add 260,000 Bytes of RAM to system.ore</td>
                    </tr>
                    <tr>
                        <td>
                        <LoginButton
                                provider="oreid"
                                text="Add SYS to system.ore"
                                onClick={() => 
                                    addSysSystem()
                                }
                            />
                        </td>
                        <td>Add 100 SYS to system.ore</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}