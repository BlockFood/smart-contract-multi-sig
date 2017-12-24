const MultiSignatureWallet = artifacts.require('./MultiSignatureWallet.sol')

contract('MultiSignatureWallet', (accounts) => {
    it('should be deployed', async () => {
        await MultiSignatureWallet.deployed()
    })

    it('should be deployed with the right parameters', async () => {
        const instance = await MultiSignatureWallet.deployed()

        const [owners, signaturesRequired] = await Promise.all([
            Promise.all([
                instance.owners(0),
                instance.owners(1),
                instance.owners(2),
                instance.owners(3),
            ]),
            instance.signaturesRequired()
        ])

        assert.deepEqual(owners, accounts.slice(0, 4), 'owners are not correct')
        assert.equal(signaturesRequired.toNumber(), 2, 'signaturesRequired is not correct')
    })

    describe('submitTransaction()', () => {
        it('should only be callable by an owner', async () => {
            const instance = await MultiSignatureWallet.deployed()

            let hasFailed = false
            try {
                await instance.submitTransaction(accounts[5], web3.toWei(1, 'ether'), { from: accounts[5] })
            } catch (e) {
                hasFailed = true
            }
            assert.equal(hasFailed, true, 'submitTransaction was successfully called by an external account')
        })

        it('should emit a NewTransaction event', async () => {
            const instance = await MultiSignatureWallet.deployed()

            const { logs } = await instance.submitTransaction(accounts[5], web3.toWei(1, 'ether'))

            const event = logs[0]

            assert.equal(event.event, 'NewTransaction', 'event name is wrong')
        })

        it('should store the new transaction', async () => {
            const instance = await MultiSignatureWallet.deployed()

            const { logs } = await instance.submitTransaction(accounts[5], web3.toWei(1, 'ether'))

            const transactionId = logs[0].args.transactionId

            const transaction = await instance.transactions(transactionId)

            const [target, amount, confirmations] = transaction

            assert.equal(target, accounts[5])
            assert.equal(amount, web3.toWei(1, 'ether'))
            assert.equal(confirmations, 1)
        })

        it('should work more than one time', async () => {
            const instance = await MultiSignatureWallet.deployed()

            const firstCall = await instance.submitTransaction(accounts[5], web3.toWei(1, 'ether'))
            const secondCall = await instance.submitTransaction(accounts[6], web3.toWei(2, 'ether'))

            const firstTransaction = await instance.transactions(firstCall.logs[0].args.transactionId)
            const secondTransaction = await instance.transactions(secondCall.logs[0].args.transactionId)

            assert.equal(firstTransaction[0], accounts[5])
            assert.equal(secondTransaction[0], accounts[6])
        })
    })

})