const SMART = artifacts.require("SMART");
const STAKING = artifacts.require("Staking");
const { expectEvent, expectRevert, time } = require("@openzeppelin/test-helpers");

const { ethers } = require("hardhat");
const provider = ethers.provider;

toWei = (num) => web3.utils.toWei(num);

contract("Staking", async ([manager, ID1, ID2, ID3, ID4, ID5]) => {
	
	let Smart, StakingContract;
	
	const firstCast = (Date.now() + time.duration.years(2));

	const _fee = 1000;
	const fee = 0.1;
	
	before(async () => {
    	Smart = await SMART.new(manager, toWei('100000000'), "SMART", "SMT", _fee, ID4, ID5);/** revisar parametros en el contrato */

    	StakingContract = await STAKING.new(
			toWei('100000000'), 
			Smart.address, 
			"LP", 
			"LP",
			[
				time.duration.minutes(30),
				toWei('50'),
			],
			[
				time.duration.minutes(30),
				toWei('500'),
			],
			[
				time.duration.minutes(30),
				toWei('5000'),
			],
			[
				time.duration.minutes(30),
				toWei('5000'),
			],
		);
		
		await Smart.setStakingAddress(StakingContract.address, ID4, ID5,{ from: manager });
	});

	it("Make a transfer", async function () {
		
		await Smart.transfer(ID2, toWei("10"),{ from: manager });
		expect(Number(await Smart.balanceOf(ID2))).to.be.equal(Number(toWei('10')));
	});

	it("Make a stake", async function () {

		await Smart.transfer(ID1, toWei("300"),{ from: manager });
		await Smart.approve(StakingContract.address, toWei("1000000"),{ from: ID1 });
		
        expect(Number(await Smart.balanceOf(ID1))).to.be.equal(Number(toWei('300')));
		await StakingContract.staking(toWei('0.1'),{ from: ID1 });
		await StakingContract.staking(toWei('0.1'),{ from: ID1 });
		
        expect(Number(await Smart.balanceOf(ID1))).to.be.equal(Number(toWei('299.76')));
		await StakingContract.withdraw(toWei('0.2'),{ from: ID1 });
        expect(Number(await Smart.balanceOf(ID1))).to.be.equal(Number(toWei('299.96')));
		
	});

	it("Stay with role", async function () {
		
		await Smart.transfer(ID2, toWei("50000"),{ from: manager });
		await Smart.approve(StakingContract.address, toWei("1000000"),{ from: ID2 });
		await Smart.transfer(ID3, toWei("50000"),{ from: manager });
		await Smart.approve(StakingContract.address, toWei("1000000"),{ from: ID3 });
		
		await StakingContract.staking(toWei('49'),{ from: ID2 });
		await StakingContract.staking(toWei('50'),{ from: ID3 });
		
        expect(Number(await StakingContract.getRole(ID2))).to.be.equal(0);
        expect(Number(await StakingContract.getRole(ID3))).to.be.equal(0);
		await time.increase(time.duration.minutes(30));
        expect(Number(await StakingContract.getRole(ID2))).to.be.equal(0);
        expect(Number(await StakingContract.getRole(ID3))).to.be.equal(1);
		
		await StakingContract.staking(toWei('1'),{ from: ID2 });
		await StakingContract.withdraw(toWei('1'),{ from: ID3 });
		await time.increase(time.duration.minutes(30));
		
        expect(Number(await StakingContract.getRole(ID2))).to.be.equal(1);
        expect(Number(await StakingContract.getRole(ID3))).to.be.equal(0);
		
		await StakingContract.staking(toWei('500'),{ from: ID2 });
		await StakingContract.staking(toWei('500'),{ from: ID3 });
		await time.increase(time.duration.minutes(60));
		
        expect(Number(await StakingContract.getRole(ID2))).to.be.equal(2);
        expect(Number(await StakingContract.getRole(ID3))).to.be.equal(2);
		
		await StakingContract.withdraw(toWei('1'),{ from: ID2 });
		await StakingContract.staking(toWei('1'),{ from: ID3 });
        expect(Number(await StakingContract.getRole(ID2))).to.be.equal(2);
        expect(Number(await StakingContract.getRole(ID3))).to.be.equal(2);

		await time.increase(time.duration.minutes(60));
		
        expect(Number(await StakingContract.getRole(ID2))).to.be.equal(2);
        expect(Number(await StakingContract.getRole(ID3))).to.be.equal(2);
	});
});