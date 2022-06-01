import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface LeaseInitArgs {
  params: types.LeaseInitParamsFields
}

export interface LeaseInitAccounts {
  lease: PublicKey
  queue: PublicKey
  aggregator: PublicKey
  funder: PublicKey
  payer: PublicKey
  systemProgram: PublicKey
  tokenProgram: PublicKey
  owner: PublicKey
  escrow: PublicKey
  programState: PublicKey
}

export const layout = borsh.struct([types.LeaseInitParams.layout("params")])

export function leaseInit(args: LeaseInitArgs, accounts: LeaseInitAccounts) {
  const keys = [
    { pubkey: accounts.lease, isSigner: false, isWritable: true },
    { pubkey: accounts.queue, isSigner: false, isWritable: true },
    { pubkey: accounts.aggregator, isSigner: false, isWritable: false },
    { pubkey: accounts.funder, isSigner: false, isWritable: true },
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.escrow, isSigner: false, isWritable: true },
    { pubkey: accounts.programState, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([168, 190, 157, 252, 159, 226, 241, 89])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.LeaseInitParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
