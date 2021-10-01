const Greeter = artifacts.require("Greeter");
const { expectEvent, expectRevert, time } = require("@openzeppelin/test-helpers");

contract("Basic", ([user]) => {

	let greeter

	before(async function () {
    	greeter = await Greeter.new("Hey")
	});

	it("Init test", async function () {
		assert.equal((await greeter.greet()).toString(), "Hey", "[message]");
	});
});