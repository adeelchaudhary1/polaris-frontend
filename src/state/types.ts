import BigNumber from 'bignumber.js'
import { FarmConfig, PoolConfig, SFarmConfig } from 'config/constants/types'

export interface Farm extends FarmConfig {
  tokenAmount?: BigNumber
  // quoteTokenAmount?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  tokenPriceVsQuote?: BigNumber
  poolWeight?: number
  depositFeeBP?: number
  polarPerBlock?: number
    userData?: {
    allowance: BigNumber
    tokenBalance: BigNumber
    stakedBalance: BigNumber
    earnings: BigNumber
  }
}

export interface Pool extends PoolConfig {
  totalStaked?: BigNumber
  startBlock?: number
  endBlock?: number
  userData?: {
    allowance: BigNumber
    stakingTokenBalance: BigNumber
    stakedBalance: BigNumber
    pendingReward: BigNumber
  }
}

export interface SFarm extends SFarmConfig {
  sTokenPriceVsQuote?: BigNumber
  sLpTokenPriceVsQuote?: BigNumber
  rTokenPriceVsQuote?: BigNumber
  rLpTokenPriceVsQuote?: BigNumber
  depositFeeBP?: number
    userData?: {
    allowance: BigNumber
    polarAllowance: BigNumber
    tokenBalance: BigNumber
    stakedBalance: BigNumber
    totalStakedAmount: BigNumber
    earnings: BigNumber
    totalReward: BigNumber
    timeExpiry : number
    polarBonusMultiplier: BigNumber
    earningMultiplier: BigNumber
    totalLocked: BigNumber
    unlockFundsInSec: BigNumber
    maxBonusMultiplier: BigNumber
    currentBonusMultiplier: BigNumber
  }
}

// Slices states

export interface FarmsState {
  data: Farm[]
}

export interface PoolsState {
  data: Pool[]
}

export interface SFarmsState {
  data: SFarm[]
}

// Global state

export interface State {
  farms: FarmsState
  pools: PoolsState
  sFarms: SFarmsState
}
