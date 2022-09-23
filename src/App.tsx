import { OreId } from "oreid-js";
import { OreidProvider, useIsLoggedIn, useUser } from "oreid-react";
import { WebPopup } from "oreid-webpopup";
import React, { useEffect, useState } from "react";

import "./App.css";
import { ExternalWallet } from "./ExternalWallet";
import { Header } from "./Header";
import { LoginPage } from "./LoginPage";
import { FaucetAdmin, OreFaucet } from "./OreFaucet";
import { AccountInfo, SendTransfer, UserBalance, UserResources } from "./OreIdWallet";
import { REACT_APP_OREID_APP_ID } from "./constants";
import { Footer } from "./Footer";
import { Ual } from "./Ual";
import { Authenticator, Chain, User, UALError, UAL } from 'universal-authenticator-library';
// import { UALJs } from "ual-plainjs-renderer"
import { OreUal } from "authenticator";



const transitProviders = [
	// require('eos-transit-web3-provider').default(),
	require('eos-transit-scatter-provider').default()
]

// * Initialize OreId
const oreId = new OreId({
	appName: "ORE ID Sample App",
	appId: REACT_APP_OREID_APP_ID,
	oreIdUrl: "https://service.oreid.io",
	plugins: {
		popup: WebPopup(),
	},
	eosTransitWalletProviders: transitProviders
});

const LoggedInView: React.FC = () => {
	const user = useUser();
	const isAdmin = (): boolean => {
		if (user?.accountName === 'ore1tw1xk1mf') {
			return true
		}
		else {
			return false
		}
	}
	

	if (!user) return null;
	return (
		<>
			<OreFaucet />
			<UserBalance />
			<UserResources />
			<SendTransfer />
			<AccountInfo />
			<ExternalWallet />
			<Ual />
			{/* <button onClick={() => ual}>Login with UAL</button> */}
			{ isAdmin() ?
				<FaucetAdmin /> : () => null }
		</>
	)
};

const AppWithProvider: React.FC = () => {
	const isLoggedIn = useIsLoggedIn();
	return (
		<div className="App">
			<Header />
			{isLoggedIn ? <LoggedInView /> : <LoginPage />}
			<Footer  />
		</div>
	);
};

export const App: React.FC = () => {
	const [oreidReady, setOreidReady] = useState(false);

	useEffect(() => {
		oreId.init().then(() => {
			setOreidReady(true);
		});
	}, []);

	if (!oreidReady) {
		return <>Loading...</>;
	}

	return (
		<OreidProvider oreId={oreId}>
			<AppWithProvider />
		</OreidProvider>
	);
};
