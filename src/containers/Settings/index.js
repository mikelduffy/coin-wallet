import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Checkbox from 'material-ui/Checkbox'
import Divider from 'material-ui-next/Divider'

class Settings extends Component {
  static propTypes = {
    wallet: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired,
  }

  initialState = {
    oldPasswordValue: '',
    newPasswordValue: '',
    confirmNewPasswordValue: '',
    backupPasswordValue: '',
    oldPasswordError: '',
    newPasswordError: '',
    confirmNewPasswordError: '',
    backupPasswordError: '',
    confirmReset: false,
  }

  state = this.initialState

  handleClose = () => {
    this.setState(this.initialState)
    this.props.handleClose()
  }

  handleInputChange = event => {
    this.setState({
      [`${event.target.id}Value`]: event.target.value,
    })
  }

  addErrorText = (fieldID, message) => {
    this.setState({
      [`${fieldID}Error`]: message,
    })
  }

  handlePasswordChange = () => {
    try {
      this.props.wallet.changePassword({
        oldPassword: this.state.oldPasswordValue,
        newPassword: this.state.newPasswordValue,
      })
      this.props.wallet.setWallet()
      this.setState({
        oldPasswordValue: '',
        newPasswordValue: '',
        confirmNewPasswordValue: '',
      })
    } catch (error) {
      this.addErrorText('oldPassword', error.message)
    }
  }

  handleDownloadBackup = () => {
    try {
      this.props.wallet.downloadWallet({
        password: this.state.backupPasswordValue,
      })
      this.setState({ backupPasswordValue: '' })
    } catch (error) {
      this.addErrorText('backupPassword', error.message)
    }
  }

  render() {
    return (
      <Dialog
        title="Settings"
        modal={false}
        open={this.props.open}
        onRequestClose={this.handleClose}
        autoScrollBodyContent={true}
      >
        <Divider
          style={{
            margin: '0px -24px 0px -24px',
          }}
        />
        <h4>Change Password</h4>
        <TextField
          id="oldPassword"
          floatingLabelText="Old Password"
          type="password"
          fullWidth
          value={this.state.oldPasswordValue}
          errorText={this.state.oldPasswordError}
          onChange={this.handleInputChange}
          style={{
            marginTop: -15,
          }}
        />
        <TextField
          id="newPassword"
          floatingLabelText="New Password"
          type="password"
          fullWidth
          value={this.state.newPasswordValue}
          errorText={this.state.newPasswordError}
          onChange={this.handleInputChange}
          style={{
            marginTop: -15,
          }}
        />
        <TextField
          id="confirmNewPassword"
          floatingLabelText="Confirm New Password"
          type="password"
          fullWidth
          value={this.state.confirmNewPasswordValue}
          errorText={this.state.confirmNewPasswordError}
          onChange={this.handleInputChange}
          style={{
            marginTop: -15,
          }}
        />
        <RaisedButton
          label="Submit"
          primary
          disabled={
            !this.state.oldPasswordValue ||
            !this.state.newPasswordValue ||
            !this.state.confirmNewPasswordValue ||
            this.state.newPasswordValue !== this.state.confirmNewPasswordValue
          }
          onClick={this.handlePasswordChange}
        />
        <Divider
          style={{
            margin: '20px -24px 0px -24px',
          }}
        />
        <h4>Backup Wallet</h4>
        <TextField
          id="backupPassword"
          floatingLabelText="Password"
          type="password"
          fullWidth
          value={this.state.backupPasswordValue}
          errorText={this.state.backupPasswordError}
          onChange={this.handleInputChange}
          style={{
            marginTop: -15,
          }}
        />
        <RaisedButton
          label="Download"
          primary
          disabled={!this.state.backupPasswordValue}
          onClick={this.handleDownloadBackup}
        />
        <Divider
          style={{
            margin: '20px -24px 0px -24px',
          }}
        />
        <h4>Complete Reset</h4>
        <Checkbox
          label="I understand that this will delete my wallet, and that there are no recovery options if I have not already downloaded a backup."
          checked={this.state.confirmReset}
          onCheck={() => {
            this.setState({ confirmReset: !this.state.confirmReset })
          }}
          style={{
            marginBottom: '16px',
          }}
        />
        <RaisedButton
          label="Reset"
          secondary
          disabled={!this.state.confirmReset}
          onClick={() => {
            this.props.handleReset()
            this.handleClose()
          }}
        />
      </Dialog>
    )
  }
}

export default Settings
