const SMART = artifacts.require("SMART");
const STAKING = artifacts.require("Staking");
const BRIDGE = artifacts.require("BridgeOut");
const { expectEvent, expectRevert, time } = require("@openzeppelin/test-helpers");

const { ethers } = require("hardhat");
const provider = ethers.provider;

toWei = (num) => web3.utils.toWei(num);

contract("Staking", async ([manager, ID1, ID2, ID3, ID4, ID5]) => {
	
	let Smart, StakingContract, Brige;
	
	const firstCast = (Date.now() + time.duration.years(2));
	
	before(async () => {
    	Smart = await SMART.new(manager, toWei('1000'), "SMART", "SMT", 100, ID4, ID5);/** revisar parametros en el contrato */

		Bridge = await BRIDGE.new(manager, Smart.address, toWei('0.001'));

    	StakingContract = await STAKING.new(toWei('1000'), Smart.address, "LP", "LP");
		
		await Smart.setWallets(ID4, ID5,{ from: manager });
	});

	it("use bridge", async function () {
		await Smart.approve(Bridge.address, toWei("1000000"),{ from: manager });

		const preBlanaceManager = Number(await provider.getBalance(manager));
		
		await Bridge.claimRequest(ID1,{ from: ID1, value: toWei('0.001') });
		await Bridge.claimRequest(ID2,{ from: ID2, value: toWei('0.001') });
		await Bridge.claimRequest(ID3,{ from: ID3, value: toWei('0.001') });
		
		const posBlanaceManager = Number(await provider.getBalance(manager));
        expect(posBlanaceManager).to.be.greaterThan(preBlanaceManager);

		await Bridge.claim(ID1, toWei('300'),{ from: manager });
        expect(Number(await Smart.balanceOf(ID1))).to.be.equal(Number(toWei('300')));
		await Bridge.claim(ID2, toWei('200'),{ from: manager });
        expect(Number(await Smart.balanceOf(ID2))).to.be.equal(Number(toWei('200')));
		await Bridge.claim(ID3, toWei('200'),{ from: manager });
        expect(Number(await Smart.balanceOf(ID3))).to.be.equal(Number(toWei('200')));
	});

	it("Make a transfer", async function () {
		await Smart.transfer(ID2, toWei("10"),{ from: ID3 });
		// expect(Number(await Bhm.balanceOf(ID3))).to.be.equal(Number(toWei('190')));
	});

	it("Make a stake", async function () {
		await Smart.approve(StakingContract.address, toWei("1000000"),{ from: ID1 });
		
        expect(Number(await Smart.balanceOf(ID1))).to.be.equal(Number(toWei('300')));
		await StakingContract.staking(toWei('0.1'),{ from: ID1 });
		await StakingContract.staking(toWei('0.1'),{ from: ID1 });
		
        expect(Number(await Smart.balanceOf(ID1))).to.be.equal(Number(toWei('299.8')));
		await StakingContract.withdraw(toWei('0.2'),{ from: ID1 });
        expect(Number(await Smart.balanceOf(ID1))).to.be.equal(Number(toWei('300')));
		
	});

	it("Stay with role", async function () {
		
		await Smart.approve(StakingContract.address, toWei("1000000"),{ from: ID2 });
		await Smart.approve(StakingContract.address, toWei("1000000"),{ from: ID3 });
		
		await StakingContract.staking(499 * 1e12,{ from: ID2 });
		await StakingContract.staking(500 * 1e12,{ from: ID3 });
		
        expect(Number(await StakingContract.getRole(ID2))).to.be.equal(0);
        expect(Number(await StakingContract.getRole(ID3))).to.be.equal(0);
		await time.increase(time.duration.minutes(30));
        expect(Number(await StakingContract.getRole(ID2))).to.be.equal(0);
        expect(Number(await StakingContract.getRole(ID3))).to.be.equal(1);
		
		await StakingContract.staking(1 * 1e12,{ from: ID2 });
		await StakingContract.withdraw(1 * 1e12,{ from: ID3 });
		await time.increase(time.duration.minutes(30));
		
        expect(Number(await StakingContract.getRole(ID2))).to.be.equal(1);
        expect(Number(await StakingContract.getRole(ID3))).to.be.equal(0);
		
		await StakingContract.staking(4500 * 1e12,{ from: ID2 });
		await StakingContract.staking(4500 * 1e12,{ from: ID3 });
		await time.increase(time.duration.minutes(60));
		
        expect(Number(await StakingContract.getRole(ID2))).to.be.equal(2);
        expect(Number(await StakingContract.getRole(ID3))).to.be.equal(1);
		
		await StakingContract.withdraw(1 * 1e12,{ from: ID2 });
		await StakingContract.staking(1 * 1e12,{ from: ID3 });
        expect(Number(await StakingContract.getRole(ID2))).to.be.equal(1);
        expect(Number(await StakingContract.getRole(ID3))).to.be.equal(1);

		await time.increase(time.duration.minutes(60));
		
        expect(Number(await StakingContract.getRole(ID2))).to.be.equal(1);
        expect(Number(await StakingContract.getRole(ID3))).to.be.equal(2);
	});

	it("withdraw", async function () {

	});
});