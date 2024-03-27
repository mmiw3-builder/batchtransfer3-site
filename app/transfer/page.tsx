'use client'
import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Tabs, Tab, Card, CardBody} from "@nextui-org/react";
import TransferEther from '../components/TransferEther';
import BatchTransferContract from '../components/BatchTransferContract';
import TransferERC20 from '../components/TransferERC20';
import { useAccount, useBalance, useChains } from 'wagmi';


export default function Page() {

  const account = useAccount()
  const balance = useBalance({address: account.address})

  let tabs = [
    {
      id: "transferEth",
      label:`批量转账${balance.data?.symbol ? balance.data?.symbol:  "" }`,
      content: (<div>
        <TransferEther/>
      </div>)
    },
    {
      id: "transferERC20",
      label:"批量转账ERC20",
      content: (<div>
         <TransferERC20/>
      </div>)
    }
  ];

  return (
    <div style={{height: '100vh'}}>
      <Navbar>
        <NavbarBrand>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="#">
              transfer
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <ConnectButton 
              showBalance={{
                smallScreen: true,
                largeScreen: false,
              }}
            />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="flex w-full flex-col" >
        <Tabs aria-label="Dynamic tabs" items={tabs}  defaultSelectedKey="transferERC20" style={{paddingLeft: '40%', textAlign: 'center', marginTop: '15px'}}>
          {(item) => (
            <Tab key={item.id} title={item.label}>
              <Card>
                <CardBody>
                  {item.content}
                </CardBody>
              </Card>  
            </Tab>
          )}
        </Tabs>
      </div>  
    </div>
  )
}
