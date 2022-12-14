import React from "react"
import { useOreId, useUser } from "oreid-react"
// import { AuthProvider,
//     ChainNetwork,
//     ExternalWalletType,
//     PopupPluginAuthParams,
//     PopupPluginSignParams,
//     SignStringParams,
//     Transaction,
//     TransactionData,
//     TransactionSignOptions } from "oreid-js"
import { Button } from "src/Button"
import { OreUser } from "authenticator"
import { OreUal } from "authenticator"
import { UALProvider, withUAL } from 'ual-reactjs-renderer'
import { JsonRpc } from 'eosjs'
import { Authenticator, Chain, User, UALError, UAL } from 'universal-authenticator-library';
import { Chain as ChainJs, ChainType, Helpers, Models, PluginChainFactory, Transaction } from "@open-rights-exchange/chain-js"
import { Plugin as EthPlugin, ModelsEthereum, HelpersEthereum } from "@open-rights-exchange/chain-js-plugin-ethereum"
import { ApiEndpoint, AuthProvider, ChainNetwork, OreId, RequestType, WebWidgetSignResult } from "oreid-js"
import { encodeSell, OpenSeaPort, OpenSeaSDK, orderToJSON, WyvernProtocol } from "opensea-js"
import Web3 from "web3"
import { Asset, OpenSeaAPIConfig, Network, WyvernSchemaName, AssetContractType, UnhashedOrder, UnsignedOrder, WyvernConfig, WyvernAsset, WyvernFTAsset, RawWyvernOrderJSON, SaleKind, OrderSide, FeeMethod, HowToCall, ExchangeMetadata, WyvernNFTAsset, EventType, OpenSeaAsset, Order, OpenSeaFungibleToken, OpenSeaFungibleTokenQuery, OrderQuery } from "opensea-js/lib/types"
import { BigNumberInput, getAssetItemType, getWyvernAsset, makeBigNumber, orderFromJSON } from "opensea-js/lib/utils/utils"
import { OrderWithCounter, OrderComponents, OrderParameters, CreateOrderAction, CreateOrderInput, OfferItem } from "@opensea/seaport-js/lib/types";
import web3WalletProviderPlugin from "eos-transit-web3-provider/lib/plugin"
import * as WyvernSchemas from "wyvern-schemas"
// import Web3ProviderEngine, RPC from "web3-provider-engine"
import { Provider, TransactionResponse, TransactionReceipt, TransactionRequest } from "@ethersproject/abstract-provider"
import { Deferrable } from "@ethersproject/properties"
import { Bytes, Signer } from "ethers"
import { WebPopup } from "oreid-webpopup"
import Web3ProviderEngine from "web3-provider-engine"

interface TransactionProps {
    ual: any
}
    
interface TransactionState {
    activeUser: any
    accountName: string
    accountBalance: any
    rpc: JsonRpc
}

class OreIdSigner extends Signer {
  public oreId: OreId
  public chainAccount: string = "None"

  constructor() {
    super()
    this.oreId = new OreId({
      appName: "ORE ID Sample App",
      appId: process.env.REACT_APP_OREID_APP_ID || 't_81af705b3f2045d5aa8c5389bec87944',
      oreIdUrl: "https://service.oreid.io",
      plugins: {
        popup: WebPopup(),
      },
  })
}

connect(provider: Provider): Signer {
  this.oreId.init().then(async () => {
    await this.oreId.popup.auth({
      provider: AuthProvider.Google,
    })
    
  })
  return this as Signer
}
 async getAddress(): Promise<string> {
  await this.oreId.init()
  let signingAccount: any
  await this.oreId.popup.auth(
    { provider: AuthProvider.Google }

  )
  .then(async () => {
    const userData = await this.oreId.auth.user.getData()
    signingAccount = userData.chainAccounts.find(
			(ca) => ca.chainNetwork === "eth_goerli"
		)
    this.chainAccount = signingAccount.chainAccount
  })
  return signingAccount.chainAccount
 }

 async signMessage(message: string | Bytes): Promise<string> {
   return "not-today"
 }

