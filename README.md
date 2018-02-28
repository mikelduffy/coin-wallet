# Coin Wallet

## About

Coin Wallet is a standalone browser-based cryptocurrency wallet. It bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) and uses the Semantic UI React component library. The BlockCypher API is used to interface with the blockchain.

## Features

* Import existing wallet
* First time user setup
  * Create wallet
  * Set password
  * Store wallet in local storage
  * Download backup of wallet
* Main page
  * Quick send/request payment buttons
* Settings page
  * Export wallet
  * Change wallet password

## Getting Started

* Clone this repository with `git clone [repo] && cd ./coin-wallet`
* Run `cp .env.local-sample .env.local` and add your blockcypher API key
* Start the application with `yarn start` or `npm start`

## Testing

* Run `yarn run test` or `npm run test` to test the application

## API Considerations

* The blockchain.info api takes 2-3 business days to provide an API key, which is required for creating new accounts. Additionally their API [does not support a testnet](https://bitcoin.stackexchange.com/a/38493), which complicates the development process. However, their websocket feature would make it easy to update new transactions without the need for long polling.
* The bitgo API has a pretty robust javascript library which offers testnet support as well as returning promises to utilize async/await. They only support webhook notifications, so a deployed backend and websocket/eventsource would be required for real-time transaction updates. Long polling their list transactions API is also an option. The biggest downside of using their API is their pricing model (0.25% of each outgoing transaction).
* The blockcypher API supports a test net, multiple currencies, a RESTful API as well as a javascript library. They have a free limited useage API, which would be sufficient for this project. They also have a websocket feature, however it does not have the option to listen for events from a specified address.
