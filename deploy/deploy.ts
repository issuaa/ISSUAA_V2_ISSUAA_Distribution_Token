import { Wallet, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

const tokenName = "ISSUAA Distribution Token"
const tokenSymbol = "IDT"

var fs = require('fs');
const airdropEntries = JSON.parse(fs.readFileSync('../airdrop.json', 'utf8'));
var legacyTokenNumber = BigInt(0);

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the IDT token contract`);

  // Initialize the wallet.
  const wallet = new Wallet("51077c8b6f008d220b75541bd79bba93a791986f12e971caf110c15044ca2f3b");
  
  

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("GovernanceToken");
  
  // Estimate contract deployment fee
  const deploymentFee = await deployer.estimateDeployFee(artifact, [tokenName,tokenSymbol]);
  console.log("Debug")

  

  // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  const governanceToken = await deployer.deploy(artifact, [tokenName,tokenSymbol]);

  
  // Show the contract info.
  const contractAddress = governanceToken.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);

  await hre.run("verify:verify", {
    address: contractAddress,
    contract: "contracts/GovernanceToken.sol:GovernanceToken",
    constructorArguments: [tokenName,tokenSymbol]
  });

  // Mint tokens for the airdrop addresses
  for (let i=0; i<airdropEntries.length;i++) {
      let adr = airdropEntries[i][0]
      let amt = airdropEntries[i][1]
      await governanceToken.mint(adr, BigInt(amt))
      console.log(adr,"-",amt)
  }
}

