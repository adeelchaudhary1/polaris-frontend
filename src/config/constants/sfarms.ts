import contracts from './contracts'
import { SFarmConfig, QuoteToken } from './types'

const sfarms: SFarmConfig[] = [
  {
    pid: 0,
    sLpSymbol: 'POLAR-BNB LP',
    sLpAddresses: {
      97: '',
      56: '0x22ec5e9897a2d6b00fc91936383cc27ac51aba22',
    },
    sTokenSymbol: 'POLAR',
    sTokenAddresses: {
      97: '',
      56: '0x3a5325f0e5ee4da06a285e988f052d4e45aa64b4',
    },
    sQuoteTokenSymbol: QuoteToken.BNB,
    sQuoteTokenAdresses: contracts.wbnb,
    rLpSymbol: 'BNB-BUSD LP',
    rLpAddresses: {
      97: '',
      56: '0x1b96b92314c44b159149f7e0303511fb2fc4774f',
    },
    rTokenSymbol: 'WBNB',
    rTokenAddresses: {
      97: '',
      56: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    },
    poolAddress: '0x0E632770fa8b2E3C00eCEA59b6B654d268c68109',
    rQuoteTokenSymbol: QuoteToken.BUSD,
    rQuoteTokenAdresses: contracts.busd,
    isStakeSingleToken: false,
    isRewardSingleToken: true
  }
]

export default sfarms
