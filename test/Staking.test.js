const BHM = artifacts.require("BHM");
const STAKING = artifacts.require("Staking");
const { expectEvent, expectRevert, time } = require("@openzeppelin/test-helpers");

toWei = (num) => web3.utils.toWei(num);

contract("Staking", async ([manager, ID1, ID2, ID3, ID4]) => {
	
	let Bhm, StakingContract;
	
	const firstCast = ((await time.latest()) + time.duration.month(2));
	console.log((await time.latest()));
	
	before(async () => {
    	Bhm = await BHM.new("BHM", "BHM");

		// Init balances
		await Bhm.mint(ID1, toWei('100'));
		await Bhm.mint(ID2, toWei('100'));
		await Bhm.mint(ID3, toWei('100'));
		await Bhm.mint(ID4, toWei('100'));

    	StakingContract = await STAKING.new(Bhm.address, 100);
	});

	it("Make a stake", async function () {
		
		await Bhm.approve(StakingContract.address, toWei('10'),{ from: ID1 });
		await StakingContract.staking(toWei('10'),{ from: ID1 });
	});
});