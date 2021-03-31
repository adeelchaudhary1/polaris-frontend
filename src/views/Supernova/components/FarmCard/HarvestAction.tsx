import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { provider } from 'web3-core'
import { Button, Flex, Heading, useModal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { getBalanceNumber } from 'utils/formatBalance'
import styled from 'styled-components'
import { fetchPolarBalance } from 'state/sFarms/fetchSFarms'
import sfarms from 'config/constants/sfarms'
import { useSuperNovaUnstake } from 'hooks/useUnstake'
import HarvestModal from '../HarvestModal'

interface FarmCardActionsProps {
  earnings?: BigNumber
  pid: number
  stakedBalance: BigNumber,
  account: string,
  ethereum?: provider
}

const BalanceAndCompound = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
`

const HarvestAction: React.FC<FarmCardActionsProps> = ({ account, stakedBalance, earnings, pid, ethereum }) => {
  const sFarm = sfarms.find(sFarmObj => sFarmObj.pid === pid)
  const TranslateString = useI18n()
  const [pendingTx, setPendingTx] = useState(false)
  const [polarMaxBalance, setPolarMaxBalance] = useState(new BigNumber(0))

  const { onUnstake } = useSuperNovaUnstake(sFarm.poolAddress)

  const rawEarningsBalance = getBalanceNumber(earnings)
  const displayBalance = rawEarningsBalance.toLocaleString()


  useEffect(() => {
    async function fetchBalance () {
      const tempPolarMaxBalance = await fetchPolarBalance(account)
      setPolarMaxBalance(new BigNumber(tempPolarMaxBalance))
    }
    if(account) {
      fetchBalance()
    }
  }, [account])
  
  const [onPresentHarvest] = useModal(<HarvestModal sFarm={sFarm} max={stakedBalance} maxPolar={polarMaxBalance} onConfirm={onUnstake} tokenName={sFarm.sLpSymbol} ethereum={ethereum}/>)

  return (
    <Flex mb="8px" justifyContent="space-between" alignItems="center">
      <Heading color={rawEarningsBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
      <BalanceAndCompound>
        <Button
          disabled={rawEarningsBalance === 0 || pendingTx}
          onClick={onPresentHarvest}
        >
          {TranslateString(999, 'Unstake')}
        </Button>
      </BalanceAndCompound>
    </Flex>
  )
}

export default HarvestAction
