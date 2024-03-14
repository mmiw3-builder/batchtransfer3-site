import {  Textarea } from '@nextui-org/react'
import { Alert, InputNumber, Switch } from 'antd'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import style from './AddressAmountList.module.css'

export default function AddressAmountList(
    {onAdressChange} : 
    {onAdressChange: (addressList: string[], amountList: bigint[], sameAmount: bigint) => void}
    ) {
  const [addressBlock, setAddressBlock] = useState("")
  const [addressList, setAddressList] = useState<string[]>([])
  const [amountList, setAmountList] = useState<bigint[]>([])
  const [invalidAddressRows, setInvalidAddressRows] = useState<string[]>([])
  const [sameAmount, setSameAmount] = useState<bigint>(0n)
  const [sameAmountSwitch, setSameAmountSwitch] = useState<boolean>()

  useEffect(() => {
    const rows = addressBlock.split('\n').filter(e => e.trim() !== '')
    const _addressList = rows.map(e => e.split(',')[0]);
    const _amountList = rows.map(e => {
      const amount = e.split(',')[1] || "0"
      try{
        return ethers.utils.parseEther(amount).toBigInt()
      }catch{
        return 0n
      }
    });

    const invalidAddressRows = rows.filter(e => {
      const address = e.split(',')[0]
      let amount = 0n
      try {
        amount = ethers.utils.parseEther(e.split(',')[1]).toBigInt()
      } catch {
      }
      return !ethers.utils.isAddress(address) || amount  <= 0
    })
    
    setInvalidAddressRows(invalidAddressRows)
    setAddressList(_addressList)
    setAmountList(_amountList)
    if(invalidAddressRows.length === 0){
      onAdressChange(_addressList, _amountList, sameAmountSwitch ? sameAmount : 0n)
    }else{
      onAdressChange([], [], 0n)
    }

  }, [addressBlock, sameAmount, sameAmountSwitch])


  function onAddressListChange(value: string){
    setAddressBlock(value)
    console.log(`formatAddressList:`, value)
    
  }

  function onSameAmountSwitchChange(value: boolean){
      setSameAmountSwitch(value)
  }

  function onSameAmountValueChange(value: number | string | null){
    console.log(`onSameAmountValueChange, value:`, value )
    if(!value){
      setSameAmount(0n)
      return
    }
    try{
      const _value = ethers.utils.parseEther(value.toString()).toBigInt()
      console.log(`onSameAmountValueChange, _value:`, _value )
      setSameAmount(_value)
    }catch{
      setSameAmount(0n)
    }
  }

  return (
      <div className={style.addressPage}>
        <Textarea minRows={10} maxRows={10} onValueChange={onAddressListChange}></Textarea>
        <div className={style.sameAmountItem}>
          <Switch onChange={onSameAmountSwitchChange}/>
          <label>统一转账金额: </label> 
          <InputNumber onChange={onSameAmountValueChange} min={0} controls={false}/>
        </div>
        <Alert
          style={{whiteSpace: "pre-line", height: '200px', overflowY: 'scroll', scrollbarWidth: 'none',
          visibility: invalidAddressRows?.length === 0 ? 'hidden' : 'visible',
        }}
          message="请检查地址或者转账金额"
          description={invalidAddressRows?.join("\n")}
          type="error"
        />
      </div>
  )
}




