#!/usr/bin/env node
import { encodeAddress, decodeAddress, blake2AsHex } from '@polkadot/util-crypto'
import { Command } from 'commander'

const DEFAULT_PREFIX = 0

const program = new Command()

function convertToSs58Address(evmAddress: string, prefix: number) {
  const addressBytes = Buffer.from(evmAddress.slice(2), 'hex')
  const prefixBytes = Buffer.from('evm:')
  const convertBytes = Uint8Array.from(Buffer.concat([prefixBytes, addressBytes]))
  const finalAddressHex = blake2AsHex(convertBytes, 256)
  return encodeAddress(finalAddressHex, prefix)
}

function convertToEvmAddress(substrateAddress: string) {
  const addressBytes = decodeAddress(substrateAddress)
  return '0x' + Buffer.from(addressBytes.subarray(0, 20)).toString('hex')
}

function convertSs58AddressPrefix(ss58Address: string, prefix: number) {

  const addressBytes = decodeAddress(ss58Address)
  return encodeAddress(addressBytes, prefix)
}

program
  .command('to0x <address>')
  .description('show 0x address of native address')
  .action((address) => {
    console.log(convertToEvmAddress(address))
  })

program
  .command('from0x <address>')
  .option('-p, --prefix <prefix>', 'optional prefix for address', String(DEFAULT_PREFIX))
  .description('address prefix conversion')
  .action((address, options) => {
    const prefix = parseInt(options.prefix)
    console.log(convertToSs58Address(address, prefix))
  })

program
  .command('convert <address> <prefix>')
  .description('address prefix conversion')
  .action((address, _prefix) => {
    const prefix = parseInt(_prefix || DEFAULT_PREFIX)
    console.log(convertSs58AddressPrefix(address, prefix))
  })

program.parse()
