const { checkProperties } = require("ethers/lib/utils");
const hre = require("hardhat");
const ethers = require("ethers");
async function main() {

    const ETHWrapperFactory = await hre.ethers.getContractFactory("ETHWrapper");
    const provider = new hre.ethers.providers.JsonRpcProvider("http://127.0.0.1:7545")
    const walletAlice = new hre.ethers.Wallet("4f1de1706f10161c3b7da5929b1bc5bcda8d0c0dc26dbd92ac4c6af00e0924eb", provider);

    const walletBob = new hre.ethers.Wallet("7abab01606b7e3aec95b92d7ec98f6fb127f496201336ab618700813d5dd4d59", provider);
    const balanceAliceWallet = await walletAlice.getBalance();
    const balanceBobWallet = await walletBob.getBalance();

    const wrapValue = hre.ethers.utils.parseEther("1")

    const ETHWrapperContract = await ETHWrapperFactory.attach("0x622ac3D404dD307AC9bd01C419d25c2b4e0938b1")

    //console.log(ETHWrapperContract.address)

    // const wrapTx = await ETHWrapperContract.wrap({
    //     value: wrapValue,
    //     gasLimit: 300000,
    //     gasPrice: 1000000,
    // })

    // hashedMessage, signedMessage, receiver
    // hashedMessage: 0x2aa41cf7ca9c0caaca11e3504a314e2669ccbba6ccfe90f325ddfeb0f4fb65c9
    // signed Message: 0xb18630ac9bf299526c2a5ead42575526ca908324f71580e1f64634b834dcfbac1e3c2808a27a465c97b75527d2dc5e90688ea9094ce56bf2fb607287a06778b31b
    // receiver: 0x952aed26eC2DF8F0e45556FCa0F74227E960f7E4

    //async function wrapTokensWithSignedMessage(hashedMessage, signedMessage, receiver) {
    const sig = hre.ethers.utils.splitSignature("0xb18630ac9bf299526c2a5ead42575526ca908324f71580e1f64634b834dcfbac1e3c2808a27a465c97b75527d2dc5e90688ea9094ce56bf2fb607287a06778b31b");

    const wrapTx = await ETHWrapperContract
        .wrapWithSignature("0x2aa41cf7ca9c0caaca11e3504a314e2669ccbba6ccfe90f325ddfeb0f4fb65c9",
            sig.v,
            sig.r,
            sig.s,
            "0x952aed26eC2DF8F0e45556FCa0F74227E960f7E4",
            { value: wrapValue })
    await wrapTx.wait()
    //console.log(wrapTx)
    //}
    // wrapTokensWithSignedMessage("0x2aa41cf7ca9c0caaca11e3504a314e2669ccbba6ccfe90f325ddfeb0f4fb65c9",
    //     "0xb18630ac9bf299526c2a5ead42575526ca908324f71580e1f64634b834dcfbac1e3c2808a27a465c97b75527d2dc5e90688ea9094ce56bf2fb607287a06778b31b",
    //     "0x06d658BD7045D2Be4E7d6356416862692FbCC10c");

    // const value = {
    //     gasLimit: 30000,
    //     gasPrice: 100000,
    //     to: ETHWrapperContract.address,
    //     value: wrapValue
    // }
    // const wrapTx = await wallet.sendTransaction(value)


    // await wrapTx.wait()

    let contractETHBalance = await provider.getBalance(ETHWrapperContract.address);
    console.log("Contract ETH balance after wrapping:", contractETHBalance.toString());

    // const WETHFactory = await hre.ethers.getContractFactory("WETH");
    // const wethAddress = await ETHWrapperContract.WETHToken();
    // const WETHContract = await WETHFactory.attach(wethAddress)

    // const approveTx = await WETHContract.approve(ETHWrapperContract.address, wrapValue)
    // await approveTx.wait()

    // const unwrapTx = await ETHWrapperContract.unwrap(wrapValue)
    // await unwrapTx.wait()

    // balanceWETHAlice = await WETHContract.balanceOf(walletAlice.address)
    // balanceWETHBob = await WETHContract.balanceOf(walletBob.address)
    // console.log("Balance of Alice after unwrapping:", balanceWETHAlice.toString())
    // console.log("Balance of Bob after unwrapping:", balanceWETHBob.toString())

    // contractETHBalance = await provider.getBalance(ETHWrapperContract.address);
    // console.log("Contract ETH balance after unwrapping:", contractETHBalance.toString())
    
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });