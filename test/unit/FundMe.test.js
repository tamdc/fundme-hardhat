const { assert, expect } = require('chai')
const { deployments, getNamedAccounts, ethers } = require('hardhat')
const { developmentNames } = require('../../helper')
!developmentNames.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
        let fundMe
        let deployer
        let mockV3Aggregator
        let sendValue = ethers.utils.parseEther("1")
        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(['all'])
            fundMe = await ethers.getContract('FundMe', deployer)
            mockV3Aggregator = await ethers.getContract('MockV3Aggregator', deployer)
        })

        describe("contructor", async () => {
            it('set the aggregator address correctly', async () => {
                const res = await fundMe.getPriceFeed()
                assert.equal(res, mockV3Aggregator.address)
            })
        })

        describe("fund", async () => {
            it("failed if not engough eth", async () => {
                await expect(fundMe.fund()).to.be.revertedWith('You need to spend more ETH!')
            })
            it('update the amount funded data structure', async () => {
                await fundMe.fund({ value: sendValue })
                const amount = await fundMe.getAddressToAmountFunded(deployer)
                assert.equal(amount.toString(), sendValue.toString())
            })
            it('add funder to array of funders', async () => {
                await fundMe.fund({ value: sendValue })
                const res = await fundMe.getFunder(0)
                assert.equal(res, deployer)
            })
        })

        describe("withdraw", async () => {
            beforeEach(async () => {
                await fundMe.fund({ value: sendValue })
            })
            it('withdraw ETH from single funder', async () => {
                // Arrange
                const startingFundMeBalance = await ethers.provider.getBalance(fundMe.address)
                const startingDeployerBalance = await ethers.provider.getBalance(deployer)

                // Act
                const response = await fundMe.withdraw()
                const recipe = await response.wait(1)
                const { gasUsed, effectiveGasPrice } = recipe
                const gasCost = gasUsed.mul(effectiveGasPrice)

                const endingFundMeBalance = await ethers.provider.getBalance(fundMe.address)
                const endingDeployerBalance = await ethers.provider.getBalance(deployer)

                // Assert
                assert.equal(endingFundMeBalance, 0)
                assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(), endingDeployerBalance.add(gasCost).toString())
            })

            it('with drawn ETH from multi funders', async () => {
                // arrage
                let accounts = await ethers.getSigners()

                const a = await ethers.provider.getBalance(accounts[1].address)
                // act
                for (let i = 1; i < 20; i++) {
                    const fundMeConnectedContract = await fundMe.connect(accounts[i])
                    await fundMeConnectedContract.fund({ value: sendValue })
                }

                const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const startingDeployerBalance = await fundMe.provider.getBalance(deployer)
                // await fundMe.connect(deployer)
                const response = await fundMe.withdraw()
                const { gasUsed, effectiveGasPrice } = await response.wait(1)
                const gasCost = gasUsed.mul(effectiveGasPrice)

                const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const endingDeployerBalance = await fundMe.provider.getBalance(deployer)

                // assert
                for (let i; i < 20; i++) {
                    const amountDonate = await fundMe.addressToAmountFunded(accounts[i].address)
                    assert.equal(amountDonate, 0)
                }
                await expect(fundMe.getFunder(0)).to.be.reverted
                assert.equal(endingFundMeBalance.toString(), 0)
                assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(), endingDeployerBalance.add(gasCost))

            })

            it('only allow owner to withdraw', async () => {
                const accounts = await ethers.getSigners()
                const attackerConnectContract = await fundMe.connect(accounts[1])
                await expect(attackerConnectContract.withdraw()).to.be.revertedWithCustomError(attackerConnectContract, 'FundMe__NotOwner')
            })
        })

        describe("cheaperWithdraw", async () => {
            beforeEach(async () => {
                await fundMe.fund({ value: sendValue })
            })
            it('withdraw ETH from single funder', async () => {
                // Arrange
                const startingFundMeBalance = await ethers.provider.getBalance(fundMe.address)
                const startingDeployerBalance = await ethers.provider.getBalance(deployer)

                // Act
                const response = await fundMe.cheaperWithdraw()
                const recipe = await response.wait(1)
                const { gasUsed, effectiveGasPrice } = recipe
                const gasCost = gasUsed.mul(effectiveGasPrice)

                const endingFundMeBalance = await ethers.provider.getBalance(fundMe.address)
                const endingDeployerBalance = await ethers.provider.getBalance(deployer)

                // Assert
                assert.equal(endingFundMeBalance, 0)
                assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(), endingDeployerBalance.add(gasCost).toString())
            })

            it('with drawn ETH from multi funders', async () => {
                // arrage
                let accounts = await ethers.getSigners()

                const a = await ethers.provider.getBalance(accounts[1].address)
                // act
                for (let i = 1; i < 20; i++) {
                    const fundMeConnectedContract = await fundMe.connect(accounts[i])
                    await fundMeConnectedContract.fund({ value: sendValue })
                }

                const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const startingDeployerBalance = await fundMe.provider.getBalance(deployer)
                // await fundMe.connect(deployer)
                const response = await fundMe.cheaperWithdraw()
                const { gasUsed, effectiveGasPrice } = await response.wait(1)
                const gasCost = gasUsed.mul(effectiveGasPrice)

                const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const endingDeployerBalance = await fundMe.provider.getBalance(deployer)

                // assert
                for (let i; i < 20; i++) {
                    const amountDonate = await fundMe.addressToAmountFunded(accounts[i].address)
                    assert.equal(amountDonate, 0)
                }
                await expect(fundMe.getFunder(0)).to.be.reverted
                assert.equal(endingFundMeBalance.toString(), 0)
                assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(), endingDeployerBalance.add(gasCost))

            })

            it('only allow owner to withdraw', async () => {
                const accounts = await ethers.getSigners()
                const attackerConnectContract = await fundMe.connect(accounts[1])
                await expect(attackerConnectContract.withdraw()).to.be.revertedWithCustomError(attackerConnectContract, 'FundMe__NotOwner')
            })
        })
    })
