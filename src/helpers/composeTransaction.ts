import { toEosAsset,
    toEosEntityName,
    toEosSymbol ,
    isValidEosEntityName,
    toEosPrivateKey
} from "@open-rights-exchange/chainjs/dist/chains/eos_2/helpers"
import { EosTransaction } from '@open-rights-exchange/chainjs/dist/chains/eos_2'
import { EosActionStruct } from "@open-rights-exchange/chainjs/dist/chains/eos_2/models"

import {
    REACT_APP_TREASURY_OREID,
    REACT_APP_TREASURY_ACTIVE_PRIV_KEY,
    REACT_APP_APPOREID_ACTIVE_KEY
} from "../constants"
import { Chain, ChainFactory, ChainType } from "@open-rights-exchange/chainjs"
import { ChainEndpoint, ChainSettings } from "@open-rights-exchange/chainjs/dist/models"


function validateAddress(address: string): boolean {
    let isValid: boolean = false
    try {
        // check that the address is valid
        isValid = isValidEosEntityName(address)
        console.log('is validAddress: ' + isValid)
    }
    catch (err) {
        console.error("validateAddress: ", err)
    }

    return isValid
}

async function createOreConnection(): Promise<Chain | undefined> {
    // 
    // Create ORE Network Connection
    //
    const chainSettings: ChainSettings = {
        unusedAccountPublicKey: 'EOS5vf6mmk2oU6ae1PXTtnZD7ucKasA3rUEzXyi5xR7WkzX8emEma'
    }
    let oreChain = undefined

    const endpoints: ChainEndpoint[] = [
        { 
            url: "https://ore-staging.openrights.exchange/",
        },
        {
            url: 'https://ore-staging2.openrights.exchange/',
        },
    ]

    try {
        oreChain = new ChainFactory().create( ChainType.EosV2, endpoints, chainSettings )

        if (oreChain) {
            // Check that the network is running
            await oreChain.connect()
            console.log('ORE Network Connection: ' + oreChain.isConnected)
        }

    }
    catch (err) {
        console.error('oreConnection failed: ', err)
    }

    return oreChain
}

function createAddSysToTreasury(): EosActionStruct {
    const addSysToTreasury: EosActionStruct = {
        account: toEosEntityName('eosio.token'),
        name: 'transfer',
        authorization: [
            {
                actor: toEosEntityName('app.oreid'),
                permission: toEosEntityName('active'),
            },
        ],
        data: { 
            from: toEosEntityName('app.oreid'),
            to: toEosEntityName(REACT_APP_TREASURY_OREID),
            quantity:  toEosAsset("100.00", toEosSymbol('SYS'), 4),
            memo: "Add SYS from ORE Testnet Faucet"
        }
    }
    return addSysToTreasury
}

function createAddCpuToTreasury(): EosActionStruct {
    const addCpuToTreasury: EosActionStruct = {
        account: toEosEntityName('eosio'),
        name: 'delegatebw',
        authorization: [{
            actor: toEosEntityName(REACT_APP_TREASURY_OREID) ,
            permission: toEosEntityName('active'),
        }],
        data: {
            from: toEosEntityName(REACT_APP_TREASURY_OREID),
            receiver: toEosEntityName(REACT_APP_TREASURY_OREID),
            stake_net_quantity: toEosAsset("0.00", toEosSymbol('SYS'), 4),
            stake_cpu_quantity: toEosAsset("100.00", toEosSymbol('SYS'), 4),
            transfer: false,
        }
    }
    return addCpuToTreasury
}

function createAddNetToTreasury(): EosActionStruct {
    const addNetToTreasury: EosActionStruct = {
        account: toEosEntityName('eosio'),
        name: 'delegatebw',
        authorization: [{
            actor: toEosEntityName(REACT_APP_TREASURY_OREID) ,
            permission: toEosEntityName('active'),
        }],
        data: {
            from: toEosEntityName(REACT_APP_TREASURY_OREID),
            receiver: toEosEntityName(REACT_APP_TREASURY_OREID),
            stake_net_quantity: toEosAsset("100.00", toEosSymbol('SYS'), 4),
            stake_cpu_quantity: toEosAsset("0.00", toEosSymbol('SYS'), 4),
            transfer: false,
        }
    }
    return addNetToTreasury
}

