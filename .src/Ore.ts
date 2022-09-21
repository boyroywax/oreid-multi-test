import { Authenticator, Chain, User, UALError } from 'universal-authenticator-library'
import {UALErrorType} from "universal-authenticator-library/dist";
import {SignatureProvider} from "eosjs/dist/eosjs-api-interfaces";
import { OreId, AuthProvider, ChainNetwork , User as OreIdUser } from "oreid-js"
import { WebPopup } from "oreid-webpopup"

import { OreUser } from "./OreUser"
import { WaxIcon } from './WaxIcon';
import {UALWaxError} from "./UALWaxError";

export class OreUal extends Authenticator {
    // private wax?: WaxJS;
    // private oreId: OreId
    private users: OreUser[] = [];

    private initiated = false;

    private session?: {userAccount: string, pubKeys: string[]};

    private readonly apiSigner?: SignatureProvider;

    private readonly waxSigningURL: string | undefined;
    private readonly waxAutoSigningURL: string | undefined;

    constructor(chains: Chain[],
         options?: {
            apiSigner?: SignatureProvider,
            waxSigningURL?: string | undefined,
            waxAutoSigningURL?: string | undefined
        }) {
        super(chains, options);

        this.apiSigner = options && options.apiSigner;

        this.waxSigningURL = options && options.waxSigningURL;
        this.waxAutoSigningURL = options && options.waxAutoSigningURL;
    }

    // * Initialize OreId
   private oreId: any = new OreId({
        appName: "Polygon ORE-ID Sample App",
        appId: "t_89c6f4f83ad84d0ca52c832cf4442651",
        oreIdUrl: "https://service.oreid.io",
        plugins: {
            popup: WebPopup(),
        },
    })

    /**
     * Called after `shouldRender` and should be used to handle any async actions required to initialize the authenticator
     */
    async init(): Promise<void> {
        // this.initWaxJS();
        // console.log("OREINIT")

        // try {
        //     if (this.wax) {
        //         if (await this.wax.isAutoLoginAvailable()) {
        //             this.receiveLogin();
        //         } else {
        //             const data = JSON.parse(localStorage.getItem('ual-wax:autologin') || 'null');

        //             if (data && data.expire >= Date.now()) {
        //                 this.receiveLogin(data.userAccount, data.pubKeys);
        //             }
        //         }
        //     }
        // } catch (e) {
        //     console.log('UAL-WAX: autologin error', e);
        // }
        await this.oreId.init().then(() => {
			console.log("ORe ID Initialized");
		});
        this.initiated = true;

        // await this.oreId.popup.auth(
        //     {provider: AuthProvider.Google}
        // ).then(({user}) => {
        //     console.log('logged in');
        //     const signingAccount = user.chainAccounts.find(
        //          (ca) => ca.chainNetwork === "wax_test"
        //     );
        //     const pubKeys = [signingAccount?.chainAccount || "093939"];
        //     const userAccount = user.accountName || "ore1xxxxxx";
        //     const info = { userAccount, pubKeys } || { userAccount: "userAccount", pubKeys: ["121233333"]};
        //     this.receiveLogin(userAccount, pubKeys);
        // });

        // console.log(`UAL-WAX: init`);
    }


    /**
     * Resets the authenticator to its initial, default state then calls `init` method
     */
    reset() {
        this.oreId = this.oreId;
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
    getError(): UALError | null {
        return null;
    }


    /**
     * Returns true if the authenticator is loading while initializing its internal state.
     */
    isLoading(): boolean {
        return !this.initiated;
    }


    /**
     * Returns the style of the Button that will be rendered.
     */
    getStyle() {
        return {
            icon: WaxIcon,
            text: 'ORE ID Wallet',
            textColor: 'white',
            background: '#111111'
        }
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
    async shouldRequestAccountName(): Promise<boolean> {
        return false;
    }

    /**
     * Returns the amount of seconds after the authentication will be invalid for logging in on new
     * browser sessions.  Setting this value to zero will cause users to re-attempt authentication on
     * every new browser session.  Please note that the invalidate time will be saved client-side and
     * should not be relied on for security.
     */
    public shouldInvalidateAfter(): number {
        return 86400;
    }

    /**
     * Login using the Authenticator App. This can return one or more users depending on multiple chain support.
     */
    async login(): Promise<User[]> {
        console.log(`ORE-WAX: login requested`);

        // Commented for now to support multiple wax chains such as testnets/staging in the future
        // Mainnet check:  this.chains[0].chainId !== '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4'
        // if (this.chains.length > 1) {
        //     throw new UALWaxError('WAX Could Wallet only supports one WAX chain',
        //         UALErrorType.Unsupported, null
        //     )
        // }

        // if (!this.wax) {
        //     throw new UALWaxError('WAX Cloud Wallet not initialized yet',
        //         UALErrorType.Initialization, null
        //     )
        // }

        try {
                await this.oreId.init()
                // await this.wax.login();
                await this.oreId.popup.auth(
                    {provider: AuthProvider.Google}
                ).then((user: OreIdUser) => {
                    console.log('logged in');
                    const signingAccount = user.chainAccounts.find(
                         (ca: any) => ca.chainNetwork === "wax_test"
                    );
                    const pubKeys = [signingAccount?.chainAccount || "093939"];
                    const userAccount = user.accountName || "ore1xxxxxx";
                    const info = { userAccount, pubKeys } || { userAccount: "userAccount", pubKeys: ["121233333"]};
                    this.receiveLogin(userAccount, pubKeys);
                });
                // this.receiveLogin();
            

            if (!this.session) {
                throw new Error('Could not receive login information');
            }
            // const userData: OreIdUser = this.oreId.auth.user
            // const signingAccount = userData.chainAccounts.find(
            //     (ca) => ca.chainNetwork === ChainNetwork.WaxTest
            // )
            if (this.session) {
                this.users = [
                    new OreUser(this.chains[0], this.session.userAccount, this.session.pubKeys, this.oreId)
            ]};


            console.log(`UAL-WAX: login`, this.users);

            return this.users;
            // return "logged in"
        } catch (e) {
            // throw new UALWaxError(
            //     'Could not login to the WAX Cloud Wallet',
            //     UALErrorType.Login,
            //     null
            // )
            throw Error(
                "error loging in"
            )
        }
    }


    /**
     * Logs the user out of the dapp. This will be strongly dependent on each Authenticator app's patterns.
     */
    async logout(): Promise<void> {
        // this.initWaxJS();
        this.users = [];
        this.session = undefined;

        localStorage.setItem('ual-wax:autologin', 'null');

        console.log(`UAL-WAX: logout`);
    }


    /**
     * Returns true if user confirmation is required for `getKeys`
     */
    requiresGetKeyConfirmation(): boolean {
        return false;
    }

    /**
     * Returns name of authenticator for persistence in local storage
     */
    getName(): string {
      return 'wax';
    }

    private receiveLogin(userAccount?: string, pubKeys?: string[]) {
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

    // private initWaxJS() {
    //     this.wax = new WaxJS({
    //         rpcEndpoint: this.getEndpoint(),
    //         tryAutoLogin: false,
    //         apiSigner: this.apiSigner,
    //         waxSigningURL: this.waxSigningURL,
    //         waxAutoSigningURL: this.waxAutoSigningURL
    //     });
    // }

    private getEndpoint() {
        return `${this.chains[0].rpcEndpoints[0].protocol}://${this.chains[0].rpcEndpoints[0].host}:${this.chains[0].rpcEndpoints[0].port}`;
    }
}
