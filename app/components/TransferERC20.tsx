
import React, {  useEffect, useState } from 'react'
import AddressAmountList from './AddressAmountList'
import { useAccount, useBalance, useChainId, useReadContract, useReadContracts, useWriteContract } from 'wagmi'
import BatchTransferContract from './contract/BatchTransferContract'
import { Button } from '@nextui-org/react'
import { Flex, Input, message } from 'antd'
import style from './TransferERC20.module.css'
import { ethers } from 'ethers'


export default function TransferErc20() {
  const chainId = useChainId()
  const {writeContract, ...result} = useWriteContract()

  
  const account = useAccount()
  const balance = useBalance({address: account.address})

  const [recipients, setRecipients] = useState<string[]>([])
  const [amount, setAmount] = useState<bigint[]| bigint>([])
  const [erc20ContractAddress, setErc20ContractAddress] = useState<string>("")
  const [currentApproval, setCurrentApproval] = useState("")

  // 当erc20地址发生变化时
  useEffect(() => {
    async function checkApproval(){
      if(!ethers.utils.isAddress(erc20ContractAddress)){
        return
      }

      // useReadContracts


    }


  }, [erc20ContractAddress])


  useEffect( () =>{
    if(result.isError){
      message.error(result.error?.cause?.shortMessage)
    }
  }, [result.isError])

  const contract: BatchTransferContract = new BatchTransferContract(chainId, writeContract) 


  function onAddressChange(address:string[], amount: bigint[] | bigint){
    console.log(`TransferEther, address:`, address, '\namount:', amount,)
    setRecipients(address)
    setAmount(amount)
  }

  async function checkAllowance(){
    const result = useReadContract({
      abi: ERC20Abi,
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      functionName: 'totalSupply',
    })
  }

  function batchTransferErc20(){
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

 

  function onContractChange(value : any){
    if(!ethers.utils.isAddress(value)){
      
    }
    // setErc20Contract()
  }

  return (
    <>
      <Flex className={style.transferPage} vertical={true} align='center'>
        <div style={{width: '85%'}}>
          <div >
            <AddressAmountList onAddressChange={onAddressChange} />
          </div>
          <div className={style.erc20} >
            <span style={{left:0}}>ERC20合约地址:</span>
            <Input className={style.contract} onChange={onContractChange} />
            <span>余额:0.00</span>
            <Button
              color='secondary'
            >授权额度</Button>
          </div>
        </div>
        <Button 
          style={{width: '100px'}}
          color="primary"
          onClick={batchTransferErc20} 
          isDisabled={recipients.length === 0} 
          isLoading={result.isPending}>批量转账</Button>
      </Flex>
    </>
  )
}
