import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { provider } from 'web3-core'
import { Button, Flex, Heading, IconButton, AddIcon, MinusIcon, useModal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useSuperNovaUnstake } from 'hooks/useUnstake'
import { getBalanceNumber } from 'utils/formatBalance'
import { useSuperNovaStake } from 'hooks/useStake'
import sfarms from 'config/constants/sfarms'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { fetchPolarBalance } from 'state/sFarms/fetchSFarms'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'
import HarvestModal from '../HarvestModal'

interface FarmCardActionsProps {
  stakedBalance?: BigNumber
  tokenBalance?: BigNumber
  tokenName?: string
  pid?: number
  depositFeeBP?: number
  ethereum?: provider
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`

const StakeAction: React.FC<FarmCardActionsProps> = ({ stakedBalance, tokenBalance, tokenName, pid, depositFeeBP, ethereum}) => {
  const sFarm = sfarms.find(sfarm => sfarm.pid === pid)
  const TranslateString = useI18n()
  const { onStake } = useSuperNovaStake(sFarm.poolAddress)
  const { onUnstake } = useSuperNovaUnstake(sFarm.poolAddress)
  const { account } = useWallet()

  const [polarMaxBalance, setPolarMaxBalance] = useState(new BigNumber(0))

  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const displayBalance = rawStakedBalance.toLocaleString()

  useEffect(() => {
    async function fetchBalance () {
      const tempPolarMaxBalance = await fetchPolarBalance(account)
      setPolarMaxBalance(new BigNumber(tempPolarMaxBalance))
    }
    if(account) {
      fetchBalance()
    }
  }, [account])

  const [onPresentDeposit] = useModal(<DepositModal pid={pid} max={tokenBalance} onConfirm={onStake} tokenName={tokenName} depositFeeBP={depositFeeBP} />)
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={tokenName} />,
  )
  const [onPresentHarvest] = useModal(<HarvestModal sFarm={sFarm} max={stakedBalance} maxPolar={polarMaxBalance} onConfirm={onUnstake} tokenName={sFarm.isStakeSingleToken ? sFarm.sTokenSymbol : sFarm.sLpSymbol}  ethereum={ethereum}/>)

  const renderStakingButtons = () => {
    return rawStakedBalance === 0 ? (
      <Button onClick={onPresentDeposit}>{TranslateString(999, 'Stake')}</Button>
    ) : (
      <IconButtonWrapper>
        <IconButton variant="tertiary" onClick={onPresentHarvest} mr="6px">
          <MinusIcon color="primary" />
        </IconButton>
        <IconButton variant="tertiary" onClick={onPresentDeposit}>
          <AddIcon color="primary" />
        </IconButton>
      </IconButtonWrapper>
    )
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Heading color={rawStakedBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
      {renderStakingButtons()}
    </Flex>
  )
}

export default StakeAction
