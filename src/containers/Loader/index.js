import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui-next/styles'
import { CircularProgress } from 'material-ui-next/Progress'

const styles = theme => ({
  progress: {
    display: 'flex',
    height: '-webkit-fill-available',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const Loader = ({ classes }) => (
  <div className={classes.progress}>
    <CircularProgress />
  </div>
)

Loader.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Loader)
