import { validateWalletOptions, isRequired } from './validation'

it('can validate wallet options', () => {
  expect(validateWalletOptions({ coin: 'bcy', network: 'test' })).toBe(true)
  expect(validateWalletOptions({ coin: 'btc', network: 'test3' })).toBe(true)
  expect(validateWalletOptions({ coin: 'btc', network: 'main' })).toBe(true)
  expect(validateWalletOptions({ coin: 'ltc', network: 'main' })).toBe(true)
  expect(validateWalletOptions({ coin: 'doge', network: 'main' })).toBe(true)
  expect(() => {
    validateWalletOptions({})
  }).toThrow()
  expect(() => {
    validateWalletOptions()
  }).toThrow()
  expect(() => {
    validateWalletOptions('123')
  }).toThrow()
  expect(() => {
    validateWalletOptions({ coin: '123' })
  }).toThrow()
  expect(() => {
    validateWalletOptions({ coin: '123', network: '123' })
  }).toThrow('Not a valid coin.')
  expect(() => {
    validateWalletOptions({ coin: 'BTC', network: '123' })
  }).toThrow('Not a valid coin.')
  expect(() => {
    validateWalletOptions({ coin: 'btc', network: '123' })
  }).toThrow('Not a valid network.')
})

it('can check for required parameters', () => {
  expect(() => {
    isRequired('test')
  }).toThrow('Required parameter, "test" is missing.')
})
