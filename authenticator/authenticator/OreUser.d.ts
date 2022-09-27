import { Chain, SignTransactionResponse, User } from 'universal-authenticator-library';
import { OreId } from "oreid-js";
export declare class OreUser extends User {
    readonly accountName: string;
    readonly requestPermission: string;
    private readonly pubKeys;
    private readonly ore;
    private readonly chain;
    transactioncomplete: any;
    api: any;
    rpc: any;
    constructor(chain: Chain, userAccount: string, pubKeys: string[], ore: OreId);
    /**
     * @param transaction  The transaction to be signed (a object that matches the RpcAPI structure).
     * @param options  Options for tapos fields
     */
    signTransaction(transaction: any, options: any): Promise<SignTransactionResponse>;
    signArbitrary(): Promise<string>;
    verifyKeyOwnership(): Promise<boolean>;
    getAccountName(): Promise<string>;
    getChainId(): Promise<string>;
    getKeys(): Promise<string[]>;
}
