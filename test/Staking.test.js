const BHM = artifacts.require("BHM");
const STAKING = artifacts.require("Staking");
const BRIDGE = artifacts.require("BridgeOut");
const { expectEvent, expectRevert, time } = require("@openzeppelin/test-helpers");

toWei = (num) => web3.utils.toWei(num);

contract("Staking", async ([manager, ID1, ID2, ID3, ID4, ID5]) => {
	
	let Bhm, StakingContract, Brige;
	
	const firstCast = (Date.now() + time.duration.years(2));
	
	before(async () => {
    	Bhm = await BHM.new(manager, toWei('1000'), "BHM", "BHM", ID4, ID5);

		Bridge = await BRIDGE.new(manager, Bhm.address, toWei('0.001'));

    	StakingContract = await STAKING.new(toWei('1000'), Bhm.address, "LP", "LP");
		
		await Bhm.setStakingAddress(StakingContract.address,{ from: manager });
	});

	it("use bridge", async function () {
		await Bhm.approve(Bridge.address, toWei("1000000"),{ from: manager });

		await Bridge.claimRequest(ID1,{ from: ID1, value: toWei('0.001') });
		await Bridge.claimRequest(ID2,{ from: ID2, value: toWei('0.001') });
		await Bridge.claimRequest(ID3,{ from: ID3, value: toWei('0.001') });

		await Bridge.claim(ID1, toWei('300'),{ from: manager });
        expect(Number(await Bhm.balanceOf(ID1))).to.be.equal(Number(toWei('300')));
		await Bridge.claim(ID2, toWei('200'),{ from: manager });
        expect(Number(await Bhm.balanceOf(ID2))).to.be.equal(Number(toWei('200')));
		await Bridge.claim(ID3, toWei('200'),{ from: manager });
        expect(Number(await Bhm.balanceOf(ID3))).to.be.equal(Number(toWei('200')));
	});

	it("Make a transfer", async function () {
		await Bhm.transfer(ID2, toWei("10"),{ from: ID3 });
		// expect(Number(await Bhm.balanceOf(ID3))).to.be.equal(Number(toWei('190')));
	});

	it("Make a stake", async function () {
		await Bhm.approve(StakingContract.address, toWei("1000000"),{ from: ID1 });
		
        expect(Number(await Bhm.balanceOf(ID1))).to.be.equal(Number(toWei('300')));
		await StakingContract.staking(toWei('0.1'),{ from: ID1 });
		await StakingContract.staking(toWei('0.1'),{ from: ID1 });
		
        expect(Number(await Bhm.balanceOf(ID1))).to.be.equal(Number(toWei('299.8')));
		await StakingContract.withdraw(toWei('0.2'),{ from: ID1 });
        expect(Number(await Bhm.balanceOf(ID1))).to.be.equal(Number(toWei('300')));
		
	});

	it("Stay with role", async function () {
		
		await Bhm.approve(StakingContract.address, toWei("1000000"),{ from: ID2 });
		await Bhm.approve(StakingContract.address, toWei("1000000"),{ from: ID3 });
		
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