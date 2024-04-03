
import React, {  useEffect, useState } from 'react'
import AddressAmountList from './AddressAmountList'
import { BaseError, BaseErrorType, useAccount, useBalance, useChainId, useReadContract, useReadContracts, useWriteContract } from 'wagmi'
import BatchTransferContract from './contract/BatchTransferContract'
import { Button } from '@nextui-org/react'
import { Flex, Input, message } from 'antd'
import style from './TransferERC20.module.css'
import { ethers } from 'ethers'
import ERC20Contract from './contract/ERC20Contract'


export default function TransferErc20() {
  const chainId = useChainId()
  const {writeContract, ...result} = useWriteContract()

  const {writeContract: writeErcContract, ...writeErc20Result} = useWriteContract()

  const account = useAccount()
  const balance = useBalance({address: account.address})

  const [recipients, setRecipients] = useState<string[]>([])
  const [amount, setAmount] = useState<bigint[]| bigint>([])
  const [totalAmount, setTotalAmount] = useState<bigint>(0n)
  const [erc20ContractAddress, setErc20ContractAddress] = useState<string>("")
  const [erc20Contract, setErc20Contract] = useState<ERC20Contract>()
  const [currentApproval, setCurrentApproval] = useState("")
  const [erc20Balance, setErc20Balance] = useState("0.0")

  const readErc20BalanceResult = useReadContract(erc20Contract?.balanceOf(account.address))
  const readErc20AllowanceResult = useReadContract(erc20Contract?.allowance(account.address))

  useEffect( () =>{
    if(result.isError){
      message.error((result.error?.cause as BaseError).shortMessage)
    }
  }, [result.isError])

  const contract: BatchTransferContract = new BatchTransferContract(chainId, writeContract);
  
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };


  function onAddressChange(address:string[], amount: bigint[] | bigint, totalAmount: bigint){
    console.log(`TransferEther, address:`, address, '\namount:', amount,)
    setRecipients(address)
    setAmount(amount)
    setTotalAmount(totalAmount)
  }

  function batchTransferErc20(){
    if(recipients.length <= 0){
      return
    }

    console.log(`balance.data?.value as bigint < totalAmount: `, balance.data?.value)
    if(balance.data?.value as bigint < totalAmount ){
      message.error("余额不足")
      return
    }

    if(typeof amount === 'bigint'){      
      contract.batchTransferTokenWithSameAmount(erc20Contract?.address as any, recipients, amount)
    }else{
      contract.batchTransferToken(erc20Contract?.address as any, recipients, amount)
    }
  }

  function approveErc20(){
    erc20Contract?.approve(totalAmount)
  }
 
  function onContractChange(event : any){
    const address = event?.target?.value
    if(!ethers.utils.isAddress(address)){
      return   
    }
    setErc20ContractAddress(address)
    const erc20Contract = new ERC20Contract(address, chainId, writeErcContract);
    setErc20Contract(erc20Contract)
  }

  return (
    <>
      <Flex className={style.transferPage} vertical={true} align='center'>
        <div style={{width: '85%'}}>
          <div className={style.erc20} >
            <span style={{left:0}}>ERC20合约地址:</span>
            <Input className={style.contract} onChange={onContractChange} />
            <span>余额:
            {readErc20BalanceResult?.data ? ethers.utils.formatEther(readErc20BalanceResult?.data?.toString()) : "0.0" }</span>
            <span>已授权额度:
            {readErc20AllowanceResult?.data ? ethers.utils.formatEther(readErc20AllowanceResult?.data?.toString()) : "0.0" }</span>
            
            {/* <Button
              color='secondary'
            >授权额度</Button> */}
          </div>
          <div >
            <AddressAmountList onAddressChange={onAddressChange} />
          </div>
        </div>
        <div style={{width: '100%', overflow: 'wrap'}}>
          {/* {JSON.stringify(readErc20BalanceResult)} */}
        </div>
        
        <div>
          <Button 
            style={{width: '100px', visibility: readErc20AllowanceResult.data as bigint >= totalAmount ? 'hidden' : 'visible'}}
            color="primary"
            onClick={approveErc20} 
            isDisabled={recipients.length === 0} 
            isLoading={result.isPending}>授权额度</Button>
          <Button 
            style={{width: '100px', visibility: readErc20AllowanceResult.data as bigint >= totalAmount ? 'visible' : 'hidden'}}
            color="primary"
            onClick={batchTransferErc20} 
            isDisabled={recipients.length === 0 || readErc20BalanceResult.data as bigint < totalAmount || !account.isConnected} 
            isLoading={result.isPending}>{readErc20BalanceResult.data as bigint < totalAmount ? '余额不足': '批量转账'}</Button>
          </div>
      </Flex>
    </>
  )
}
