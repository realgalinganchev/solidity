const { BigNumber } = require("ethers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('#addValuesWithCall()', () => {
  let Calculator;
  let Machine;
  let Storage;
  beforeEach(async () => {
    StorageFactory = await ethers.getContractFactory("Storage");
    Storage = await StorageFactory.deploy(BigNumber.from(0));
    await Storage.deployed();



    MachineFactory = await ethers.getContractFactory("Machine");
    Machine = await MachineFactory.deploy(Storage.address);
    await Machine.deployed();

    CalculatorFactory = await ethers.getContractFactory("Calculator");
    Calculator = await CalculatorFactory.deploy();
    await Calculator.deployed();


  });

  it('should successfully add values with call', async () => {
    const resultCall = await Machine.addValuesWithCall(Calculator.address, BigNumber.from(1), BigNumber.from(2));

    await expect(await Machine.addValuesWithCall(Calculator.address, BigNumber.from(1), BigNumber.from(2)))
      .to.emit(Machine, 'AddedValuesByCall')
      .withArgs(BigNumber.from(1), BigNumber.from(2), true)

    (await Calculator.calculateResult()).should.be.bignumber.equal(BigNumber.from(3));
    (await Machine.calculateResult()).should.be.bignumber.equal(BigNumber.from(0));
    (await Machine.user()).should.be.equal(constants.ZERO_ADDRESS);
    (await Calculator.user()).should.be.equal(Machine.address);

    const resultDelegateCall = await Machine.addValuesWithDelegateCall(Calculator.address, BigNumber.from(1), BigNumber.from(2));

    await expect(await Machine.addValuesWithCall(Calculator.address, BigNumber.from(1), BigNumber.from(2)))
      .to.emit(Machine, 'AddedValuesByDelegateCall')
      .withArgs(BigNumber.from(1), BigNumber.from(2), true)

    // Calculator storage DOES NOT CHANGE!
    (await Calculator.calculateResult()).should.be.bignumber.equal(BigNumber.from(0));

    // Only calculateResult in Machine contract should be changed
    (await Machine.calculateResult()).should.be.bignumber.equal(BigNumber.from(3));
    
    (await Machine.user()).should.be.equal(owner);
    (await Calculator.user()).should.be.equal(constants.ZERO_ADDRESS);
  });
});
