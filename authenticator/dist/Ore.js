"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OreUal = void 0;
const universal_authenticator_library_1 = require("universal-authenticator-library");
const oreid_js_1 = require("oreid-js");
const oreid_webpopup_1 = require("oreid-webpopup");
const OreUser_1 = require("./OreUser");
const OreIdIcon_1 = require("./OreIdIcon");
class OreUal extends universal_authenticator_library_1.Authenticator {
    constructor(chains, options) {
        super(chains, options);
        this.users = [];
        this.initiated = false;
        // * Initialize OreId
        this.oreId = new oreid_js_1.OreId({
            appName: "Polygon ORE-ID Sample App",
            appId: "t_89c6f4f83ad84d0ca52c832cf4442651",
            oreIdUrl: "https://service.oreid.io",
            plugins: {
                popup: (0, oreid_webpopup_1.WebPopup)(),
            },
        });
        this.apiSigner = options && options.apiSigner;
    }
    /**
     * Called after `shouldRender` and should be used to handle any async actions required to initialize the authenticator
     */
    async init() {
        await this.oreId.init().then(() => {
            console.log("ORe ID Initialized");
        });
        this.initiated = true;
    }
    /**
     * Resets the authenticator to its initial, default state then calls `init` method
     */
    reset() {
        this.oreId = undefined;
        this.users = [];
        this.initiated = false;
        this.session = undefined;
    }
    /**
     * Returns true if the authenticator has errored while initializing.
     */
    isErrored() {
        return false;
    }
    /**
     * Returns a URL where the user can download and install the underlying authenticator
     * if it is not found by the UAL Authenticator.
     */
    getOnboardingLink() {
        return 'https://oreid.io/';
    }
    /**
     * Returns error (if available) if the authenticator has errored while initializing.
     */
    getError() {
        return null;
    }
    /**
     * Returns true if the authenticator is loading while initializing its internal state.
     */
    isLoading() {
        return !this.initiated;
    }
    /**
     * Returns the style of the Button that will be rendered.
     */
    getStyle() {
        return {
            icon: OreIdIcon_1.OreIdIcon,
            text: 'ORE ID Wallet',
            textColor: 'white',
            background: '#4e19eb'
        };
    }
    /**
     * Returns whether or not the button should render based on the operating environment and other factors.
     * ie. If your Authenticator App does not support mobile, it returns false when running in a mobile browser.
     */
    shouldRender() {
        return true;
    }
    /**
     * Returns whether or not the dapp should attempt to auto login with the Authenticator app.
     * Auto login will only occur when there is only one Authenticator that returns shouldRender() true and
     * shouldAutoLogin() true.
     */
    shouldAutoLogin() {
        return false;
    }
    /**
     * Returns whether or not the button should show an account name input field.
     * This is for Authenticators that do not have a concept of account names.
     */
    async shouldRequestAccountName() {
        return false;
    }
    /**
     * Returns the amount of seconds after the authentication will be invalid for logging in on new
     * browser sessions.  Setting this value to zero will cause users to re-attempt authentication on
     * every new browser session.  Please note that the invalidate time will be saved client-side and
     * should not be relied on for security.
     */
    shouldInvalidateAfter() {
        return 86400;
    }
    /**
     * Login using the Authenticator App. This can return one or more users depending on multiple chain support.
     */
    async login() {
        console.log(`ORE-UAL: login requested`);
        try {
            await this.oreId.popup.auth({ provider: oreid_js_1.AuthProvider.Google }).then(({ user }) => {
                console.log('logged in');
                const signingAccount = user.chainAccounts.find((ca) => ca.chainNetwork === "wax_test");
                const pubKeys = [(signingAccount === null || signingAccount === void 0 ? void 0 : signingAccount.chainAccount) || "093939"];
                const userAccount = user.accountName || "ore1xxxxxx";
                this.receiveLogin(userAccount, pubKeys);
            });
            if (this.session) {
                this.users = [
                    new OreUser_1.OreUser(this.chains[0], this.session.userAccount, this.session.pubKeys, this.oreId)
                ];
            }
            ;
            console.log(`UAL-ORE: login`, this.users);
            return this.users;
        }
        catch (e) {
            throw Error("error loging in");
        }
    }
    /**
     * Logs the user out of the dapp. This will be strongly dependent on each Authenticator app's patterns.
     */
    async logout() {
        // this.initWaxJS();
        await this.oreId.logout();
        this.users = [];
        this.session = undefined;
        localStorage.setItem('ual-ore:autologin', 'null');
        console.log(`UAL-ORE: logout`);
    }
    /**
     * Returns true if user confirmation is required for `getKeys`
     */
    requiresGetKeyConfirmation() {
        return false;
    }
    /**
     * Returns name of authenticator for persistence in local storage
     */
    getName() {
        return 'ore';
    }
    receiveLogin(userAccount, pubKeys) {
        if (!this.oreId) {
            return;
        }
        const login = {
            // @ts-ignore
            userAccount: userAccount || "Defafultuseraccount",
            // @ts-ignore
            pubKeys: pubKeys || ["key1", "key2"],
            expire: Date.now() + this.shouldInvalidateAfter() * 1000
        };
        if (!login.userAccount || !login.pubKeys) {
            return;
        }
        localStorage.setItem('ual-wax:autologin', JSON.stringify(login));
        this.session = login;
    }
    getEndpoint() {
        return `${this.chains[0].rpcEndpoints[0].protocol}://${this.chains[0].rpcEndpoints[0].host}:${this.chains[0].rpcEndpoints[0].port}`;
    }
}
exports.OreUal = OreUal;
