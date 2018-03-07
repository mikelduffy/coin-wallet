import uuid from 'uuid/v4'
import aes from 'crypto-js/aes'
import sha3 from 'crypto-js/sha3'
import encUtf8 from 'crypto-js/enc-utf8'
import bitcoin from 'bitcoinjs-lib'
import bigi from 'bigi'
import buffer from 'buffer'
import request from '../../helpers/request'
import { validateWalletOptions, isRequired } from '../../helpers/validation'

/**
 * @class Wallet
 * @description Allows for blockchain interfacing using the blockcypher API. Supported coin and chain options include bcy (test), btc (test3, main), ltc (main), and doge (main).
 * @export
 */
export default class Wallet {
  constructor({
    coin = 'bcy',
    network = 'test',
    password = isRequired('password'),
  } = {}) {
    validateWalletOptions({ coin, network })
    this.id = uuid()
    this.addresses = {}
    this.passwordHash = sha3(password).toString()
    this.coin = coin
    this.network = network
    this.baseURL = `https://api.blockcypher.com/v1/${coin}/${network}/`
    this.apiKey = process.env.REACT_APP_BCYPHER_API_KEY
  }

  checkPassword = ({ password = isRequired('password') }) => {
    if (sha3(password).toString() !== this.passwordHash)
      throw new Error('Invalid password.')
    return true
  }

  changePassword = ({
    oldPassword = isRequired('old password'),
    newPassword = isRequired('new password'),
  }) => {
    this.checkPassword({ password: oldPassword })
    this.passwordHash = sha3(newPassword).toString()
    return true
  }

  getWallet = () => localStorage.getItem('coin-wallet')

  setWallet = () => {
    const wallet = {
      id: this.id,
      passwordHash: this.passwordHash,
      addresses: this.addresses,
      coin: this.coin,
      network: this.network,
    }

    localStorage.setItem('coin-wallet', JSON.stringify(wallet))
  }

  removeWallet = () => localStorage.removeItem('coin-wallet')

  encryptWallet = ({ password = isRequired('password') }) => {
    this.checkPassword({ password })
    const wallet = {
      id: this.id,
      passwordHash: this.passwordHash,
      addresses: this.addresses,
      coin: this.coin,
      network: this.network,
    }
    return aes.encrypt(JSON.stringify(wallet), password).toString()
  }

  decryptWallet = ({
    encryptedWallet = this.getWallet(),
    password = isRequired('password'),
  }) => {
    let wallet = aes.decrypt(encryptedWallet, password)
    wallet = JSON.parse(wallet.toString(encUtf8))
    return wallet
  }

  encryptPrivateKey = ({
    decryptedPrivateKey = isRequired('decrypted private key'),
    password = isRequired('password'),
  }) => {
    this.checkPassword({ password })
    return aes.encrypt(decryptedPrivateKey, password).toString()
  }

  decryptPrivateKey = ({
    encryptedPrivateKey = isRequired('encrypted private key'),
    password = isRequired('password'),
  }) => {
    this.checkPassword({ password })
    let decryptedPrivateKey = aes.decrypt(encryptedPrivateKey, password)
    decryptedPrivateKey = decryptedPrivateKey.toString(encUtf8)
    return decryptedPrivateKey
  }

  downloadWallet = ({ password = isRequired('password') }) => {
    // https://stackoverflow.com/a/30800715/3141988
    const walletData = `data:text/plain;charset=utf-8,${encodeURIComponent(
      this.encryptWallet({ password })
    )}`
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute('href', walletData)
    downloadAnchorNode.setAttribute('download', `${this.coin}-${this.id}`)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  restoreWallet = ({
    encryptedWallet = isRequired('encrypted wallet'),
    password = isRequired('password'),
  }) => {
    const wallet = this.decryptWallet({ encryptedWallet, password })
    this.id = wallet.id
    this.addresses = wallet.addresses
    this.coin = wallet.coin
    this.network = wallet.network
    this.baseURL = `https://api.blockcypher.com/v1/${this.coin}/${
      this.network
    }/`
  }

  generateNewAddress = async ({ password = isRequired('password') }) => {
    this.checkPassword({ password })
    const address = await request({
      url: `${this.baseURL}addrs`,
      method: 'POST',
    })
    const encryptPrivateKey = this.encryptPrivateKey({
      decryptedPrivateKey: address.private,
      password,
    })
    address.private = encryptPrivateKey
    const id = uuid()
    this.addresses[id] = address
    return id
  }

  getAddressData = async ({ addressId = isRequired('address id') }) => {
    const data = await request({
      url: `${this.baseURL}addrs/${this.addresses[addressId].address}`,
      method: 'GET',
    })
    return data
  }

  getWalletBalance = async () => {
    let walletBalance = 0
    for (const addressId in this.addresses) {
      const data = await this.getAddressData({ addressId })
      walletBalance += data.balance
    }
    return walletBalance
  }

  sendPayment = async ({
    password = isRequired('password'),
    fromAddressId = isRequired('from address id'),
    toAddress = isRequired('to address'),
    amount = isRequired('amount'),
  }) => {
    this.checkPassword({ password })
    const fromAddress = this.addresses[fromAddressId]

    // Check balance
    const { balance } = await this.getAddressData({ addressId: fromAddressId })
    if (balance < amount) {
      throw new Error('Insufficient balance.')
    }

    // Get transaction data to sign
    const newTx = {
      inputs: [{ addresses: [fromAddress] }],
      outputs: [{ addresses: [toAddress], value: amount }],
    }
    const txSkeleton = await request({
      url: `${this.baseURL}txs/new`,
      method: 'POST',
      body: newTx,
    })

    // Sign transaction
    const decryptedPrivateKey = this.decryptPrivateKey({
      encryptedPrivateKey: this.addresses[fromAddressId].private,
      password,
    })
    const keys = new bitcoin.ECPair(bigi.fromHex(decryptedPrivateKey))
    txSkeleton.pubkeys = []
    txSkeleton.signatures = txSkeleton.tosign.map(function(tosign, n) {
      txSkeleton.pubkeys.push(keys.getPublicKeyBuffer().toString('hex'))
      return keys
        .sign(new buffer.Buffer(tosign, 'hex'))
        .toDER()
        .toString('hex')
    })

    // Send signed transaction
    const tx = await request({
      url: `${this.baseURL}txs/send`,
      method: 'POST',
      body: txSkeleton,
    })
    return tx
  }
}
