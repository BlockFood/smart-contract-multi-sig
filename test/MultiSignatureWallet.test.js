const MultiSignatureWallet = artifacts.require('./MultiSignatureWallet.sol')

contract('MultiSignatureWallet', (accounts) => {
    it('should be deployed', async () => {
        await MultiSignatureWallet.deployed()
    })

    it('should be deployed with the right parameters', async () => {
        const instance = await MultiSignatureWallet.deployed()

        const [ owners, signaturesRequired] = await Promise.all([
            Promise.all([
                instance.owners(0),
                instance.owners(1),
                instance.owners(2),
                instance.owners(3),
            ]),
            instance.signaturesRequired()
        ])

        assert.equal(owners[0], accounts[0])
        assert.equal(owners[1], accounts[1])
        assert.equal(owners[2], accounts[2])
        assert.equal(owners[3], accounts[3])
        assert.equal(signaturesRequired.toNumber(), 2)
    })
})