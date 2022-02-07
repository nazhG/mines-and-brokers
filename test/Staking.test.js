const BHM = artifacts.require("BHM");
const STAKING = artifacts.require("Staking");
const { expectEvent, expectRevert, time } = require("@openzeppelin/test-helpers");

toWei = (num) => web3.utils.toWei(num);

contract("Staking", async ([manager, ID1, ID2, ID3, ID4]) => {
	
	let Bhm, StakingContract;
	
	const firstCast = (Date.now() + time.duration.years(2));
	
	before(async () => {
    	Bhm = await BHM.new(manager, toWei('1000'), "BHM", "BHM");
		await Bhm.transfer(ID1, toWei('200'),{ from: manager });

    	StakingContract = await STAKING.new(toWei('1000'), Bhm.address, "LP", "LP");
	});

	it("Make a stake", async function () {
		
		await Bhm.approve(StakingContract.address, toWei('10'),{ from: ID1 });
		
		console.log(Number(await Bhm.balanceOf(StakingContract.address)));
		await StakingContract.staking(toWei('10'),{ from: ID1 });
		console.log(await StakingContract.getStake(ID1));
		console.log(Number(await Bhm.balanceOf(StakingContract.address)));
		await StakingContract.withdraw(toWei('10'),{ from: ID1 });
		console.log(await StakingContract.getStake(ID1));
		await Bhm.approve(StakingContract.address, toWei('2'),{ from: ID1 });
		await StakingContract.staking(toWei('2'),{ from: ID1 });
		await StakingContract.withdraw(toWei('1'),{ from: ID1 });
		await StakingContract.withdraw(toWei('1'),{ from: ID1 });
		
	});
});