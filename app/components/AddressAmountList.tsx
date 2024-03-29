import {  Textarea } from '@nextui-org/react'
import { Alert, Flex, InputNumber, Switch } from 'antd'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import style from './AddressAmountList.module.css'

enum AddressRowInvalidReason{
  InvalidAddress,
  InvalidAmount
}

class AddressAmountRow{
  address: `0x${string}`
  amount: bigint
  constructor(address: `0x${string}`, amount: bigint){
    this.address = address
    this.amount = amount
  }

  isAddressValid(){
    return ethers.utils.isAddress(this.address)
  }

  isAmountValid(){
    return this.amount > 0n
  }

  isValid(){
    return this.isAddressValid() && this.isAmountValid()
  }

  invalidReason(){
    if(!ethers.utils.isAddress(this.address)){
      return AddressRowInvalidReason.InvalidAddress
    }
    if(this.amount <= 0n){
      return AddressRowInvalidReason.InvalidAmount
    }
  }

  static isAddressValid(address: string){
    return ethers.utils.isAddress(address)
  }
  static isAmountValid(amount: bigint){
    return amount > 0n
  }
}


export default function AddressAmountList(
    {onAddressChange: onAddressChange} : 
    {onAddressChange: (addressList: string[], amount: bigint[] | bigint, totalAmount: bigint) => void}
    ) {

  const [addressBlock, setAddressBlock] = useState("")
  const [addressRows, setAddressRows] = useState<AddressAmountRow[]>([])
  const [sameAmount, setSameAmount] = useState<bigint>(0n)
  const [sameAmountSwitch, setSameAmountSwitch] = useState<boolean>()
  const [totalAmount, setTotalAmount] = useState<bigint>(0n)

  useEffect(() => {
    const rows = addressBlock.replaceAll(/(\t|\x20)*/g, '')
                             .split('\n')
                             .filter(e => e.trim() !== '')
                             .map(e => {
                              const address =  e.split(',')[0] as `0x${string}`
                              let amount =  e.split(',')[1] || "0"
                              let amountInBigint = 0n
                              try{
                                amountInBigint = ethers.utils.parseEther(amount).toBigInt()
                              }catch{}
                              return new AddressAmountRow(address, amountInBigint)
                             })
    setAddressRows(rows)
    // console.log(`setAddressRows:`, rows)
    const _addressList = rows.map(e => e.address);
    const _amountList = rows.map(e => e.amount);

    setTotalAmount(0n)

    if(!getHasInvalidRows(rows)){
      if(!sameAmountSwitch){
        const totalAmount = _amountList.reduce((a,b) => a+b,0n)
        setTotalAmount(totalAmount)
        onAddressChange(_addressList, _amountList, totalAmount)
        return
      }
      if(sameAmountSwitch && sameAmount > 0n){
        const totalAmount = sameAmount * BigInt(_addressList.length)
        setTotalAmount(totalAmount)
        onAddressChange(_addressList, sameAmount, totalAmount)
        return
      }
      onAddressChange([], 0n, 0n)
    }
    onAddressChange([], 0n, 0n)

  }, [addressBlock, sameAmount, sameAmountSwitch])


  function onAddressListChange(value: string){
    setAddressBlock(value)
    // console.log(`formatAddressList:`, value)
  }

  /**
   * 获取错误的地址行
   * @param rows 
   * @returns 
   */
  function getHasInvalidRows(rows: AddressAmountRow[]){
    // console.log(`getHasInvalidRows:`, rows)
    const invalidAddressCount = rows.filter(e => !e.isAddressValid()).length
    const invalidAmountCount = rows.filter(e => !e.isAmountValid()).length
    // console.log("getHasInvalidRows:", invalidAddressCount, ",",invalidAmountCount )
    if(invalidAddressCount > 0){
      return true
    }
    if(!sameAmountSwitch){
      return invalidAmountCount > 0
    }
    return sameAmount <= 0
  }

  function onSameAmountSwitchChange(value: boolean){
    setSameAmountSwitch(value)
  }

  function onSameAmountValueChange(value: number | string | null){
    if(!value){
      setSameAmount(0n)
      return
    }
    try{
      const _value = ethers.utils.parseEther(value.toString()).toBigInt()
      setSameAmount(_value)
    }catch{
      setSameAmount(0n)
    }
  }

  return (
      <div className={style.addressPage}>
        <Flex vertical={false} className={style.listFlex}>
          <div style={{width: '45%'}}>
            <span>批量转账地址列表:</span>
            <Textarea minRows={18} 
                      maxRows={18} 
                      onValueChange={onAddressListChange}
            ></Textarea>
          </div>
          <div style={{width: '45%'}}>
            <span>批量转账预览[合计 {`=> ${ ethers.utils.formatEther(totalAmount)}`} ]:</span>
            <div style={{whiteSpace: "pre-line", maxHeight: '380px', overflowY: 'scroll', scrollbarWidth: 'none' }}>
            {
              addressRows.map((e,i) => {
                const address = e.address
                const amount = sameAmountSwitch ? sameAmount : e.amount
                let rowColor = 'green'
                if(!AddressAmountRow.isAddressValid(address)){
                  rowColor = 'red'
                }else if(!AddressAmountRow.isAmountValid(amount)){
                  rowColor = 'purple'
                }
                return (<span 
                  style={{
                    color: rowColor
                  }}
                  key={i}>
                    {`${e.address} => ${ethers.utils.formatEther(amount)}\n`}
                  </span>)
              })
            }
            </div>
          </div>
        </Flex>
        
        <div className={style.sameAmountItem}>
          <Switch onChange={onSameAmountSwitchChange}/>
          <label>统一转账金额: </label> 
          <InputNumber 
              disabled={!sameAmountSwitch}
              value={ethers.utils.formatEther(sameAmount)}
              // defaultValue={0}
              onChange={onSameAmountValueChange} 
              min={0}
              controls={false}/>
        </div>
      </div>
  )
}




