const hre = require("hardhat");

async function main() {

    const ETHWrapperFactory = await hre.ethers.getContractFactory("ETHWrapper");
    const provider = new hre.ethers.providers.InfuraProvider("ropsten", "ab0b32b1a6484c3f94a5753a083ddd11")
    const wallet = new hre.ethers.Wallet("0eda082d0c0271f64c8356581772ae996a299d7568fc3ddb52a869975dfb40c0", provider);
    const balance = await wallet.getBalance();

    console.log(balance.toString())
    const wrapValue = hre.ethers.utils.parseEther("0.0001")

    const ETHWrapperContract = await ETHWrapperFactory.attach("0xceeE3dD579D29DDA68316F8c4a2b8D326769A4d0")

    console.log(ETHWrapperContract.address)

    const tx = await ETHWrapperContract.wrap({ value: wrapValue })
    await tx.wait()
    let contractETHBalance = await provider.getBalance(ETHWrapperContract.address);
    console.log("Contract ETH balance after wrapping:", contractETHBalance.toString());


    const WETHFactory = await hre.ethers.getContractFactory("WETH");
    const wethAddress = await ETHWrapperContract.WETHToken();
    const WETHContract = await WETHFactory.attach(wethAddress)

    // const approveTx = await WETHContract.approve(ETHWrapperContract.address, wrapValue)
    // await approveTx.wait()

    // const unwrapTx = await ETHWrapperContract.unwrap(wrapValue)
    // await unwrapTx.wait()

    // balance = await WETHContract.balanceOf(wallet.address)
    // console.log("Balance after unwrapping:", balance.toString())

    // contractETHBalance = await provider.getBalance(ETHWrapperContract.address);
    // console.log("Contract ETH balance after unwrapping:", contractETHBalance.toString())
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });