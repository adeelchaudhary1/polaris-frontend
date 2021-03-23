import React, { useMemo, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { provider } from 'web3-core'
import { getContract } from 'utils/erc20'
import { Button, Flex, Text } from '@pancakeswap-libs/uikit'
import { SFarm } from 'state/types'
import { useFarmFromPid, useFarmFromSymbol, useFarmUser } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import { useApprove } from 'hooks/useApprove'
import StakeAction from './StakeAction'
import HarvestAction from './HarvestAction'

const Action = styled.div`
  padding-top: 16px;
`
export interface SFarmWithStakedValue extends SFarm {
  apy?: BigNumber
}

interface FarmCardActionsProps {
  sFarm: SFarmWithStakedValue
  ethereum?: provider
  account?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ sFarm, ethereum, account }) => {
  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses, tokenAddresses, isTokenOnly, depositFeeBP } = useFarmFromPid(sFarm.pid)
  const { allowance, tokenBalance, stakedBalance, earnings } = useFarmUser(pid)
  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const tokenAddress = tokenAddresses[process.env.REACT_APP_CHAIN_ID]
  const lpName = sFarm.sLpSymbol.toUpperCase()
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const tempStakedBalance = new BigNumber(1355 * 10**18)
  const tempTokenBalance = new BigNumber(2500 * 10**18)
  const temEarnings = new BigNumber(60 * 10**18)

  const rewardLabel = sFarm.isRewardSingleToken ? sFarm.rTokenSymbol : sFarm.rLpSymbol

  const lpContract = useMemo(() => {
    if (isTokenOnly) {
      return getContract(ethereum as provider, tokenAddress)
    }
    return getContract(ethereum as provider, lpAddress)
  }, [ethereum, lpAddress, tokenAddress, isTokenOnly])

  const { onApprove } = useApprove(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <StakeAction
        stakedBalance={tempStakedBalance}
        tokenBalance={tempTokenBalance}
        tokenName={lpName}
        pid={pid}
        depositFeeBP={depositFeeBP}
      />
    ) : (
      <Button mt="8px" fullWidth disabled={requestedApproval} onClick={handleApprove}>
        {TranslateString(999, 'Approve Contract')}
      </Button>
    )
  }

  return (
    <Action>
      <Flex>
        <Text bold textTransform="uppercase" color="white" fontSize="14px" pr="3px">
          {/* TODO: Is there a way to get a dynamic value here from useFarmFromSymbol? */}
          {rewardLabel}&nbsp;
        </Text>
        <Text bold textTransform="uppercase" color="white" fontSize="14px">
          {TranslateString(999, 'Earned')}
        </Text>
      </Flex>
      <HarvestAction earnings={temEarnings} pid={pid} />
      <Flex>
        <Text bold textTransform="uppercase" color="white" fontSize="14px" pr="3px">
          {lpName}
        </Text>
        <Text bold textTransform="uppercase" color="white" fontSize="14px">
          {TranslateString(999, 'Staked')}
        </Text>
      </Flex>
      {!account ? <UnlockButton mt="8px" fullWidth /> : renderApprovalOrStakeButton()}
    </Action>
  )
}

export default CardActions