 async sendTransaction(transaction: any): Promise<TransactionResponse> {
  const txn = {
    from: transaction.from,
    to: transaction.to,
    nonce: transaction.nonce,

    gasLimit: transaction.gasLimit,
    gasPrice: transaction.gasPrice,

    data: transaction.data,
    value: transaction.value,
    chainId: transaction.chainId,

    type: transaction.type,
    accessList: transaction.accessList,

    maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
    maxFeePerGas: transaction.maxFeePerGas,

    customData: transaction.customData,
    ccipReadEnabled: transaction.ccipReadEnabled
  }
  
  const txn_ = await this.oreId.createTransaction({
    chainNetwork: ChainNetwork.EthGoerli,
    chainAccount: this.chainAccount,
    transaction: transaction,
    signOptions: {
      broadcast: true,
      returnSignedTransaction: true
    }

  })
  const result = await this.oreId.popup.sign({
    transaction: txn_
   })
   const transactionResponse: TransactionResponse = {
    confirmations: 1,
    // from: txn.from || "None",
    raw: result.signedTransaction,
    blockNumber: 0,
    blockHash: "None",
    timestamp: 0,
    wait: async (confirmations=0): Promise<TransactionReceipt> => { 
      const transactionReceipt: TransactionReceipt = {
        status: 0,
        contractAddress: "",
        confirmations: 1,
        transactionIndex: 1,
        gasUsed: makeBigNumber(1000) as any,
        logsBloom: "",
        transactionHash: "",
        blockHash: "",
        logs: ["logs"] as any,
        blockNumber: 1,
        cumulativeGasUsed: makeBigNumber(1) as any,
        effectiveGasPrice: makeBigNumber(1) as any,
        byzantium: false,
        ...txn
      }
      return transactionReceipt
    },
    // nonce: txn.nonce || undefined,
    hash: result.signedTransaction || "None",
    ...txn
   }
return transactionResponse
 }

 async signTransaction(transaction: Deferrable<TransactionRequest>): Promise<string> {
   return "None"
 }
}

// const myChain: Chain = {
//     chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
//     rpcEndpoints: [{
//         protocol: 'https',
//         host: 'apiwax.3dkrender.com',
//         port: 80
//     }]
// };

const myChain: Chain = {
    chainId: 'f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12',
    rpcEndpoints: [{
        protocol: 'http',
        host: 'testnet-wax.3dkrender.com',
        port: 80
    }]
};

  const demoTransaction = {
      actions: [{
          account: 'eosio.token',
          name: 'transfer',
          authorization: [{
          actor: '', // use account that was logged in
          permission: 'active',
        }],
        data: {
          from: '', // use account that was logged in
          to: 'jamesataikon',
          quantity: '1.00000000 WAX',
          memo: 'UAL rocks!',
        },
      }],
  }

const EXAMPLE_ENV =  {
    CHAIN_ID: myChain.chainId ,
    RPC_PROTOCOL: myChain.rpcEndpoints[0].protocol,
    RPC_HOST: myChain.rpcEndpoints[0].host,
    RPC_PORT: myChain.rpcEndpoints[0].port
}

// const TestAppConsumer = withUAL(TestApp)

