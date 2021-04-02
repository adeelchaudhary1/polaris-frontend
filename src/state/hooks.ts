import BigNumber from 'bignumber.js'
import { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmsPublicDataAsync, fetchPoolsUserDataAsync } from './actions'
import { State, Farm, Pool, SFarm } from './types'
import { QuoteToken } from '../config/constants/types'
import { fetchSFarmsPublicDataAsync } from './sFarms'

const ZERO = new BigNumber(0)

export const useFetchPublicData = () => {
  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync())
    dispatch(fetchSFarmsPublicDataAsync())

    // dispatch(fetchPoolsPublicDataAsync())
  }, [dispatch, slowRefresh])
}

// Farms

export const useFarms = (): Farm[] => {
  const farms = useSelector((state: State) => state.farms.data)
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)
 
  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : new BigNumber(0),
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : new BigNumber(0),
  }
}


// Pools

export const usePools = (account): Pool[] => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const pools = useSelector((state: State) => state.pools.data)
  return pools
}

export const usePoolFromPid = (sousId): Pool => {
  const pool = useSelector((state: State) => state.pools.data.find((p) => p.sousId === sousId))
  return pool
}

// Prices

export const usePriceBnbBusd = (): BigNumber => {
  const pid = 21 // BUSD-BNB LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceCakeBusd = (): BigNumber => {
  const pid = 1 // CAKE-BNB LP
  const bnbPriceUSD = usePriceBnbBusd()
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? bnbPriceUSD.times(farm.tokenPriceVsQuote) : ZERO

  // const pid = 0; // POLAR-BUSD LP
  // const farm = useFarmFromPid(pid);

  // return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO;
}

export const useTotalValue = (): BigNumber => {
  const farms = useFarms();
  const bnbPrice = usePriceBnbBusd();
  const cakePrice = usePriceCakeBusd();
  let value = new BigNumber(0);
  for (let i = 0; i < farms.length; i++) {
    const farm = farms[i]
    if (farm.lpTotalInQuoteToken) {
      let val;
      if (farm.quoteTokenSymbol === QuoteToken.BNB) {
        val = (bnbPrice.times(farm.lpTotalInQuoteToken));
      }else if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
        val = (cakePrice.times(farm.lpTotalInQuoteToken));
      }else{
        val = (farm.lpTotalInQuoteToken);
      }
      value = value.plus(val);
    }
  }
  return value;
}

// Supernova Farms

export const useSFarms = (): SFarm[] => {
  const sfarms = useSelector((state: State) => state.sFarms.data)
  return sfarms
}


export const useSFarmFromPid = (pid): SFarm => {
  const farm = useSelector((state: State) => state.sFarms.data.find((f) => f.pid === pid))
  return farm
}

export const useSFarmFromSymbol = (lpSymbol: string): SFarm => {
  const farm = useSelector((state: State) => state.sFarms.data.find((f) => f.sLpSymbol === lpSymbol))
  return farm
}

export const useSFarmUser = (pid) => {
  const farm = useSFarmFromPid(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : new BigNumber(0),
    polarAllowance: farm.userData ? new BigNumber(farm.userData.polarAllowance) : new BigNumber(0),
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
    totalStakedAmount: farm.userData ? new BigNumber(farm.userData.totalStakedAmount) : new BigNumber(0),
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : new BigNumber(0),
    totalReward: farm.userData ? new BigNumber(farm.userData.totalReward) : new BigNumber(0),
    timeExpiry: farm.userData ? farm.userData.timeExpiry: 0,
    polarBonusMultiplier: farm.userData ? farm.userData.polarBonusMultiplier: new BigNumber(1),
    earningMultiplier: farm.userData ? farm.userData.earningMultiplier: new BigNumber(1),
    totalLocked: farm.userData ? farm.userData.totalLocked: new BigNumber(1),
    unlockFundsInSec: farm.userData ?  new BigNumber(farm.userData.unlockFundsInSec): new BigNumber(0),
    maxBonusMultiplier: farm.userData ?  new BigNumber(farm.userData.maxBonusMultiplier): new BigNumber(0),
    currentBonusMultiplier: farm.userData ?  new BigNumber(farm.userData.currentBonusMultiplier): new BigNumber(0),    
  }
}

