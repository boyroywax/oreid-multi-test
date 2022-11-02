"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OreUser = void 0;
const universal_authenticator_library_1 = require("universal-authenticator-library");
const oreid_js_1 = require("oreid-js");
const UALOreError_1 = require("./UALOreError");
class OreUser extends universal_authenticator_library_1.User {
    // public rpc: any;
    constructor(chain, userAccount, pubKeys, ore) {
        super();
        this.accountName = userAccount;
        this.pubKeys = pubKeys;
        this.requestPermission = 'active';
        this.chain = chain;
        this.ore = ore;
        this.transactioncomplete = "None";
    }
    /**
     * @param transaction  The transaction to be signed (a object that matches the RpcAPI structure).
     * @param options  Options for tapos fields
     */
    async signTransaction(transactionBody, options) {
        console.log("transaction signing");
        try {
            const transaction = await this.ore.createTransaction({
                chainAccount: this.accountName,
                chainNetwork: oreid_js_1.ChainNetwork.WaxTest,
                //@ts-ignore
                transaction: transactionBody,
                signOptions: {
                    broadcast: true,
                    returnSignedTransaction: false,
                },
            });
            await this.ore.popup.sign({ transaction }).then((result) => {
                const signedResponse = {
                    /** Was the transaction broadcast */
                    wasBroadcast: true,
                    /** The transcation id (optional) */
                    transactionId: result.transactionId,
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
                };
                this.transactioncomplete = signedResponse;
            });
            return this.transactioncomplete;
        }
        catch (e) {
            throw new UALOreError_1.UALOreError('Unable to sign transaction', universal_authenticator_library_1.UALErrorType.Signing, null);
        }
    }
    async signArbitrary() {
        throw new UALOreError_1.UALOreError('ORE ID Wallet does not currently support signArbitrary', universal_authenticator_library_1.UALErrorType.Unsupported, null);
    }
    async verifyKeyOwnership() {
        throw new UALOreError_1.UALOreError('ORE ID does not currently support verifyKeyOwnership', universal_authenticator_library_1.UALErrorType.Unsupported, null);
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
