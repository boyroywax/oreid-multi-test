import {Chain, SignTransactionResponse, User, UALErrorType} from 'universal-authenticator-library'
import { OreId, AuthProvider, ChainNetwork } from "oreid-js"
import {UALWaxError} from "./UALWaxError";


export class OreUser extends User {
    public readonly accountName: string;
    public readonly requestPermission: string;

    private readonly pubKeys: string[];
    private readonly ore: OreId;
    private readonly chain: Chain;
    public transactioncomplete: any;
    public api: any;
    public rpc: any;

    constructor(chain: Chain, userAccount: string, pubKeys: string[], ore: OreId) {
        super();

        this.accountName = userAccount;
        this.pubKeys = pubKeys;
        this.requestPermission = 'active';

        this.chain = chain;
        this.ore = ore;
        this.transactioncomplete = "None"

        // compatible features
        // this.api = wax.api;
        // this.rpc = wax.api && wax.api.rpc;
    }

    /**
     * @param transaction  The transaction to be signed (a object that matches the RpcAPI structure).
     * @param options  Options for tapos fields
     */
    async signTransaction(transaction1: any, options: any): Promise<SignTransactionResponse> {
        console.log(transaction1)
        console.log("transaction signing");
        try {

            await this.ore.popup.auth({provider: AuthProvider.Google}).then(
                ({user}) => { const user_ = user;


                if (this.accountName !== user_.accountName) {
                    throw new Error('Account does not match the requested permission');
                }

            });
            const transactionBody = {
                actions: [{
                    from: this.accountName,
                    to: "aikontest111",
                    value: 1
                }]
            }

            const transaction = await this.ore.createTransaction({
                chainAccount: this.accountName,
                chainNetwork: ChainNetwork.WaxTest,
                //@ts-ignore
                transaction: transactionBody.actions[0],
                signOptions: {
                    broadcast: true,
                    returnSignedTransaction: false,
                },
            })

            await this.ore.popup.sign({transaction}).then((result: any) => {
                const signedResponse: SignTransactionResponse ={
                    /** Was the transaction broadcast */
                    wasBroadcast: true,
                    /** The transcation id (optional) */
                    transactionId: "000912123",
                    /** The status of the transaction as returned by the RPC API (optional) */
                    status: "TestMode",
                    /** Set if there was an error */
                    error: {
                        /** The error code */
                        code: "Error",
                        /** The error message */
                        message: "Message",
                        /** The error name */
                        name: "Name"
                    },
                    /** The raw transaction object */
                    transaction: transaction.data
                }
                this.transactioncomplete = signedResponse
                
            })

            // } else {
            //     this.api = this.wax.api;
            //     this.rpc = this.wax.api.rpc;
            // }
            return this.transactioncomplete
            

            // const completedTransaction = await this.wax.api.transact(transaction, options);

            // return this.returnEosjsTransaction(options.broadcast !== false, completedTransaction);
        } catch (e) {
            throw new UALWaxError(
                'Unable to sign transaction',
                UALErrorType.Signing,
                null
            );
        }
    }

    async signArbitrary(): Promise<string> {
        throw new UALWaxError(
            'WAX Cloud Wallet does not currently support signArbitrary',
            UALErrorType.Unsupported, null
        );
    }

    async verifyKeyOwnership(): Promise<boolean> {
      throw new UALWaxError(
          'WAX Cloud Wallet does not currently support verifyKeyOwnership',
          UALErrorType.Unsupported, null
      );
    }

    async getAccountName(): Promise<string> {
        return this.accountName;
    }

    async getChainId(): Promise<string> {
        return this.chain.chainId;
    }

    async getKeys() {
        return this.pubKeys;
    }
}
