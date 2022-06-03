const { checkProperties } = require("ethers/lib/utils");
const hre = require("hardhat");
const ethPermit = require("eth-permit");
async function main() {

    const LIBDeployerFactory = await hre.ethers.getContractFactory("LIBDeployer");
    const provider = new hre.ethers.providers.JsonRpcProvider("http://127.0.0.1:8545")
    const wallet = new hre.ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);

    const mintValue = hre.ethers.utils.parseEther("1")

    const LIBDeployerContract = await LIBDeployerFactory.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3")
    const mintTx = await LIBDeployerContract.mint({
        value: mintValue,
        gasLimit: 300000,
        gasPrice: 100000000000,
    })
    await mintTx.wait()
    let contractLIBDeployerBalance = await provider.getBalance(LIBDeployerContract.address);
    console.log("Contract LIBDeployer balance after minting:", contractLIBDeployerBalance.toString());

    const LIBFactory = await hre.ethers.getContractFactory("LIB");
    const libAddress = await LIBDeployerContract.LIBToken();
    const LIBContract = await LIBFactory.attach(libAddress)
    const [account] = await provider.listAccounts();
    // const nonce = await LIBContract.nonces(account);

    // const sig = await ethPermit.signERC2612Permit(
    //     provider,
    //     libAddress,
    //     wallet.address,
    //     LIBDeployerContract.address,
    //     "1000",
    //     1664026467,
    //     nonce.toHexString()
    // )
    const onAttemptToApprove = async () => {
        // Account here is the wallete address
        const nonce = (await LIBContract.nonces(account)); // Our Token Contract Nonces
        const deadline = + new Date() + 60 * 60; // Permit with deadline which the permit is valid
        const wrapValue = hre.ethers.utils.parseEther("1"); // Value to approve for the spender to use

        const EIP712Domain = [ // array of objects -> properties from the contract and the types of them ircwithPermit
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'verifyingContract', type: 'address' }
        ];

        const domain = {
            name: await LIBContract.name(),
            version: '1',
            verifyingContract: LIBContract.address
        };

        const Permit = [ // array of objects -> properties from erc20withpermit
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' }
        ];

        const message = {
            owner: account, // Wallet Address
            spender: LIBDeployerContract.address, // This is the address of the spender whe want to give permit to.
            value: wrapValue.toString(),
            nonce: nonce.toHexString(),
            deadline
        };

        const data = JSON.stringify({
            types: {
                EIP712Domain,
                Permit
            },
            domain,
            primaryType: 'Permit',
            message
        });

        const signatureLike = await provider.send('eth_signTypedData_v4', [account, data]); // Library is a provider.
        const signature = await hre.ethers.utils.splitSignature(signatureLike);

        const preparedSignature = {
            v: signature.v,
            r: signature.r,
            s: signature.s,
            deadline
        };

        return preparedSignature;
    }
    
    const sig = await onAttemptToApprove();
    console.log('sig :>> ', sig);
    const permitTx = await LIBDeployerContract.send(mintValue, sig.deadline, sig.v, sig.r, sig.s)
    await permitTx.wait()
    console.log('permitTx :>> ', permitTx);
    // const permitTx = await LIBContract
    //     .permit(
    //         account,                                       // address owner - whoever signed the msg???,
    //         LIBDeployerContract.address,                  // address spender,
    //         sig.value,                                    // uint256 value,
    //         sig.deadline,                                     // uint256 deadline,
    //         sig.v,                                        // uint8 v,
    //         sig.r,                                        // bytes32 r,
    //         sig.s,                                        // bytes32 s
    //     )

    // await permitTx.wait()
    // console.log('permitTx :>> ', permitTx);
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });