const IUniswapV2Router = artifacts.require("IUniswapV2Router");
const IUniswapV2Factory = artifacts.require("IUniswapV2Factory");
const IUniswapV2Pair = artifacts.require("IUniswapV2Pair");
const {
	expectEvent,
	expectRevert,
	time,
  } = require("@openzeppelin/test-helpers");
const BN = require("bn.js");

const IWETH = artifacts.require("IWETH");
const { WETH, DAI, WETH_WHALE, DAI_WHALE } = require("./token_address");
const IERC20 = artifacts.require("IERC20");

const toWei = (value) => web3.utils.toWei(String(value));

function cast(x) {
	if (x instanceof BN) {
		return x;
	}
	return new BN(x);
}

function eq(x, y) {
	x = cast(x);
	y = cast(y);
	return x.eq(y);
}

function pow(x, y) {
	x = cast(x);
	y = cast(y);
	return x.pow(y);
}

contract("LP stake", ([user]) => {
	let uniRouter;
	let uniFactory;
	let uniPair;
	let iweth;
	let dai;
	const MaxUint256 = pow(2, 254);

	before(async function () {
		uniRouter = await IUniswapV2Router.at('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D')
		uniFactory = await IUniswapV2Factory.at('0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f')
		iweth = await IWETH.at(WETH)
    	dai = await IERC20.at(DAI)

		await iweth.deposit({from: user, value: toWei('2')});

		await uniRouter.swapExactETHForTokens(
			1,
			[WETH, DAI],
			user,
			(await time.latest()) + 10,
			{from: user, value: toWei('1')})
	});

	it("deposit", async function () {

		const pairAddress = await uniFactory.getPair(DAI, WETH)
		uniPair = await IUniswapV2Pair.at(pairAddress)

		// it('removeLiquidityETHSupportingFeeOnTransferTokens', async () => {
			const DAIAmount = cast(1) * pow(1, 18)
			const ETHAmount = cast(2) * pow(1, 18)
			
			await dai.approve(uniRouter.address, 100000000, { from: user })
			await dai.transferFrom(user, uniRouter.address, 1)
			await uniRouter.addLiquidityETH(DAI, 10000, 1, 1, user, (await time.latest() + 10), {
			  from: user,
			  value: ETHAmount
			})
		
			// const DAIInPair = await DTT.balanceOf(pair.address)
			// const WETHInPair = await WETH.balanceOf(pair.address)
			// const liquidity = await pair.balanceOf(wallet.address)
			// const totalSupply = await pair.totalSupply()
			// const NaiveDAIExpected = (DAIInPair * liquidity) / totalSupply
			// const WETHExpected = (WETHInPair * liquidity) / totalSupply
		
		// 	await pair.approve(router.address, MaxUint256)
		// 	await router.removeLiquidityETHSupportingFeeOnTransferTokens(
		// 	  DTT.address,
		// 	  liquidity,
		// 	  NaiveDTTExpected,
		// 	  WETHExpected,
		// 	  wallet.address,
		// 	  MaxUint256,
		// 	  overrides
		// 	)
		//   })
		
		//   it('removeLiquidityETHWithPermitSupportingFeeOnTransferTokens', async () => {
		// 	const DTTAmount = expandTo18Decimals(1)
		// 	  .mul(100)
		// 	  .div(99)
		// 	const ETHAmount = expandTo18Decimals(4)
		// 	await addLiquidity(DTTAmount, ETHAmount)
		
		// 	const expectedLiquidity = expandTo18Decimals(2)
		
		// 	const nonce = await pair.nonces(wallet.address)
		// 	const digest = await getApprovalDigest(
		// 	  pair,
		// 	  { owner: wallet.address, spender: router.address, value: expectedLiquidity.sub(MINIMUM_LIQUIDITY) },
		// 	  nonce,
		// 	  MaxUint256
		// 	)
		// 	const { v, r, s } = ecsign(Buffer.from(digest.slice(2), 'hex'), Buffer.from(wallet.privateKey.slice(2), 'hex'))
		
		// 	const DTTInPair = await DTT.balanceOf(pair.address)
		// 	const WETHInPair = await WETH.balanceOf(pair.address)
		// 	const liquidity = await pair.balanceOf(wallet.address)
		// 	const totalSupply = await pair.totalSupply()
		// 	const NaiveDTTExpected = DTTInPair.mul(liquidity).div(totalSupply)
		// 	const WETHExpected = WETHInPair.mul(liquidity).div(totalSupply)
		
		// 	await pair.approve(router.address, MaxUint256)
		// 	await router.removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
		// 	  DTT.address,
		// 	  liquidity,
		// 	  NaiveDTTExpected,
		// 	  WETHExpected,
		// 	  wallet.address,
		// 	  MaxUint256,
		// 	  false,
		// 	  v,
		// 	  r,
		// 	  s,
		// 	  overrides
		// 	)


		assert.ok(true, "[message]");
	});
});