import contracts from './contracts'
import { SFarmConfig, QuoteToken } from './types'

const sfarms: SFarmConfig[] = [
  {
    pid: 0,
    sLpSymbol: 'POLAR-BNB LP',
    sLpAddresses: {
      97: '',
      56: '0x6aab392d709e7e9a43009ff06fa2e5c33372b07d',
    },
    sTokenSymbol: 'POLAR',
    sTokenAddresses: {
      97: '',
      56: '0x1C545E9943CFd1b41E60a7917465911fa00Fc28C',
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
    poolAddress: '0x9056fdf2546391a09B6967371c37f163DC204F80',
    rQuoteTokenSymbol: QuoteToken.BUSD,
    rQuoteTokenAdresses: contracts.busd,
    isStakeSingleToken: false,
    isRewardSingleToken: true
  }
]

export default sfarms
