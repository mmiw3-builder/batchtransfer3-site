
import React, {  useState } from 'react'
import AddressAmountList from './AddressAmountList'
import { useChainId, useWriteContract } from 'wagmi'
import BatchTransferContract from './contract/BatchTransferContract'
import { Button } from '@nextui-org/react'

export default function TransferEther() {
  const chainId = useChainId()
  const {writeContract, ...result} = useWriteContract()

  const [recipients, setRecipients] = useState<string[]>([])
  const [amounts, setAmounts] = useState<bigint[]>([])
  const [sameAmount, setSameAmount] = useState<bigint>(0n)

  const contract: BatchTransferContract = new BatchTransferContract(chainId, writeContract) 

  function donate(){
    contract.donate(1n)
  }

  function onAdressChange(address:string[], amounts: bigint[], sameAmount: bigint){
    console.log(`TransferEther, address:`, address, '\namounts:', amounts, '\nsameAmount:', sameAmount)
    setRecipients(address)
    setAmounts(amounts)
    setSameAmount(sameAmount)
  }

  function batchTransferEther(){
    if(recipients.length <= 0){
      return
    }
    if(sameAmount > 0n){
      contract.batchTransferEtherWithSameAmount(recipients, sameAmount)
    }else{
      contract.batchTransferEther(recipients, amounts)
    }
  }

  return (
    <>
      <div>TransferEther</div>
      <AddressAmountList onAdressChange={onAdressChange} />
      <Button 
        color="primary"
        onClick={batchTransferEther} 
        isDisabled={recipients.length === 0} 
        isLoading={result.isPending}>批量转账</Button>
    </>
  )
}