const defaultState = {
    activeUser: null,
    accountName: '',
    accountBalance: null,
  }

  class TransactionApp extends React.Component<TransactionProps, TransactionState> {
    static displayName = 'TransactionApp'

    constructor(props: TransactionProps) {
        super(props)
        this.state = {
          ...defaultState,
          rpc: new JsonRpc(`${EXAMPLE_ENV.RPC_PROTOCOL}://${EXAMPLE_ENV.RPC_HOST}:${EXAMPLE_ENV.RPC_PORT}`)
        }
        this.updateAccountBalance = this.updateAccountBalance.bind(this)
        this.updateAccountName = this.updateAccountName.bind(this)
        this.renderTransferButton = this.renderTransferButton.bind(this)
        this.transfer = this.transfer.bind(this)
        this.renderModalButton = this.renderModalButton.bind(this)
      }
  
    public componentDidUpdate() {
      const { ual: { activeUser } } = this.props
      if (activeUser && !this.state.activeUser) {
        this.setState({ activeUser }, this.updateAccountName)
      } else if (!activeUser && this.state.activeUser) {
        this.setState(defaultState)
      }
    }
  
    public async updateAccountName(): Promise<void>   {
      try {
        const accountName = await this.state.activeUser.getAccountName()
        this.setState({ accountName }, this.updateAccountBalance)
      } catch (e) {
        console.warn(e)
      }
    }
  
    public async updateAccountBalance(): Promise<void> {
      try {
        const account = await this.state.rpc.get_account(this.state.accountName)
        const accountBalance = account.core_liquid_balance
        this.setState({ accountBalance })
      } catch (e) {
        console.warn(e)
      }
    }
  
    public transfer() {
        console.log("initaiting trnasfer")
      const { accountName, activeUser }:{accountName: string, activeUser: OreUser } = this.state
      demoTransaction.actions[0].authorization[0].actor = accountName
      demoTransaction.actions[0].data.from = accountName
      console.log(demoTransaction)
      console.log(accountName)
      try {
        activeUser.signTransaction(demoTransaction, { broadcast: true }).then((values) => {
            console.log(values)
        })
        // await this.updateAccountBalance()
      } catch (error) {
        console.warn(error)
      }
    }
  
    public renderModalButton() {
      return (
        <p className='ual-btn-wrapper'>
          <span
            role='button'
            onClick={this.props.ual.showModal}
            className='ual-generic-button'>Show UAL Modal</span>
        </p>
      )
    }
  
    public renderTransferButton() {
      return (
        <p className='ual-btn-wrapper'>
          <span className='ual-generic-button blue' onClick={this.transfer}>
            {'Transfer 1 eos to example'}
          </span>
        </p>
      )
    }
  
    public renderLogoutBtn = () => {
      const { ual: { activeUser, activeAuthenticator, logout } } = this.props
      if (!!activeUser && !!activeAuthenticator) {
        return (
          <p className='ual-btn-wrapper'>
            <span className='ual-generic-button red' onClick={logout}>
              {'Logout'}
            </span>
          </p>
        )
      }
    }
  
    public render() {
      const { ual: { activeUser } } = this.props
      const { accountBalance, accountName } = this.state
      const modalButton = !activeUser && this.renderModalButton()
      const loggedIn = accountName ? `Logged in as ${accountName}` : ''
      const myBalance = accountBalance ? `Balance: ${accountBalance}` : ''
      const transferBtn = this.renderTransferButton()
      return (
        <div style={{ textAlign: 'center' }}>
          {modalButton}
          <h3 className='ual-subtitle'>{loggedIn}</h3>
          <h4 className='ual-subtitle'>{myBalance}</h4>
          {transferBtn}
          {this.renderLogoutBtn()},
        </div>
      )
    }
  }

  
// const TransactionApp: React.FC<> = () => {
//     const window = document.getElementById('ual-app')
//     const displayName = 'TransactionApp'
//     let state = {
//         ...defaultState,
//         rpc: new JsonRpc(`${EXAMPLE_ENV.RPC_PROTOCOL}://${EXAMPLE_ENV.RPC_HOST}:${EXAMPLE_ENV.RPC_PORT}`)
//       }
//     props: any = window?.ual || undefined


//     // constructor(props: TransactionProps) {
//     //     super(props)
//     //     this.
//     //     this.updateAccountBalance = this.updateAccountBalance.bind(this)
//     //     this.updateAccountName = this.updateAccountName.bind(this)
//     //     this.renderTransferButton = this.renderTransferButton.bind(this)
//     //     this.transfer = this.transfer.bind(this)
//     //     this.renderModalButton = this.renderModalButton.bind(this)
//     //   }
  
