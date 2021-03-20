import React from 'react'
import { Card, CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js/bignumber'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import useI18n from 'hooks/useI18n'
import { getCakeAddress } from 'utils/addressHelpers'
import CardValue from './CardValue'
import { useFarms, usePriceCakeBusd } from '../../../state/hooks'
import TotalValueLockedCard from './TotalValueLockedCard'

const StyledCakeStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
`
const StyledText = styled(Text)`
  color: rgba(255, 255, 255, 0.5);
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const CakeStats = () => {
  const TranslateString = useI18n()
  const totalSupply = useTotalSupply()
  const burnedBalance = useBurnedBalance(getCakeAddress())
  const farms = useFarms()
  const eggPrice = usePriceCakeBusd()
  const circSupply = totalSupply ? totalSupply.minus(burnedBalance) : new BigNumber(0)
  const cakeSupply = getBalanceNumber(circSupply)
  const marketCap = eggPrice.times(circSupply)

  let polarPerBlock = 0
  if (farms && farms[0] && farms[0].polarPerBlock) {
    polarPerBlock = new BigNumber(farms[0].polarPerBlock).div(new BigNumber(10).pow(18)).toNumber()
  }

  return (
    <div>
      <StyledCakeStats>
        <CardBody>
          <Heading size="lg" mb="24px">
            {/* {TranslateString(50, 'POLAR Stats')} */}
            POLAR STATS
          </Heading>
          <Row>
            <StyledText fontSize="18px">{TranslateString(50, 'TOTAL POLAR SUPPLY')}</StyledText>
            {cakeSupply && <CardValue fontSize="18px" value={cakeSupply} decimals={0} />}
          </Row>
          <Row>
            <StyledText fontSize="18px">{TranslateString(999, 'MARKET CAP')}</StyledText>
            <CardValue fontSize="18px" value={getBalanceNumber(marketCap)} decimals={0} prefix="$" />
          </Row>
          <Row>
            <StyledText fontSize="18px">{TranslateString(50, 'TOTAL POLAR BURNED')}</StyledText>
            <CardValue fontSize="18px" value={getBalanceNumber(burnedBalance)} decimals={0} />
          </Row>
          <Row>
            <StyledText fontSize="18px">{TranslateString(50, 'NEW POLAR/BLOCK')}</StyledText>
            <Text fontSize="18px" color="#7D65FF">
              {polarPerBlock}
            </Text>
          </Row>
        </CardBody>
      </StyledCakeStats>
      <TotalValueLockedCard />
    </div>
  )
}

export default CakeStats
