import React, { useMemo, useState, useCallback, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { provider } from 'web3-core'
import { getContract } from 'utils/erc20'
import { Button, Flex, Text } from '@pancakeswap-libs/uikit'
import { SFarm } from 'state/types'
import { useSFarmFromPid, useSFarmUser } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import {  useNovaApprove } from 'hooks/useApprove'
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
  const { pid, sTokenAddresses, sLpAddresses: lpAddresses, depositFeeBP } = useSFarmFromPid(sFarm.pid)
  const { allowance, tokenBalance, stakedBalance, earnings, totalReward } = useSFarmUser(pid)
  const lpAddress = sFarm.isStakeSingleToken ? sTokenAddresses[process.env.REACT_APP_CHAIN_ID] : lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const lpName = sFarm.isStakeSingleToken ? sFarm.sTokenSymbol.toUpperCase() : sFarm.sLpSymbol.toUpperCase()
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const rewardLabel = sFarm.isRewardSingleToken ? sFarm.rTokenSymbol : sFarm.rLpSymbol

  const lpContract = useMemo(() => {
    // if (isTokenOnly) {
    //   return getContract(ethereum as provider, tokenAddress)
    // }
    return getContract(ethereum as provider, lpAddress)
  }, [ethereum, lpAddress])



  const { onApprove } = useNovaApprove(lpContract, sFarm.poolAddress)

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
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        tokenName={lpName}
        pid={pid}
        depositFeeBP={depositFeeBP}
        ethereum={ethereum}
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
        <Text bold color="white" fontSize="14px" pr="3px">
          {/* TODO: Is there a way to get a dynamic value here from useFarmFromSymbol? */}
          {rewardLabel}&nbsp;
        </Text>
        <Text bold textTransform="uppercase" color="white" fontSize="14px">
          {TranslateString(999, 'Earned (Estimated)')}
        </Text>
      </Flex>
      <HarvestAction account={account} stakedBalance={stakedBalance} earnings={earnings} pid={pid}  ethereum={ethereum}/>
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
