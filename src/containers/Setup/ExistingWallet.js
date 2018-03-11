import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui-next/Button'
import TextField from 'material-ui-next/TextField'

class ExistingWallet extends Component {
  static propTypes = {
    wallet: PropTypes.object.isRequired,
    handleCompleteSetup: PropTypes.func.isRequired,
  }

  initialState = {
    status: 'init', // init, error
    password: '',
    encryptedWallet: '',
  }

  state = this.initialState

  handleInputChange = ({ target: { id, value } }) => {
    this.setState({ [id]: value })
  }

  handleReset = () => {
    this.setState(this.initialState)
  }

  handleSubmit = async () => {
    try {
      this.props.wallet.restoreWallet({
        encryptedWallet: this.state.encryptedWallet,
        password: this.state.password,
      })
      this.props.wallet.changePassword({
        oldPassword: 'temp',
        newPassword: this.state.password,
      })
      await this.props.wallet.generateNewAddress({
        password: this.state.password,
      })
      this.handleReset()
      this.props.handleCompleteSetup()
    } catch (error) {
      console.log(error)
      this.setState({ status: 'error' })
    }
  }

  render() {
    return (
      <div>
        <Button
          variant="raised"
          color="primary"
          component="label"
          style={{
            margin: '10px 10px 0px 0px',
          }}
        >
          {'Select Wallet Backup'}
          <input
            id="selectBackup"
            onChange={({ target: { files } }) => {
              const reader = new FileReader()
              reader.onload = ({ target: { result } }) => {
                this.setState({ encryptedWallet: result })
              }
              reader.readAsText(files[0])
            }}
            style={{ display: 'none' }}
            type="file"
          />
        </Button>
        <TextField
          id="password"
          label="Enter Password"
          type="password"
          margin="dense"
          fullWidth
          value={this.state.password}
          onChange={this.handleInputChange}
        />
        <Button
          variant="raised"
          onClick={this.handleReset}
          style={{
            margin: '10px 10px 0px 0px',
          }}
        >
          Reset
        </Button>
        <Button
          variant="raised"
          color="secondary"
          disabled={!this.state.password || !this.state.encryptedWallet}
          onClick={this.handleSubmit}
          style={{
            margin: '10px 10px 0px 0px',
          }}
        >
          Submit
        </Button>
      </div>
    )
  }
}

export default ExistingWallet
