import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui-next/styles'
import Paper from 'material-ui-next/Paper'
import Loader from '../Loader'
import TransactionInformation from './TransactionInformation'
import NewTransaction from './NewTransaction'
import TransactionListing from './TransactionListing'

const styles = theme => ({
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    height: '-webkit-fill-available',
  },
  toolbar: theme.mixins.toolbar,
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    margin: theme.spacing.unit * 3,
  }),
  button: {
    margin: '20px 0px 20px 0px',
  },
})

class Dashboard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    wallet: PropTypes.object.isRequired,
  }

  async componentWillMount() {
    await this.handleRefresh()
  }

  initialState = {
    status: 'loading', // init, idle, error
    address: '',
    balance: 0,
    unconfirmedBalance: 0,
    finalBalance: 0,
    numberOfTx: 0,
    unconfirmedNumberOfTx: 0,
    txRefs: [],
    unconfirmedTxRefs: [],
    totalSent: 0,
    totalReceive: 0,
  }

  state = this.initialState

  handleRefresh = async () => {
    try {
      this.setState({ status: 'loading' })
      // Use the first available wallet address. This should be made dynamic to support multiple addresses within a single wallet.
      const addressId = Object.keys(this.props.wallet.addresses)[0]
      const {
        address,
        balance,
        final_balance,
        n_tx,
        txrefs,
        total_received,
        total_sent,
        unconfirmed_balance,
        unconfirmed_n_tx,
        unconfirmed_txrefs,
      } = await this.props.wallet.getAddressData({
        addressId,
      })

      this.setState({
        status: 'idle',
        address,
        balance,
        unconfirmedBalance: unconfirmed_balance,
        finalBalance: final_balance,
        numberOfTx: n_tx,
        unconfirmedNumberOfTx: unconfirmed_n_tx || {},
        txRefs: txrefs || [],
        unconfirmedTxRefs: unconfirmed_txrefs || [],
        totalSent: total_sent,
        totalReceived: total_received,
      })
    } catch (error) {
      this.setState({ status: 'error' })
    }
  }

  render() {
    return (
      <main className={this.props.classes.content}>
        <div className={this.props.classes.toolbar} />
        <Paper className={this.props.classes.paper} elevation={4}>
          {this.state.status === 'loading' && <Loader />}
          {this.state.status === 'idle' && (
            <div>
              <TransactionInformation
                address={this.state.address}
                availableBalance={this.state.balance}
                totalPending={this.state.unconfirmedBalance}
                finalBalance={this.state.finalBalance}
                numberOfTransactions={this.state.numberOfTx}
              />
              <NewTransaction
                wallet={this.props.wallet}
                availableBalance={this.state.balance}
                handleRefresh={this.handleRefresh}
              />
              <TransactionListing
                title="Transactions"
                transactions={[
                  ...this.state.unconfirmedTxRefs,
                  ...this.state.txRefs,
                ]}
              />
            </div>
          )}
        </Paper>
      </main>
    )
  }
}

export default withStyles(styles)(Dashboard)
