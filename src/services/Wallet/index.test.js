import Wallet from './'
import response from './__mockdata__/mockAPIResponses'

global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
}

it('does not store password', () => {
  const wallet = new Wallet({ password: 'test' })
  expect(wallet.passwordHash).not.toBe('test')
})

it('can verify the set password', () => {
  const wallet = new Wallet({ password: 'test' })
  expect(() => {
    wallet.checkPassword({ password: 'invalid' })
  }).toThrow('Invalid password.')
  expect(wallet.checkPassword({ password: 'test' })).toBe(true)
})

it('can change passwords', () => {
  const wallet = new Wallet({ password: 'test' })
  expect(() => {
    wallet.changePassword({ oldPassword: 'invalid', newPassword: 'new' })
  }).toThrow('Invalid password')
  expect(
    wallet.changePassword({ oldPassword: 'test', newPassword: 'new' })
  ).toBe(true)
  expect(() => {
    wallet.checkPassword({ password: 'test' })
  }).toThrow('Invalid password')
  expect(wallet.checkPassword({ password: 'new' })).toBe(true)
})

it('can store and retrieve wallets from localStorage', () => {
  const wallet = new Wallet({ password: 'test' })
  wallet.setWallet()
  expect(localStorage.setItem).toHaveBeenCalledWith(
    'coin-wallet',
    JSON.stringify({
      id: wallet.id,
      passwordHash: wallet.passwordHash,
      addresses: wallet.addresses,
      coin: wallet.coin,
      network: wallet.network,
    })
  )
  wallet.getWallet()
  expect(localStorage.getItem).toHaveBeenCalled()
})

it('can encrypt and decrypt wallets', () => {
  const wallet = new Wallet({ password: 'test' })

  const encryptedWallet = wallet.encryptWallet({ password: 'test' })
  expect(encryptedWallet).toEqual(expect.any(String))

  expect(() => {
    wallet.decryptWallet({
      encryptedWallet,
      password: 'invalid',
    })
  }).toThrowError('Malformed UTF-8 data')

  const decryptedWallet = wallet.decryptWallet({
    encryptedWallet,
    password: 'test',
  })
  expect(decryptedWallet).toHaveProperty('id')
  expect(decryptedWallet).toHaveProperty('passwordHash')
  expect(decryptedWallet).toHaveProperty('addresses')
  expect(decryptedWallet).toHaveProperty('coin')
  expect(decryptedWallet).toHaveProperty('network')
})

it('can encrypt and decrypt private keys', () => {
  const wallet = new Wallet({ password: 'test' })
  const privateKey =
    'b0f55e9a9e10a452f8cd124add17077eae0a526d07474f4e49d3c3421db89a68'

  const encryptedPrivateKey = wallet.encryptPrivateKey({
    decryptedPrivateKey: privateKey,
    password: 'test',
  })
  expect(encryptedPrivateKey).not.toEqual(privateKey)

  const decryptedPrivateKey = wallet.decryptPrivateKey({
    encryptedPrivateKey,
    password: 'test',
  })
  expect(decryptedPrivateKey).toEqual(privateKey)

  expect(() => {
    wallet.encryptPrivateKey({
      decryptedPrivateKey: privateKey,
      password: 'invalid',
    })
  }).toThrow('Invalid password.')

  expect(() => {
    wallet.decryptPrivateKey({
      encryptedPrivateKey,
      password: 'invalid',
    })
  }).toThrow('Invalid password.')
})

it('can restore wallets from a backup', () => {
  const originalWallet = new Wallet({
    coin: 'btc',
    network: 'test3',
    password: 'test',
  })
  const encryptedWallet = originalWallet.encryptWallet({ password: 'test' })
  const newWallet = new Wallet({ password: 'test' })
  newWallet.restoreWallet({
    encryptedWallet,
    password: 'test',
  })
  expect(newWallet.id).toBe(originalWallet.id)
  expect(newWallet.coin).toBe(originalWallet.coin)
  expect(newWallet.network).toBe(originalWallet.network)
  expect(newWallet.addresses).toMatchObject(originalWallet.addresses)
})

