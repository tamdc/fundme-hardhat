const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log(`Got contract FundMe at ${fundMe.address}`)
    console.log("Funding contract...")
    const fundResponse = await fundMe.fund({ value: ethers.utils.parseEther("0.04") })
    fundResponse.wait(1)
    console.log("Donated!")
}

main()
    .then(_ => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })