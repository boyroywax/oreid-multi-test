import { transferFunds,
    addOreToTreasury,
    addSysToTreasury,
    addCpuToTreasury,
    addNetToTreasury,
    addRamToTreasury,
    addSysToUser } from './src/helpers/composeTransaction';
import express, { Request, Response } from 'express'
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || process.env.REACT_APP_PORT

try {
    const app = express();

    app.use(cors())

    app.get( "/api/faucet_send", async (request: Request, response: Response) => {
        const { amount, recipient } = request.query
        transferFunds( amount as string, recipient as string )
            .then((result) => {
                response.send(result)
            })
            .catch((error) => {
                console.log(error)
                response.status(400).send(error)
            })
    })

    app.get( "/api/faucet_add_ore", async (request: Request, response: Response) => {
        addOreToTreasury()
            .then((result) => {
                response.send(result)
            })
            .catch((error) => {
                console.log(error)
                response.status(400).send(error)
            })
    })

    app.get( "/api/faucet_add_sys", async (request: Request, response: Response) => {
        addSysToTreasury()
            .then((result) => {
                response.send(result)
            })
            .catch((error) => {
                console.log(error)
                response.status(400).send(error)
            })
    })

    app.get( "/api/faucet_add_cpu", async (request: Request, response: Response) => {
        addCpuToTreasury()
            .then((result) => {
                response.send(result)
            })
            .catch((error) => {
                console.log(error)
                response.status(400).send(error)
            })
    })

    app.get( "/api/faucet_add_net", async (request: Request, response: Response) => {
        addNetToTreasury()
            .then((result) => {
                response.send(result)
            })
            .catch((error) => {
                console.log(error)
                response.status(400).send(error)
            })
    })

    app.get( "/api/faucet_add_ram", async (request: Request, response: Response) => {
        addRamToTreasury()
            .then((result) => {
                response.send(result)
            })
            .catch((error) => {
                console.log(error)
                response.status(400).send(error)
            })
    })

    app.get( "/api/user_add_sys", async (request: Request, response: Response) => {
        const { user } = request.query
        addSysToUser( user as string )
            .then((result) => {
                response.send(result)
            })
            .catch((error) => {
                console.log(error)
                response.status(400).send(error)
            })
    })

    // Hosts Frontend - Static files built with npm run build
    app.use('/', express.static(`${__dirname}`));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(`${__dirname}/index.html`));
    });

    app.listen(PORT, () => {
        console.log( `Service is now running on {server}:${PORT}` );
    });
} catch (error) {
    console.log(error);
}