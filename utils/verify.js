
const hardhat = require("hardhat")

async function verify(contractAddress, args) {
    try {
        await hardhat.run("verify:verify", {
            address: contractAddress,
            constructorArguments: args
        })
    } catch (e) {
        if (e.message.toLowerCase().includes('already verified')) {
            console.log("Already Verified");
        } else {
            console.error(e)
        }
    }
}

module.exports = {
    verify
}