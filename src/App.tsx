import { OreId } from "oreid-js";
import { OreidProvider, useIsLoggedIn, useUser } from "oreid-react";
import { WebPopup } from "oreid-webpopup";
import React, { useEffect, useState } from "react";

import "./App.css";
import { ExternalWallet } from "./ExternalWallet";
import { Header } from "./Header";
import { LoginPage } from "./LoginPage";
import { FaucetAdmin, OreFaucet, SendTransfer } from "./OreFaucet";
import { AccountInfo, UserBalance, UserResources } from "./OreIdWallet";
import { REACT_APP_OREID_APP_ID } from "./constants";


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
	if (!user) return null;
	return (
		<>
			<OreFaucet />
			<UserBalance />
			<UserResources />
			<SendTransfer />
			<AccountInfo />
			<ExternalWallet />
			<FaucetAdmin />
		</>
	)
};

const AppWithProvider: React.FC = () => {
	const isLoggedIn = useIsLoggedIn();
	return (
		<div className="App">
			<Header />
			{isLoggedIn ? <LoggedInView /> : <LoginPage />}
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
