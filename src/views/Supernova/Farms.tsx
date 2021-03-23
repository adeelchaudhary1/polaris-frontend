import React, { useEffect, useCallback, useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import { Image, Heading } from '@pancakeswap-libs/uikit'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID } from 'config'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useSFarms, usePriceBnbBusd, usePriceCakeBusd } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import { QuoteToken } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import FarmCard, { SFarmWithStakedValue } from './components/FarmCard/FarmCard'
import FarmTabButtons from './components/FarmTabButtons'
import Divider from './components/Divider'

const SFarms: React.FC = () => {
  const { path } = useRouteMatch()
  const TranslateString = useI18n()
  const sFarmsLP = useSFarms()
  const cakePrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const [stakedOnly, setStakedOnly] = useState(false)

  const activeFarms = sFarmsLP.filter((sFarm) => sFarm.multiplier !== '0X')
  const inactiveFarms = sFarmsLP.filter((sFarm) => sFarm.multiplier === '0X')

  const stakedOnlyFarms = activeFarms.filter(
    (sFarm) => sFarm.userData && new BigNumber(sFarm.userData.stakedBalance).isGreaterThan(0),
  )

  // /!\ This function will be removed soon
  // This function compute the APY for each sFarm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD
  const farmsList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      // const cakePriceVsBNB = new BigNumber(sFarmsLP.find((sFarm) => sFarm.pid === CAKE_POOL_PID)?.tokenPriceVsQuote || 0)
      const farmsToDisplayWithAPY: SFarmWithStakedValue[] = farmsToDisplay.map((sFarm) => {
        // if (!sFarm.tokenAmount || !sFarm.lpTotalInQuoteToken || !sFarm.lpTotalInQuoteToken) {
        //   return sFarm
        // }
        const cakeRewardPerBlock = new BigNumber(sFarm.polarPerBlock || 1)
          .times(new BigNumber(sFarm.poolWeight))
          .div(new BigNumber(10).pow(18))
        const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)

        let apy = cakePrice.times(cakeRewardPerYear)

        let totalValue = new BigNumber(sFarm.lpTotalInQuoteToken || 0)

        if (sFarm.quoteTokenSymbol === QuoteToken.BNB) {
          totalValue = totalValue.times(bnbPrice)
        }

        if (totalValue.comparedTo(0) > 0) {
          apy = apy.div(totalValue)
        }

        return { ...sFarm, apy }
      })
      return farmsToDisplayWithAPY.map((sFarm) => (
        <FarmCard
          key={sFarm.pid}
          sFarm={sFarm}
          removed={removed}
          bnbPrice={bnbPrice}
          cakePrice={cakePrice}
          ethereum={ethereum}
          account={account}
        />
      ))
    },
    [bnbPrice, account, cakePrice, ethereum],
  )

  return (
    <Page>
      <Heading as="h1" size="lg" color="primary" mb="20px" style={{ textAlign: 'center' }}>
        {TranslateString(50, 'Supernovas Geysers')}
      </Heading>
      <Heading
        as="h2"
        color="rgba(153, 163, 255, 0.57)"
        mb="30px"
        style={{ textAlign: 'center', fontWeight: 'normal' }}
      >
        {TranslateString(50, 'Deposit fee will be distributed to supernova Geysers')}
      </Heading>
      <FarmTabButtons stakedOnly={stakedOnly} setStakedOnly={setStakedOnly} />
      <div>
        <Divider />
        <FlexLayout>
          <Route exact path={`${path}`}>
            {stakedOnly ? farmsList(stakedOnlyFarms, false) : farmsList(activeFarms, false)}
          </Route>
          <Route exact path={`${path}/history`}>
            {farmsList(inactiveFarms, true)}
          </Route>
        </FlexLayout>
      </div>
      {/* <Image src="/images/egg/8.png" alt="illustration" width={1352} height={587} responsive /> */}
    </Page>
  )
}

export default SFarms