it('handles server errors', async () => {
  fetch.mockReject(new Error('Server error'))
  const wallet = new Wallet({ password: 'test' })
  const error = await (async () => {
    try {
      await wallet.generateNewAddress({ password: 'test' })
    } catch (error) {
      return error
    }
  })()
  expect(error.message).toBe('Server error')
})

it('generates addresses', async () => {
  fetch.mockResponse(JSON.stringify(response.newAddress))
  const wallet = new Wallet({ password: 'test' })
  const id = await wallet.generateNewAddress({ password: 'test' })

  expect(wallet.addresses[id]).toHaveProperty('address')
  expect(wallet.addresses[id]).toHaveProperty('public')
  expect(wallet.addresses[id]).toHaveProperty('private')
  expect(wallet.addresses[id]).toHaveProperty('wif')
})

it('can get data about an address', async () => {
  fetch.mockResponses(
    [JSON.stringify(response.newAddress)],
    [
      JSON.stringify(
        response.addressData({ address: response.newAddress.address })
      ),
    ]
  )
  const wallet = new Wallet({ password: 'test' })
  const id = await wallet.generateNewAddress({ password: 'test' })
  const data = await wallet.getAddressData({
    addressId: id,
  })
  expect(data).toMatchObject(
    response.addressData({ address: response.newAddress.address })
  )
})

it('can get the balance of all addresses in a wallet', async () => {
  fetch.mockResponses(
    [JSON.stringify(response.newAddress)],
    [JSON.stringify(response.newAddress)],
    [
      JSON.stringify(
        response.addressData({
          address: response.newAddress.address,
          balance: 1,
        })
      ),
    ],
    [
      JSON.stringify(
        response.addressData({
          address: response.newAddress.address,
          balance: 1,
        })
      ),
    ]
  )

  const wallet = new Wallet({ password: 'test' })
  await wallet.generateNewAddress({ password: 'test' })
  await wallet.generateNewAddress({ password: 'test' })
  const walletBalance = await wallet.getWalletBalance()
  expect(walletBalance).toBe(2)
})

// Disabling this feature as it hits the API rate limit.
// it('can not send payment with an insufficient balance', async () => {
//   fetch.mockResponses(
//     [JSON.stringify(response.newAddress)],
//     [
//       JSON.stringify(
//         response.addressData({
//           address: response.newAddress.address,
//           balance: 0,
//         })
//       ),
//     ]
//   )
//   const wallet = new Wallet({ password: 'test' })
//   const id = await wallet.generateNewAddress({ password: 'test' })
//   const error = await (async () => {
//     try {
//       await wallet.sendPayment({
//         password: 'test',
//         fromAddressId: id,
//         toAddress: '',
//         amount: 1,
//       })
//     } catch (error) {
//       return error
//     }
//   })()
//   expect(error.message).toEqual('Insufficient balance.')
// })

it('can send payments to other addresses', async () => {
  fetch.mockResponses(
    [JSON.stringify(response.newAddress)],
    [
      JSON.stringify(
        response.newTransactionSkeleton({
          toAddress: 'C8h8aadUG3GgAZ2Qxw2ZQRP3W1YNSyCKGQ',
          fromAddress: response.newAddress.address,
          amount: 1,
        })
      ),
    ],
    [
      JSON.stringify(
        response.sendTransaction({
          toAddress: 'C8h8aadUG3GgAZ2Qxw2ZQRP3W1YNSyCKGQ',
          fromAddress: response.newAddress.address,
          amount: 1,
        })
      ),
    ]
  )
  const wallet = new Wallet({ password: 'test' })
  const id = await wallet.generateNewAddress({ password: 'test' })
  const tx = await wallet.sendPayment({
    password: 'test',
    fromAddressId: id,
    toAddress: '',
    amount: 1,
  })
  expect(tx).toMatchObject(
    response.sendTransaction({
      toAddress: 'C8h8aadUG3GgAZ2Qxw2ZQRP3W1YNSyCKGQ',
      fromAddress: response.newAddress.address,
      amount: 1,
    })
  )
})
