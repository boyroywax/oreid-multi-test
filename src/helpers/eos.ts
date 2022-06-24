import { JsonRpc } from 'eosjs'
import { GetTableRowsResult } from 'eosjs/dist/eosjs-rpc-interfaces';

export const oreTestNetEndpoint: { url: string } = {
    url: "https://ore-staging.openrights.exchange:443"
};

export async function getOreBalance(accountName: string): Promise<string> {
    let balance: string = "0.0000"
    const rpc = new JsonRpc(oreTestNetEndpoint.url)
    console.log(accountName)
    console.log(rpc)
    try {
        const balances = await rpc.get_currency_balance('eosio.token', accountName, 'ORE')
        console.log(balances)
        
        if (balances.length !== 0) {
            balance = balances[0]
        }
    }
    catch (err) {
        console.error(err)
    }
    return balance
}

export async function getSysBalance(accountName: string): Promise<string> {
    let balance: string = "0.0000"
    const rpc = new JsonRpc(oreTestNetEndpoint.url)
    console.log(accountName)
    console.log(rpc)
    try {
        const balances = await rpc.get_currency_balance('eosio.token', accountName, 'SYS')
        console.log(balances)
        
        if (balances.length !== 0) {
            balance = balances[0]
        }
    }
    catch (err) {
        console.error(err)
    }
    return balance
}


export async function getTransactionTableRows(accountName: string): Promise<GetTableRowsResult | undefined> {
    let transactionRows: GetTableRowsResult | undefined = undefined
    try {
        const rpc = new JsonRpc(oreTestNetEndpoint.url)
        const rows = await rpc.get_table_rows({
            json: true,
            code: 'eosio.token',
            scope: accountName,
            table: 'accounts',
            reverse: false,
            show_payer: false  
        })
        console.log(rows)
        transactionRows = rows
    }
    catch (err) {
        console.error(err)
    }

    return transactionRows
}

export async function getActionHistory(accountName: string): Promise<any> {
    try {
        const rpc = new JsonRpc(oreTestNetEndpoint.url)
        const actionHistory = await rpc.history_get_actions(accountName)
        return actionHistory.actions

    }
    catch (err) {
        console.error(err)
    }
}

export async function getAccount(accountName: string): Promise<any> {
    try {
        const rpc = new JsonRpc(oreTestNetEndpoint.url)
        const accountInfo = await rpc.get_account(accountName)
        return accountInfo
    }
    catch (err) {
        console.error(err)
    }
}
