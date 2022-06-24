import { UserData } from "oreid-js";
import { useUser } from "oreid-react";
import React, { useEffect, useState } from "react";
import { Button } from "src/Button";
import { getOreBalance, getSysBalance } from "../helpers/eos";

export const UserBalance: React.FC = () => {
    const user: UserData | undefined = useUser()
    const[ userBalance, setUserBalance ] = useState("0.00")
    const[ userSysBalance, setUserSysBalance ] = useState("0.00")

    // const fetchBalance = async (user: UserData | undefined): Promise<void> => {
    async function fetchBalance(user: UserData | undefined) {
        
        const balance = await getOreBalance(user?.accountName || "")
        setUserBalance( balance )

        const sysBalance = await getSysBalance( user?.accountName || "" )
        setUserSysBalance( sysBalance )
    } 


    useEffect(() => {
        fetchBalance(user)
    })

    return (
        <>
        <h2>{ user?.accountName } Testnet Balance</h2>
        <Button
            onClick={() => fetchBalance(user)}
        >
            Update Balance
        </Button>
        <h3><b><i>{ userBalance }</i></b> Test Tokens </h3>
        <h3><b><i>{ userSysBalance }</i></b> Test Tokens </h3>
        </>
    )

}