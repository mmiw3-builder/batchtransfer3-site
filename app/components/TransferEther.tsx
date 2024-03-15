
import React, {  useEffect, useState } from 'react'
import AddressAmountList from './AddressAmountList'
import { useAccount, useBalance, useChainId, useWriteContract } from 'wagmi'
import BatchTransferContract from './contract/BatchTransferContract'
import { Button } from '@nextui-org/react'
import { Flex, message } from 'antd'

export default function TransferEther() {
  const chainId = useChainId()
  const {writeContract, ...result} = useWriteContract()
  
  const account = useAccount()
  const balance = useBalance({address: account.address})

  const [recipients, setRecipients] = useState<string[]>([])
  const [amount, setAmount] = useState<bigint[]| bigint>([])

  useEffect( () =>{
    if(result.isError){
      message.error(result.error?.cause?.shortMessage)
    }
  }, [result.isError])

  const contract: BatchTransferContract = new BatchTransferContract(chainId, writeContract) 

  function donate(){
    contract.donate(1n)
  }

  function onAddressChange(address:string[], amount: bigint[] | bigint){
    console.log(`TransferEther, address:`, address, '\namount:', amount,)
    setRecipients(address)
    setAmount(amount)
  }

  function batchTransferEther(){
    if(recipients.length <= 0){
      return
    }

    const totalAmount = typeof amount === 'bigint' ? BigInt(recipients.length) * amount : amount.reduce((a,b) => a+b)
    console.log(`balance.data?.value as bigint < totalAmount: `, balance.data?.value)
    if(balance.data?.value as bigint < totalAmount ){
      message.error("余额不足")
      return
    }

    if(typeof amount === 'bigint'){      
      contract.batchTransferEtherWithSameAmount(recipients, amount)
    }else{
      contract.batchTransferEther(recipients, amount)
    }
  }

  return (
    <>
      <Flex vertical={true} align='center'>
        <div style={{width: '85%'}}>
          <AddressAmountList onAddressChange={onAddressChange} />
        </div>
        <Button 
          style={{width: '100px'}}
          color="primary"
          onClick={batchTransferEther} 
          isDisabled={recipients.length === 0} 
          isLoading={result.isPending}>批量转账</Button>
      </Flex>
    </>
  )
}
