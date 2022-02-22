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
		await Bhm.transfer(ID2, toWei('200'),{ from: manager });
		await Bhm.transfer(ID3, toWei('200'),{ from: manager });

    	StakingContract = await STAKING.new(toWei('1000'), Bhm.address, "LP", "LP");
	});

	it("Make a stake", async function () {
		
		await Bhm.approve(StakingContract.address, toWei("1000000"),{ from: ID1 });
		
		
        expect(Number(await Bhm.balanceOf(ID1))).to.be.equal(Number(toWei('200')));
		await StakingContract.staking(toWei('0.1'),{ from: ID1 });
		await StakingContract.staking(toWei('0.1'),{ from: ID1 });
        expect(Number(await Bhm.balanceOf(ID1))).to.be.equal(Number(toWei('199.8')));
		await StakingContract.withdraw(toWei('0.2'),{ from: ID1 });
        expect(Number(await Bhm.balanceOf(ID1))).to.be.equal(Number(toWei('200')));
		
	});

	it("Stay with role", async function () {
		
		await Bhm.approve(StakingContract.address, toWei("1000000"),{ from: ID2 });
		await Bhm.approve(StakingContract.address, toWei("1000000"),{ from: ID3 });
		
		await StakingContract.staking(499 * 1e12,{ from: ID2 });
		await StakingContract.staking(500 * 1e12,{ from: ID3 });
		
        expect(Number(await StakingContract.getRole(ID2))).to.be.equal(0);
        expect(Number(await StakingContract.getRole(ID3))).to.be.equal(0);
		await time.increase(time.duration.minutes(30));
		console.log(await time.latest());
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
});