// tslint:disable-next-line
const ganache = require("ganache-core");

import { ethers } from "ethers";
import { KOVAN_NETWORK, MAINNET_NETWORK } from "../constants";
import { getDai } from "./getDai";
import { IGanacheOptions } from "./IGanacheOptions";
import { getUMA } from "./getUMA";

export enum Status {
  Running = "Running",
  Stopped = "Stopped",
}

const PRIV_KEY =
  "0x316a0b2942f16ccb1bc3eb8babb03e64190bcc89913f52642f8f4e10079c9a88"; // TODO: Remove

const getForkUrl: () => string = () => {
  if (process.env.FORK_MODE === KOVAN_NETWORK) {
    return process.env.REACT_APP_ALCHEMY_KOVAN as string;
  } else if (process.env.FORK_MODE === MAINNET_NETWORK) {
    return process.env.REACT_APP_ALCHEMY_MAINNET as string;
  } else {
    throw new Error("Not fork mode specified");
  }
};

const getNetworkId: () => number = () => {
  if (process.env.FORK_MODE === KOVAN_NETWORK) {
    return 42;
  } else if (process.env.FORK_MODE === MAINNET_NETWORK) {
    return 1;
  } else {
    throw new Error("Not fork mode specified");
  }
};

export class Ganache {
  public status: Status;
  public server: any;

  private options: IGanacheOptions = {
    port: 8549,
    db_path: "",
    _chainId: getNetworkId(),
    _chainIdRpc: getNetworkId(),
    network_id: getNetworkId(),
    gasLimit: 20000000,
    allowUnlimitedContractSize: true,
    fork: getForkUrl(),
    accounts: [
      {
        secretKey: PRIV_KEY,
        balance: ethers.utils.hexlify(ethers.utils.parseEther("1000")),
      },
    ],
    unlocked_accounts: ["0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"],
  };

  constructor(options?: Partial<IGanacheOptions>) {
    this.status = Status.Stopped;
    this.options = Object.assign(this.options, options);
  }

  public async start(): Promise<void> {
    this.server = ganache.server(this.options);
    return new Promise((resolve, reject) => {
      this.server.listen(
        this.options.port,
        async (err: Error, blockchain: any) => {
          if (err) {
            console.log("ERROR", err);
            reject("Couldn't start ganache");
          }
          // tslint:disable-next-line
          console.log("Ganache started successfully", this.options.port);
          this.status = Status.Running;

          console.log(`Forked off of node: ${this.options.fork}\n`);
          console.log(`Test private key:\n`);
          console.log(`\t${PRIV_KEY}`);
          console.log(
            `\nTest chain started on port ${this.options.port}, listening...`
          );

          // get dai
          const provider = new ethers.providers.JsonRpcProvider(
            "http://localhost:8549"
          );
          const wallet = new ethers.Wallet(PRIV_KEY);
          await getDai(wallet.connect(provider));

          // get uma
          await getUMA(wallet.connect(provider));

          resolve(blockchain);
        }
      );
    });
  }

  public async stop(): Promise<void> {
    this.status = Status.Stopped;
    if (this.server) {
      return this.server.close();
    }
  }
}
