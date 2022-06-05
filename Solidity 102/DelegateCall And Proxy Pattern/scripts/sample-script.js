const { ethers } = require("hardhat");
async function main() {
//outdated/pseudo code

const RegistryFactory = await hre.ethers.getContractFactory("LIBDeployer");
const provider = new hre.ethers.providers.JsonRpcProvider("http://127.0.0.1:8545")
const wallet = new hre.ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
const LIBDeployerContract = await RegistryFactory.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3")
// Registry.at(Registry.address).setLogicContract(LogicOne.address)
// LogicOne.at(Registry.address).setVal(2)
// Registry.at(Registry.address).setLogicContract(LogicTwo.address)
// LogicTwo.at(Registry.address).setVal(2)


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