//     const componentDidUpdate = () => {
//       const { ual: { activeUser } } = this.props
//       if (activeUser && !this.state.activeUser) {
//         this.setState({ activeUser }, this.updateAccountName)
//       } else if (!activeUser && this.state.activeUser) {
//         this.setState(defaultState)
//       }
//     }
  
//      const updateAccountName = async (): Promise<void> =>   {
//       try {
//         const accountName = await this.state.activeUser.getAccountName()
//         this.setState({ accountName }, this.updateAccountBalance)
//       } catch (e) {
//         console.warn(e)
//       }
//     }
  
//     function async updateAccountBalance(): Promise<void> {
//       try {
//         const account = await this.state.rpc.get_account(this.state.accountName)
//         const accountBalance = account.core_liquid_balance
//         this.setState({ accountBalance })
//       } catch (e) {
//         console.warn(e)
//       }
//     }
  
//     function async transfer() {
//       const { accountName, activeUser } = this.state
//       demoTransaction.actions[0].authorization[0].actor = accountName
//       demoTransaction.actions[0].data.from = accountName
//       try {
//         await activeUser.signTransaction(demoTransaction, { broadcast: true })
//         await this.updateAccountBalance()
//       } catch (error) {
//         console.warn(error)
//       }
//     }
  
//     function renderModalButton() {
//       return (
//         <p className='ual-btn-wrapper'>
//           <span
//             role='button'
//             onClick={this.props.ual.showModal}
//             className='ual-generic-button'>Show UAL Modal</span>
//         </p>
//       )
//     }
  
//     function renderTransferButton() {
//       return (
//         <p className='ual-btn-wrapper'>
//           <span className='ual-generic-button blue' onClick={this.transfer}>
//             {'Transfer 1 eos to example'}
//           </span>
//         </p>
//       )
//     }
  
//     function renderLogoutBtn() {
//       const { ual: { activeUser, activeAuthenticator, logout } } = this.props
//       if (!!activeUser && !!activeAuthenticator) {
//         return (
//           <p className='ual-btn-wrapper'>
//             <span className='ual-generic-button red' onClick={logout}>
//               {'Logout'}
//             </span>
//           </p>
//         )
//       }
//     }
  
//     function render() {
//       const { ual: { activeUser } } = this.props
//       const { accountBalance, accountName } = this.state
//       const modalButton = !activeUser && this.renderModalButton()
//       const loggedIn = accountName ? `Logged in as ${accountName}` : ''
//       const myBalance = accountBalance ? `Balance: ${accountBalance}` : ''
//       const transferBtn = accountBalance && this.renderTransferButton()
//       return (
//         <div style={{ textAlign: 'center' }}>
//           {modalButton}
//           <h3 className='ual-subtitle'>{loggedIn}</h3>
//           <h4 className='ual-subtitle'>{myBalance}</h4>
//           {transferBtn}
//           {this.renderLogoutBtn()},
//         </div>
//       )
//     }
//   }

//   const NewHOC: React.FC = (PassedComponent: any) => {
//     return class extends React.Component {
//       render() {
//         return (
//           <div>
//             <PassedComponent {...this.props} />
//           </div>
//         )
//       }
//     }
//   }
  
  