function createAddRamToTreasury(): EosActionStruct {
    const addRamToTreasury: EosActionStruct = {
        account: toEosEntityName('eosio'),
        name: 'buyrambytes',
        authorization: [{
            actor: toEosEntityName(REACT_APP_TREASURY_OREID) ,
            permission: toEosEntityName('active'),
        }],
        data: {
            payer: toEosEntityName(REACT_APP_TREASURY_OREID),
            receiver: toEosEntityName(REACT_APP_TREASURY_OREID),
            bytes: 100000,
        }
    }
    return addRamToTreasury
}

function createTransferToTreasury(): EosActionStruct {
    const transferToTreasury: EosActionStruct = {
        account: toEosEntityName('eosio.token'),
        name: 'transfer',
        authorization: [
            {
                actor: toEosEntityName('app.oreid'),
                permission: toEosEntityName('active'),
            },
        ],
        data: { 
            from: toEosEntityName('app.oreid'),
            to: toEosEntityName(REACT_APP_TREASURY_OREID),
            quantity:  toEosAsset("10000.00", toEosSymbol('ORE'), 4),
            memo: "Transfer from ORE Testnet Faucet"
        }
    }
    return transferToTreasury
}

function createTransferTransaction(
    recipient: string,
    amount: string
    ): EosActionStruct {
    // 
    // Compose a transfer transaction action structure
    // 
    const transferTransaction: EosActionStruct = {
        account: toEosEntityName('eosio.token'),
        name: 'transfer',
        authorization: [
            {
                actor: toEosEntityName(REACT_APP_TREASURY_OREID),
                permission: toEosEntityName('active'),
            },
        ],
        data: { 
            from: toEosEntityName(REACT_APP_TREASURY_OREID),
            to: toEosEntityName(recipient),
            quantity:  toEosAsset(amount, toEosSymbol('ORE'), 4),
            memo: "Transfer from ORE Testnet Faucet"
        }
    }

    return transferTransaction
}

export function createAddSysToUser( user: string ): EosActionStruct {
    const addSysToUser: EosActionStruct = {
        account: toEosEntityName('eosio.token'),
        name: 'transfer',
        authorization: [
            {
                actor: toEosEntityName(REACT_APP_TREASURY_OREID),
                permission: toEosEntityName('active'),
            },
        ],
        data: { 
            from: toEosEntityName(REACT_APP_TREASURY_OREID),
            to: toEosEntityName(user),
            quantity:  toEosAsset("5.0000", toEosSymbol('SYS'), 4),
            memo: "Add SYS from ORE Testnet Faucet"
        }
    }
    return addSysToUser
}

export function createAddCpuAndNetToUser( user: string ): EosActionStruct {
    const addCpuAndNetToUser: EosActionStruct = {
        account: toEosEntityName('eosio'),
        name: 'delegatebw',
        authorization: [{
            actor: toEosEntityName(user) ,
            permission: toEosEntityName('active'),
        }],
        data: {
            from: toEosEntityName(user),
            receiver: toEosEntityName(user),
            stake_net_quantity: toEosAsset("2.50", toEosSymbol('SYS'), 4),
            stake_cpu_quantity: toEosAsset("2.50", toEosSymbol('SYS'), 4),
            transfer: false,
        }
    }
    return addCpuAndNetToUser
}

export function createAddCpuToUser( user: string ): EosActionStruct {
    const addCpuToUser: EosActionStruct = {
        account: toEosEntityName('eosio'),
        name: 'delegatebw',
        authorization: [{
            actor: toEosEntityName(user) ,
            permission: toEosEntityName('active'),
        }],
        data: {
            from: toEosEntityName(user),
            receiver: toEosEntityName(user),
            stake_net_quantity: toEosAsset("0.0000", toEosSymbol('SYS'), 4),
            stake_cpu_quantity: toEosAsset("5.0000", toEosSymbol('SYS'), 4),
            transfer: false,
        }
    }
    return addCpuToUser
}

export function createAddNetToUser( user: string ): EosActionStruct {
    const addNetToUser: EosActionStruct = {
        account: toEosEntityName('eosio'),
        name: 'delegatebw',
        authorization: [{
            actor: toEosEntityName(user) ,
            permission: toEosEntityName('active'),
        }],
        data: {
            from: toEosEntityName(user),
            receiver: toEosEntityName(user),
            stake_net_quantity: toEosAsset("5.00", toEosSymbol('SYS'), 4),
            stake_cpu_quantity: toEosAsset("0.00", toEosSymbol('SYS'), 4),
            transfer: false,
        }
    }
    return addNetToUser
}

