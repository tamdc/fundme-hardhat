const { assert } = require("chai")
const { ethers, getNamedAccounts, network } = require("hardhat")
const { developmentNames } = require("../../helper")


developmentNames.includes(network.name)
    ? describe.skip
    : describe('FundMe staging', async () => {
        let fundMe
        let deployer
        const sendValue = ethers.utils.parseEther('0.04')
        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer
            fundMe = await ethers.getContract('FundMe', deployer)
        })

        it('can fund and withdraw from contract', async () => {
            // const fundRes = await fundMe.fund({ value: sendValue })
            // await fundRes.wait(1)
            // const res = await fundMe.withdraw()
            // await res.wait(1);
            // const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            // assert.equal(endingFundMeBalance.toString(), "0")
            // console.log('done comapare')


            const fundTxResponse = await fundMe.fund({ value: sendValue })
            await fundTxResponse.wait(1)
            const withdrawTxResponse = await fundMe.withdraw()
            await withdrawTxResponse.wait(1)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            console.log(
                endingFundMeBalance.toString() +
                " should equal 0, running assert equal..."
            )
            assert.equal(endingFundMeBalance.toString(), "0")
        })
    })