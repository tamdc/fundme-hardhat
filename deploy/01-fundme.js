const { network } = require("hardhat")
const { networkConfig, developmentNames } = require("../helper")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress

    if (developmentNames.includes(network.name)) {
        const mockContract = await deployments.get('MockV3Aggregator')
        ethUsdPriceFeedAddress = mockContract.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeedAddress']
    }
    const args = [ethUsdPriceFeedAddress]

    const fundMe = await deploy('FundMe', {
        contract: "FundMe",
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })
    log("Contract deployed!")

    if (!developmentNames.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, args)
    }

}

module.exports.tags = ["fundme", "all"] 