export function createAddRamToUser( user: string ): EosActionStruct {
    const addRamToUser: EosActionStruct = {
        account: toEosEntityName('eosio'),
        name: 'buyrambytes',
        authorization: [{
            actor: toEosEntityName(user) ,
            permission: toEosEntityName('active'),
        }],
        data: {
            payer: toEosEntityName(user),
            receiver: toEosEntityName(user),
            bytes: 500,
        }
    }
    return addRamToUser
}

export async function createUserTransferTransaction(
    fromUser: string,
    toUser: string,
    amount: string
    ): Promise<EosActionStruct> {
    // 
    // Compose a transfer transaction action structure
    // 
    const transferTransaction: EosActionStruct = {
        account: toEosEntityName('eosio.token'),
        name: 'transfer',
        authorization: [
            {
                actor: toEosEntityName(fromUser),
                permission: toEosEntityName('active'),
            },
        ],
        data: { 
            from: toEosEntityName(fromUser),
            to: toEosEntityName(toUser),
            quantity:  toEosAsset(amount, toEosSymbol('ORE'), 4),
            memo: "Transfer from ORE Testnet Faucet"
        }
    }

    return transferTransaction
}

async function executeTxn(action: EosActionStruct[], privateKey: string): Promise<string> {
    let txResponse = "None"
    const oreConnection = await createOreConnection()
    console.log('ore status: ' + JSON.stringify(oreConnection))

    if (oreConnection) {
        const transaction: EosTransaction = (await oreConnection.new.Transaction()) as EosTransaction
        if (transaction) {
            transaction.actions = action
            await transaction.prepareToBeSigned()
            await transaction.validate()
            await transaction.sign( [toEosPrivateKey(privateKey)] )
            if ( transaction.missingSignatures ) { 
                console.log('missing sigs: ' + JSON.stringify(transaction.missingSignatures))
            }
    
            const rawTxResponse = await transaction.send()
            txResponse = rawTxResponse
        }
    }
    return txResponse
}

export async function transferFunds(amount: string, recipient: string): Promise<string> {
    let status: any = undefined
    const isValidAddress =  validateAddress( recipient )
    
    if (isValidAddress) {
        const txnAction = createTransferTransaction( recipient, String(amount) )
        const status = await executeTxn( [txnAction], REACT_APP_TREASURY_ACTIVE_PRIV_KEY )
        console.log( `transfer status: ${status}` )
    }

    return status
}

export async function addOreToTreasury(): Promise<string> {
    let status: string = "None"
    const txnAction = createTransferToTreasury()
    
    status = await executeTxn( [txnAction], REACT_APP_APPOREID_ACTIVE_KEY )
    console.log( `transfer status: ${status}` )
    
    return status
}

export async function addSysToTreasury(): Promise<string> {
    let status: string = "None"
    const txnAction = createAddSysToTreasury()
    try {
        status = await executeTxn( [txnAction], REACT_APP_APPOREID_ACTIVE_KEY )
        console.log( `adding 100 SYS to treasury: ${status}` )
    }
    catch (error) {
        console.error(error)
    }

    return status
}

export async function addCpuToTreasury(): Promise<string> {
    let status: string = "None"
    const txnAction = createAddCpuToTreasury()

    status = await executeTxn( [txnAction], REACT_APP_TREASURY_ACTIVE_PRIV_KEY )
    console.log( `added 100 SYS worth of CPU resources to treasury: ${status}` )

    return status
}

export async function addNetToTreasury(): Promise<string> {
    let status: string = "None"
    const txnAction = createAddNetToTreasury()

    status = await executeTxn( [txnAction], REACT_APP_TREASURY_ACTIVE_PRIV_KEY )
    console.log( `added 100 SYS worth of NET resources to treasury: ${status}` )

    return status
}

export async function addRamToTreasury(): Promise<string> {
    let status: string = "None"
    const txnAction = createAddRamToTreasury()

    status = await executeTxn( [txnAction], REACT_APP_TREASURY_ACTIVE_PRIV_KEY )
    console.log( `added 100000 Bytes worth of RAM resources to treasury: ${status}` )

    return status
}

export async function addSysToUser( user: string ): Promise<string> {
    let status: string = "None"
    const txnAction = createAddSysToUser( user )
    try {
        status = await executeTxn( [txnAction], REACT_APP_TREASURY_ACTIVE_PRIV_KEY )
        console.log( `adding 5 SYS to User: ${status}` )
    }
    catch (error) {
        console.error(error)
    }

    return status
}