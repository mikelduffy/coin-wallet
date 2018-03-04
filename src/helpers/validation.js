export const validateWalletOptions = ({
  coin = isRequired('coin'),
  network = isRequired('network'),
}) => {
  const options = {
    bcy: ['test'],
    btc: ['main', 'test3'],
    ltc: ['main'],
    doge: ['main'],
  }
  if (!options[coin]) throw new Error('Not a valid coin.')
  if (options[coin].indexOf(network) < 0)
    throw new Error('Not a valid network.')
  return true
}

export const isRequired = requiredParam => {
  const requiredParamError = new Error(
    `Required parameter, "${requiredParam}" is missing.`
  )
  // preserve original stack trace
  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(requiredParamError, requiredParam)
  }
  throw requiredParamError
}
