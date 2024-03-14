import { Contract } from 'ethers'
import React from 'react'
import BatchTransferContract from './contract/BatchTransferContract'
import { useChainId, useWriteContract } from 'wagmi'
import { Button } from '@nextui-org/react'
import AddressAmountList from './AddressAmountList'

export default function TransferERC20() {
  
  const chainId = useChainId()
  const {writeContract, ...result} = useWriteContract()

  const contract: BatchTransferContract = new BatchTransferContract(chainId, writeContract) 

  function donate(){
    contract.donate(1n)
  }

  return (
    <>
      <div>TransferERC20</div>
      {/* <AddressAmountList /> */}
      <Button onClick={donate} isLoading={result.isPending}>donate</Button>
    </>
  )
}
