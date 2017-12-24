const MultiSignatureWallet = artifacts.require("./MultiSignatureWallet.sol")

module.exports = (deployer, test, accounts) => {
  deployer.deploy(MultiSignatureWallet, [
      accounts[0],
      accounts[1],
      accounts[2],
      accounts[3],
  ], 2)
}

