"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OreUser = void 0;
const universal_authenticator_library_1 = require("universal-authenticator-library");
const oreid_js_1 = require("oreid-js");
const UALWaxError_1 = require("./UALWaxError");
class OreUser extends universal_authenticator_library_1.User {
    constructor(chain, userAccount, pubKeys, ore) {
        super();
        this.accountName = userAccount;
        this.pubKeys = pubKeys;
        this.requestPermission = 'active';
        this.chain = chain;
        this.ore = ore;
        this.transactioncomplete = "None";
        // compatible features
        // this.api = wax.api;
        // this.rpc = wax.api && wax.api.rpc;
    }
    /**
     * @param transaction1  The transaction to be signed (a object that matches the RpcAPI structure).
     * @param options  Options for tapos fields
     */
    async signTransaction(transaction1, options) {
        console.log("transaction signing");
        console.log(transaction1)
        console.log(options)
        const transaction = await this.ore.createTransaction({
            chainAccount: transaction1.actions[0].authorization[0].actor,
            chainNetwork: oreid_js_1.ChainNetwork.WaxMain,
            //@ts-ignore
            transaction: transaction1.actions[0],
            signOptions: {
                broadcast: true,
                returnSignedTransaction: false,
            },
        });
        await this.ore.popup.sign({ transaction }).then((result) => {
            console.log(result);
            const signedResponse = {
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
                // transaction: transaction1.data
            };
            this.transactioncomplete = signedResponse;
        });
        try {
            // } else {
            //     this.api = this.wax.api;
            //     this.rpc = this.wax.api.rpc;
            // }
            return this.transactioncomplete;
            // const completedTransaction = await this.wax.api.transact(transaction, options);
            // return this.returnEosjsTransaction(options.broadcast !== false, completedTransaction);
        }
        catch (e) {
            throw new UALWaxError_1.UALWaxError('Unable to sign transaction', universal_authenticator_library_1.UALErrorType.Signing, null);
        }
    }
    async signArbitrary() {
        throw new UALWaxError_1.UALWaxError('WAX Cloud Wallet does not currently support signArbitrary', universal_authenticator_library_1.UALErrorType.Unsupported, null);
    }
    async verifyKeyOwnership() {
        throw new UALWaxError_1.UALWaxError('WAX Cloud Wallet does not currently support verifyKeyOwnership', universal_authenticator_library_1.UALErrorType.Unsupported, null);
    }
    async getAccountName() {
        return this.accountName;
    }
    async getChainId() {
        return this.chain.chainId;
    }
    async getKeys() {
        return this.pubKeys;
    }
}
exports.OreUser = OreUser;