export const Ual: React.FC = () => {

    const oreId = useOreId()
    const userData = useUser()
    // const showmodal = ual.showModal
      
      const TestAppConsumer = withUAL(TransactionApp)
      const chains: Chain[] = [myChain]
        const oreUal: any = new OreUal(chains)

  
      TestAppConsumer.displayName = 'TestAppConsumer'
    //   const AppwithUal = ({chains: chains, authenticator: [oreUal], appName: "Authenticator Test App"}) => {
    //     return(
    //     <div>
    //         document.getElementById("ual-app") as HTMLElement
    //     </div>)
    //   }
    //   const newComponent = NewHOC(TestAppConsumer))

    const nftToOpensea = async () => {
      
    // // const composedAction = async () => {
    // //     await ethGeorli.composeAction(Models.ChainActionType.TokenTransferFrom)
    // // }


    // transaction.actions = [transactionAction]
    const ethChainType = ChainNetwork.EthGoerli

    const signingAccount = userData?.chainAccounts.find(
        (ca) => ca.chainNetwork === ethChainType
    )

    const abi = [
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'from',
                    type: 'address'
                },
                {
                    internalType: 'address',
                    name: 'to',
                    type: 'address'
                },
                {
                    internalType: 'uint256',
                    name: 'tokenId',
                    type: 'uint256'
                }
            ],
            name: "safeTransferFrom",
            outputs: [],
            stateMutability: 'nonpayable', 
            type: "function"
        }
    ];
    
    const contract = {
        abi: abi,
        method: "safeTransferFrom",
        parameters: [
            signingAccount?.chainAccount,
            "0x92B381515bd4851Faf3d33A161f7967FD87B1227",
            "4379987862034297058192663948417605894473"
        ]
    }

    const endpoints: Models.ChainEndpoint = {
        url: "https://rpc.ankr.com/eth_goerli",
    };
    
    const chainSettings: Models.ChainSettings = {
        chainName: "goerli",
        hardFork: "prater"
    };
    

        const ethGeorli: ChainJs = PluginChainFactory(
            [EthPlugin],
            ChainType.EthereumV1,
            [endpoints],
            chainSettings
        );
    
        await ethGeorli.connect()
        const chainInfo = ethGeorli.chainInfo
        console.log(ethGeorli.chainInfo)

  const transactionAction = {
    gasPrice: chainInfo.nativeInfo.currentGasPrice,
    gasLimit: chainInfo.nativeInfo.gasLimit,
    to: "0xf4910c763ed4e47a585e2d34baa9a4b611ae448c",
    from: signingAccount?.chainAccount,
    contract: contract
  }

  const transaction = {actions: {}}
  transaction.actions = [transactionAction]

  if (!signingAccount) {
      console.error(
          `User does not have any accounts on ${ethChainType}`
      )
      return
  }
  const transactionToSign = await oreId.createTransaction({
      chainAccount: signingAccount.chainAccount,
      chainNetwork: signingAccount.chainNetwork,
      transaction: transaction,
      signOptions: {
          broadcast: true,
          returnSignedTransaction: false
      }
  })

    const asset: Asset = {
      tokenId: "5",
      tokenAddress: '0x8b1A92D8acE441a576FE4e16557FBEA0bf0B9458',
      schemaName: WyvernSchemaName.ERC721
    }
    const accountAddress = signingAccount.chainAccount
    const startAmount = makeBigNumber("1000")
    const apiConfig: OpenSeaAPIConfig = {
      networkName: Network.Goerli,
      apiBaseUrl: 'https://testnets-api.opensea.io'
    }
    const expirationTime = 0
    const orderJson = {
      asset,
      accountAddress,
      startAmount,
      expirationTime
    }
    // const wyvernAsset = getWyvernAsset(WyvernSchemas.Schemas.ERC721   
    // // console.log(wyvernAsset)
    //   ,
    //   asset,
    //   makeBigNumber(1)
    // )
    // console.log(wyvernAsset)

    // const encodedCall = WyvernSchemas.schemaFunctions.encodeCall({
    //   abi: abi,

    // }
    // )
    
    // const providerEngine = new Web3ProviderEngine()
    // const provider: any = new Web3.providers.HttpProvider('https://rpc.ankr.com/eth_goerli')
    const provider: any = new Web3.providers.HttpProvider('https://rpc.goerli.mudit.blog')
    // const signer = new Web
    // RPCSubprovider
    const signer = new OreIdSigner()
    // providerEngine.addProvider(signer)
    // providerEngine.provider.signer = new OreIdSigner(provider)
    
    // const wpConfig: WyvernConfig = {
      
    // }
    // const wp = new WyvernProtocol(provider, )
    provider.signer = signer
    provider.signer.connect()
    await provider.signer.getAddress()
    // provider.get
    const seaport = new OpenSeaPort(provider, apiConfig)
    // const seaport = new OpenSeaPort(providerEngine, apiConfig)
    
    const txn = await seaport.createSellOrder({...orderJson})
    console.log(txn)
    // const eventType = EventType.ApproveAsset

    const asset1: OpenSeaAsset = await seaport.api.getAsset({
      ...asset
    })
    console.log(asset1)

    const fungTokenQuery: OpenSeaFungibleTokenQuery = {
      symbol: "ETH"
    }


    const fungtoken = await seaport.api.getPaymentTokens(fungTokenQuery)
    console.log(fungtoken.tokens)


    const orderQuery: OrderQuery = {
      owner: signingAccount.chainAccount,
      sale_kind: SaleKind.FixedPrice,
      side: OrderSide.Sell,
      asset_contract_address: asset.tokenAddress,
      payment_token_address: signingAccount.chainAccount,
      token_id: 5
    }

    // const itemType: ItemType = {

    // }

    const offerItem: OfferItem = {
      itemType: 2 as any,
      token: asset.tokenAddress,
      identifierOrCriteria: "5",
      startAmount: "10000000000000000000",
      endAmount: "10000000000000000000",
    }

    const orderParams: OrderParameters = {
      offerer: signingAccount.chainAccount,
      startTime: 0,
      endTime: 0,
      offer: [offerItem],
      zone: '0x004c00500000ad104d7dbd00e3ae0a5c00560c00',
      zoneHash: '0x3000000000000000000000000000000000000000000000000000000000000000',
      orderType: 0,
      salt: "12686911856931635052326433555881236148",
      totalOriginalConsiderationItems: "2",
      conduitKey: '0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000',
      "consideration": [
        {
            "itemType": 0,
            "token": "0x0000000000000000000000000000000000000000",
            "identifierOrCriteria": "0",
            "startAmount": "9750000000000000000",
            "endAmount": "9750000000000000000",
            "recipient": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        },
        {
            "itemType": 0, 
            "token": "0x0000000000000000000000000000000000000000",
            "identifierOrCriteria": "0",
            "startAmount": "250000000000000000",
            "endAmount": "250000000000000000",
            "recipient": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        },
        {
            "itemType": 0, 
            "token": "0x0000000000000000000000000000000000000000",
            "identifierOrCriteria": "0",
            "startAmount": "500000000000000000",
            "endAmount": "500000000000000000",
            "recipient": "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
        },
      ],
    }



    

    // seaport.api.getOrder({OrderSide.Sell})

    // const orderJson_ = orderToJSON(orderParams)
    
    // const response = await seaport.api.post('/v2/orders/ethereum/seaport/listings', orderParams)
    // console.log(response)
    // const verifiedOrder = seaport.api.postOrder()

    // const order_ = await seaport.api.getOrder({ side: "ask", protocol: "seaport" })
    // console.log(order_)

    // const wrappedAssets = await seaport.wrapAssets({assets: [asset], accountAddress})
    // console.log(asset)

    // const itemType: any = {

    // }

    const wyvernSchema1: WyvernNFTAsset = {
      id: "5",
      address: asset.tokenAddress
    }


    // const callSpec = encodeSell(
    //   WyvernSchemas.ERC721,
    //   asset as any,
    //   signingAccount.chainAccount
    // )
    // console.log(callSpec)

    const exchangeMetaData: ExchangeMetadata ={
      asset: wyvernSchema1,
      schema: WyvernSchemaName.ERC721,
      // referrerAddress?: undefined,
    }

    const unHashedOrder: UnhashedOrder = {
      feeMethod: FeeMethod.ProtocolFee,
      side: OrderSide.Sell,
      saleKind: SaleKind.FixedPrice,
      howToCall: HowToCall.Create,
      quantity: makeBigNumber(1),
      makerReferrerFee: makeBigNumber(1),
      waitingForBestCounterOrder: false,
      englishAuctionReservePrice: makeBigNumber(100000),
      metadata: exchangeMetaData,
      exchange: "OpenSea",
      maker: signingAccount.chainAccount,
      taker: "None",
      makerRelayerFee: makeBigNumber(0),
      takerRelayerFee: makeBigNumber(0),
      makerProtocolFee: makeBigNumber(0),
      takerProtocolFee: makeBigNumber(0),
      feeRecipient: "None",
      target: "None",
      calldata: "None",
      replacementPattern: "None",
      staticTarget: "None",
      staticExtradata: "None",
      paymentToken: "ETH",
      basePrice: makeBigNumber(0),
      extra: makeBigNumber(0),
      listingTime: makeBigNumber(0),
      expirationTime: makeBigNumber(0),
      salt: makeBigNumber(0),

    }


    try {
      // const balance = await seaport.getAssetBalance({
      //   accountAddress: signingAccount.chainAccount,
      //   asset: asset,
      //   // schemaName: WyvernSchemaName.ERC721
      // })
      // const orderV2 = await seaport.createSellOrder({...orderJson})
      // console.log(orderV2)

      // const orderV2_2 = await seaport.approveOrder(orderV2)
      // console.log(orderV2_2)
    // await seaport._sellOrderValidationAndApprovals({
    //   order: unHashedOrder,
    //   accountAddress: signingAccount.chainAccount
    // })
    // const txn1 = seaport._sellOrderValidationAndApprovals({
    //   order: unHashedOrder,
    //   accountAddress: signingAccount.chainAccount
    // })
    const gasPrice = await seaport._computeGasPrice()
    // const order = seaport.api.postOrder()
    console.log(gasPrice)
  }
  catch (e) {
    console.log(e)
  }

    // const offerItem: OfferItem = {
    //   itemType: 
    // }

    // const orderParameters: OrderParameters = {
    //   offerer: signingAccount.chainAccount,
    //   zone: string,
    //   orderType: OrderType,
    //   startTime: BigNumberish,
    //   endTime: BigNumberish,
    //   zoneHash: string,
    //   salt: string,
    //   offer: OfferItem[],
    //   consideration: ConsiderationItem[],
    //   totalOriginalConsiderationItems: BigNumberish,
    //   conduitKey: string,
    // }
    // const components: OrderComponents = {
    //   ...orderParameters,
    //   counter: 1
    // }

    // const createOrderAction: CreateOrderAction = {
    //   type: "create",
    //   getMessageToSign: () => {
    //     pass
    //   }
    // }

    // const orderwithCounter: OrderWithCounter = {

    // }
    // seaport.api.postOrder()

    // const txn1 = await seaport.approveOrder(txn)
    
    // console.log(txn1)
    // console.log(orderToJSON(
    //   txn as any
    // ))
    // const openSeaSDK = new OpenSeaSDK(provider,apiConfig)
    // const wyvernAddress = await seaport.api.getOrderCreateWyvernExchangeAddress()
    // console.log(wyvernAddress)
  //   const transactionToSign2 = await oreId.createTransaction({
  //     chainAccount: signingAccount.chainAccount,
  //     chainNetwork: signingAccount.chainNetwork,
  //     transaction: txn as any,
  //     signOptions: {
  //         broadcast: true,
  //         returnSignedTransaction: false
  //     }
  // })
    
    // console.log("actions" + JSON.stringify((transaction.actions)))
    // await transaction.prepareToBeSigned()
    // await transaction.validate()
    // await transaction.getSuggestedFee(Models.TxExecutionPriority.Average)
    // console.log(transactionToSign2)

    // oreId.popup.sign(
    //     {
    //         transaction: transactionToSign
    //     }
    // )
    // .then((result: WebWidgetSignResult) => {
    //     console.log( `result: ${JSON.stringify(result)}`);
    //     console.log( `txnid: ${result.transactionId}`)
    // })

}
   

    return (
        <>
        <div>
            <UALProvider chains={[myChain]} authenticators={[oreUal]} appName='Authenticator Test App'>
                {/* <UALContainer> */}
                    <TestAppConsumer />
                {/* </UALContainer> */}
            </UALProvider>
        </div>

        <div>
            <button onClick={() => nftToOpensea()}>
                NFTTOOPENSEA
            </button>
        </div>
        </>
    )
}