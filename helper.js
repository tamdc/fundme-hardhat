const networkConfig = {
    5: {
        name: 'goerli',
        ethUsdPriceFeedAddress: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e'
    }
}

const developmentNames = ["hardhat", "localhost"]
const DECIMAL = 8
const INITIAL_ANSWER = 120000000000


module.exports = {
    networkConfig,
    developmentNames,
    DECIMAL,
    INITIAL_ANSWER
}