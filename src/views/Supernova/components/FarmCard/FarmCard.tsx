import React, { useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton } from '@pancakeswap-libs/uikit'
import { communityFarms } from 'config/constants'
import { SFarm } from 'state/types'
import { provider } from 'web3-core'
import useI18n from 'hooks/useI18n'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { QuoteToken } from 'config/constants/types'
import { useSFarmUser } from 'state/hooks'
import { getBalanceNumber, getPercentNumber } from 'utils/formatBalance'
import moment from 'moment';
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import ApyButton from './ApyButton'

export interface SFarmWithStakedValue extends SFarm {
  apy?: BigNumber
}

const RainbowLight = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 16px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const FCard = styled.div`
  align-self: baseline;
  background: ${(props) => props.theme.card.background};
  border-radius: 20px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: center;
`
const FCardBorder = styled.div`
  align-self: baseline;
  background: ${(props) => props.theme.card.background};

  border: 3px solid;
  border-image: conic-gradient(red, yellow, lime, aqua, blue, magenta, red) 1;
  border-radius: 15px;

  box-sizing: border-box;
  margin: 1rem auto 2rem;
  padding: 1rem;
  // background: linear-gradient(${(props) => props.theme.card.background}, ${(props) => props.theme.card.background}),
  //   linear-gradient(90deg, #99a3ff 0%, #1fc7d4 27.08%, #fec803 64.06%, #ff4eb8 100%);
  // border: 5px solid transparent;
  // background-repeat: no-repeat;
  // background-origin: padding-box, border-box;

  // border-radius: 1rem;
  // border-width: 4px;
  position: relative;

  // box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: center;
`

const Divider = styled.div`
  background-color: #181334;
  height: 1px;
  margin: 20px auto;
  width: 100%;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`

interface FarmCardProps {
  sFarm: SFarmWithStakedValue
  removed: boolean
  cakePrice?: BigNumber
  bnbPrice?: BigNumber
  ethereum?: provider
  account?: string
}

