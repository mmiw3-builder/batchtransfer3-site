
import React, {  useEffect, useState } from 'react'
import AddressAmountList from './AddressAmountList'
import { BaseError, useAccount, useBalance, useChainId, useChains, useConfig, useTransactionReceipt,  useWriteContract } from 'wagmi'
import BatchTransferContract from './contract/BatchTransferContract'
import { Button } from '@nextui-org/react'
import { Flex, message, notification } from 'antd'


export default function TransferEther() {
  const chainId = useChainId()
  const {writeContract, ...result} = useWriteContract()
  
  const account = useAccount()
  const balance = useBalance({address: account.address})

  const [recipients, setRecipients] = useState<string[]>([])
  const [amount, setAmount] = useState<bigint[]| bigint>([])
  const [txHash, setTxHash] = useState<`0x${string}`>();

  const txResult = useTransactionReceipt({hash: txHash})

  const { chain } = useAccount()
  const contract: BatchTransferContract = new BatchTransferContract(chainId, writeContract) 

  useEffect(() =>{
    if(result.isError){
      message.error((result.error?.cause as BaseError).shortMessage)
    }
  }, [result.isError])


  useEffect(() =>{
    if(result.data){
      setTxHash(result.data)
    }
  }, [result.data])

  useEffect(() =>{
      if(txResult.isPending && txHash){
        notification.info({
          message: '交易正在执行...',
          description: <div>交易Hash: <a target="_blank" href={chain?.blockExplorers?.default.url + '/evm/tx/' + txHash}>{txHash}</a></div> ,
        })
        return
      }
      if(txResult.isSuccess){
        notification.success({
          message: '交易已确认',
          description: <div>交易Hash: <a target="_blank" href={chain?.blockExplorers?.default.url + '/evm/tx/' + txHash}>{txHash}</a></div> ,
        })
        return
      }
  }, [txResult.isPending, txResult.isSuccess, txHash])

  

  function onAddressChange(address:string[], amount: bigint[] | bigint, totalAmount: bigint){
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

  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  return (
    <>
      <Flex vertical={true} align='center'>
        <div style={{width: '85%'}}>
          <AddressAmountList onAddressChange={onAddressChange} />
        </div>
        <div style={{width: '100%', overflow: 'wrap'}}>
          {/* {JSON.stringify(txResult)} */}
          
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

