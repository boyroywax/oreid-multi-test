import React from "react"
import { useOreId, useUser } from "oreid-react"
import { AuthProvider,
    ChainNetwork,
    ExternalWalletType,
    PopupPluginAuthParams,
    PopupPluginSignParams,
    SignStringParams,
    Transaction,
    TransactionData,
    TransactionSignOptions } from "oreid-js"
import { Button } from "src/Button"
import { OreUser } from "authenticator"
import { OreUal } from "authenticator"
import { UALProvider, withUAL } from 'ual-reactjs-renderer'
import { JsonRpc } from 'eosjs'
import { Authenticator, Chain, User, UALError } from 'universal-authenticator-library';

interface TransactionProps {
    ual: any
}
    
interface TransactionState {
    activeUser: any
    accountName: string
    accountBalance: any
    rpc: JsonRpc
}

const myChain: Chain = {
    chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
    rpcEndpoints: [{
        protocol: 'https',
        host: 'apiwax.3dkrender.com',
        port: 8080
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
        to: 'example',
        quantity: '1.0000 EOS',
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
    window = document.getElementById('ual-app')
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
  
    public async transfer() {
      const { accountName, activeUser } = this.state
      demoTransaction.actions[0].authorization[0].actor = accountName
      demoTransaction.actions[0].data.from = accountName
      try {
        await activeUser.signTransaction(demoTransaction, { broadcast: true })
        await this.updateAccountBalance()
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
      const transferBtn = accountBalance && this.renderTransferButton()
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

  const NewHOC = (PassedComponent: any) => {
    return class extends React.Component {
      render() {
        return (
          <div>
            <PassedComponent {...this.props} />
          </div>
        )
      }
    }
  }
  
  


export const Ual: React.FC = () => {

    const oreId = useOreId()
    const user = useUser()
    
      
      const TestAppConsumer = withUAL(TransactionApp)
      const chains: Chain[] = [myChain]
        const oreUal: any = new OreUal(chains)
  
      TestAppConsumer.displayName = 'TestAppConsumer'
      const AppwithUal = ({chains: chains, authenticator: [oreUal], appName: "Authenticator Test App"}) => {
        <div>
            document.getElementById("ual-app") as HTMLElement
        </div>
      }
      const newComponent = NewHOC(withUAL(TransactionApp))

    return (
        <div>
            <UALProvider chains={[myChain]} authenticators={[oreUal]} appName='Authenticator Test App'>
                <newComponent  />
            </UALProvider>
            {}
        </div>
    )
}