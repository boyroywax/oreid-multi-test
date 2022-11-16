import { OreId, UserData } from "oreid-js";
import { useUser } from "oreid-react";
import React, { useEffect, useState } from "react";
import { Button } from "src/Button";
import { getAccount } from "../helpers/eos";

export const AccountInfo: React.FC = () => {
    const user: UserData | undefined = useUser()
    const[ accountInfo, setAccountInfo ] = useState("None")
    const[ cpuWeight, setCpuWeight ] = useState("None")
    const[ netWeight, setNetWeight ] = useState("None")
    const[ cpuMax, setCpuMax ] = useState("None")
    const[ cpuUsed, setCpuUsed ] = useState("None")
    const[ netMax, setNetMax ] = useState("None")
    const[ netUsed, setNetUsed ] = useState("None")
    const[ ramQuota, setRamQouta ] = useState("None")
    const[ ramUsed, setRamUsed ] = useState("None")

    const fetchAccountInfo = async (user: UserData | undefined): Promise<void> => {
        try {
            const accountInfo = await getAccount( user?.accountName || "" )
            setAccountInfo( JSON.stringify( accountInfo ) )
            setCpuWeight( accountInfo.cpu_weight )
            setNetWeight( accountInfo.net_weight )
            setRamQouta( accountInfo.ram_quota )
            setRamUsed ( accountInfo.ram_usage )
            setCpuMax( accountInfo.cpu_limit.max )
            setCpuUsed( accountInfo.cpu_limit.used )
            setNetMax( accountInfo.net_limit.max )
            setNetUsed( accountInfo.net_limit.used )
        }
        catch (e) {
            console.error(e)
        }
    } 

    useEffect(() => {
        fetchAccountInfo( user )
    })

    return (
        <>
            <h2>{ user?.accountName } Account Info</h2>
            <Button
                onClick={() => fetchAccountInfo( user )}
            >
                Update AccountInfo
            </Button>
            <p>{ accountInfo } </p>
            <table>
                <thead>
                    <tr>
                        <td>
                            Resource
                        </td>
                        <td>
                            Used
                        </td>
                        <td>
                            Max
                        </td>
                        <td>
                            Weight
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            CPU
                        </td>
                        <td>
                            { cpuUsed }
                        </td>
                        <td>
                            { cpuMax }
                        </td>
                        <td>
                            { cpuWeight }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            NET
                        </td>
                        <td>
                            { netUsed }
                        </td>
                        <td>
                            { netMax }
                        </td>
                        <td>
                            { netWeight }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            RAM
                        </td>
                        <td>
                            { ramUsed }
                        </td>
                        <td>
                            { ramQuota }
                        </td>
                        <td>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    )

}