const FarmCard: React.FC<FarmCardProps> = ({ sFarm, removed, cakePrice, bnbPrice, ethereum, account }) => {
  const TranslateString = useI18n()


  const { totalReward, timeExpiry, polarBonusMultiplier, earningMultiplier, totalStakedAmount, unlockFundsInSec, maxBonusMultiplier, currentBonusMultiplier } = useSFarmUser(sFarm.pid)

  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const [farmAPY, setFarmAPY] = useState("...")
  const [totalStakedPrice, setTotalStakedPrice] = useState("0")

  const [timeExpiryState, setTimeExpiryState] = useState("...")
  useEffect(() => {
    const secondsInYear = new BigNumber(31536000)
    if (sFarm && totalStakedAmount.isGreaterThan(0)) {
      let rTokenPrice = sFarm.isRewardSingleToken ? new BigNumber(sFarm.rTokenPriceVsQuote) : new BigNumber(sFarm.rLpTokenPriceVsQuote);
      if (sFarm.rQuoteTokenSymbol === 'BNB')
        rTokenPrice = rTokenPrice.times(bnbPrice)

      let sTokenPrice = sFarm.isStakeSingleToken ? new BigNumber(sFarm.sTokenPriceVsQuote) : new BigNumber(sFarm.sLpTokenPriceVsQuote);
      if (sFarm.sQuoteTokenSymbol === 'BNB')
        sTokenPrice = sTokenPrice.times(bnbPrice)

      // console.log(unlockFundsInSec.toFormat(18))
      // console.log(rTokenPrice.toFormat(18))
      // console.log(new BigNumber(totalStakedAmount).toFormat(18))
      // console.log(sTokenPrice.toFormat(18))
      // console.log(secondsInYear.times(unlockFundsInSec).div(10 ** 6).times(rTokenPrice).div(totalStakedAmount).div(sTokenPrice).times(100).toFormat(2))

      setTotalStakedPrice(totalStakedAmount.times(sTokenPrice).div(10 ** 18).toFormat(2))
      setFarmAPY(secondsInYear.times(unlockFundsInSec).div(10 ** 6).times(rTokenPrice).div(totalStakedAmount).div(sTokenPrice).times(100).toFormat(2))
    }

    if (timeExpiry > 0) {
      const timeDifference = new BigNumber(timeExpiry).minus(new BigNumber(Date.now()).div(1000))
      if (timeDifference.isGreaterThan(0)) {
        const days = timeDifference.div(60 * 60 * 24)
        setTimeExpiryState(`${days.toFormat(1)} Days`);
      } else {
        setTimeExpiryState("Expired");
      }
    }
  }, [sFarm, totalReward, timeExpiry, polarBonusMultiplier, earningMultiplier, totalStakedAmount, unlockFundsInSec, bnbPrice])
  // const isCommunityFarm = communityFarms.includes(sFarm.tokenSymbol)
  // We assume the token name is coin pair + lp e.g. CAKE-BNB LP, LINK-BNB LP,
  // NAR-CAKE LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  // const farmImage = sFarm.lpSymbol.split(' ')[0].toLocaleLo\werCase()
  const totalValue: BigNumber = new BigNumber(100)

  const stakeLabel = sFarm.isStakeSingleToken ? sFarm.sTokenSymbol : sFarm.sLpSymbol
  const rewardLabel = sFarm.isRewardSingleToken ? sFarm.rTokenSymbol : sFarm.rLpSymbol

  // sFarm.apy &&
  // sFarm.apy.times(new BigNumber(100)).toNumber().toLocaleString(undefined, {
  //   minimumFractionDigits: 2,
  //   maximumFractionDigits: 2,
  // })

  return (
    <FCardBorder>
      <CardHeading
        stakeLabel={stakeLabel}
        // multiplier={sFarm.multiplier}
        // depositFee={sFarm.depositFeeBP}
        multiplier={`${maxBonusMultiplier.toFormat(1)}x`}
        depositFee={0}
        tokenSymbol={sFarm.sTokenSymbol}
      />
      {!removed && (
        <Flex justifyContent="space-between" alignItems="center">
          <Text color="#ABABAB">{TranslateString(352, 'APR')}:</Text>
          <Text bold style={{ display: 'flex', alignItems: 'center', fontSize: '16px' }}>
            {sFarm.apy ? (
              <>
                {/* <ApyButton
                  lpLabel={sFarm.sLpSymbol}
                  quoteTokenAdresses={sFarm.sQuoteTokenAdresses}
                  quoteTokenSymbol={sFarm.sQuoteTokenSymbol}
                  tokenAddresses={sFarm.sTokenAddresses}
                  cakePrice={cakePrice}
                  apy={sFarm.apy}
                /> */}
                {farmAPY}%
              </>
            ) : (
                <Skeleton height={24} width={80} />
              )}
          </Text>
        </Flex>
      )}
      <Flex justifyContent="space-between">
        <Text color="#ABABAB">{TranslateString(318, 'Earn')}:</Text>
        <Text bold style={{ fontSize: '16px' }}>
          {rewardLabel}
        </Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text color="#ABABAB">{TranslateString(20001, 'Total Rewards')}:</Text>
        <Text bold style={{ fontSize: '16px' }}>
          {`${totalReward.div(10 ** 18).toFormat(2)} ${sFarm.rTokenSymbol}`}
        </Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text color="#ABABAB">{TranslateString(20001, 'Time Left')}:</Text>
        <Text bold style={{ fontSize: '16px' }}>
          {`${timeExpiryState}`}
        </Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text color="#ABABAB">{TranslateString(20001, 'Your Time Bonus')}:</Text>
        <Text bold style={{ fontSize: '16px' }}>
          {currentBonusMultiplier.toFormat(2)}x
        </Text>
      </Flex>
      <CardActionsContainer sFarm={sFarm} ethereum={ethereum} account={account} />
      <Divider />
      <ExpandableSectionButton
        onClick={() => setShowExpandableSection(!showExpandableSection)}
        expanded={showExpandableSection}
      />
      <ExpandingWrapper expanded={showExpandableSection}>
        <DetailsSection
          removed={removed}
          isTokenOnly={sFarm.isStakeSingleToken}
          bscScanAddress={
            sFarm.isStakeSingleToken
              ? `https://bscscan.com/token/${sFarm.sTokenSymbol[process.env.REACT_APP_CHAIN_ID]}`
              : `https://bscscan.com/token/${sFarm.sLpSymbol[process.env.REACT_APP_CHAIN_ID]}`
          }
          totalValueFormated={totalStakedPrice}
          lpLabel={sFarm.isStakeSingleToken ? sFarm.sTokenSymbol : sFarm.sLpSymbol}
          quoteTokenAdresses={sFarm.sQuoteTokenAdresses}
          quoteTokenSymbol={sFarm.sQuoteTokenSymbol}
          tokenAddresses={sFarm.sTokenAddresses}
        />
      </ExpandingWrapper>
    </FCardBorder>
  )
}

export default FarmCard
