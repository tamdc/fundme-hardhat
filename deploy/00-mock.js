const { network } = require("hardhat")
const { DECIMAL, INITIAL_ANSWER } = require("../helper")

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (chainId === 31337) {
        log('Local network detected! Deploying mock...')
        await deploy('MockV3Aggregator', {
            contract: "MockV3Aggregator",
            from: deployer,
            args: [DECIMAL, INITIAL_ANSWER],
            log: true
        })
        log('Mock deployed!')
        log('---------------------------------')
    }
}

module.exports.tags = ["all", "mock"]