import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { SFarm } from 'state/types'
import { Button, Modal } from '@pancakeswap-libs/uikit'
import ModalActions from 'components/ModalActions'
import TokenInput from 'components/TokenInput'
import useI18n from 'hooks/useI18n'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useSFarmUser, useSFarmFromPid, usePriceBnbBusd, usePriceCakeBusd } from 'state/hooks'

interface DepositModalProps {
  pid: number,
  max: BigNumber
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  depositFeeBP?: number
}

const DepositModal: React.FC<DepositModalProps> = ({ pid, max, onConfirm, onDismiss, tokenName = '', depositFeeBP = 0 }) => {
  const sFarm = useSFarmFromPid(pid)
  const { totalStakedAmount, unlockFundsInSec } = useSFarmUser(pid)
  
  const [estimatedDailyRewards, setEstimatedDailyRewards] = useState("...")
  const polarPrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()


  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  useEffect(() => {
    const secondsInDay = new BigNumber(86400)
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
      // console.log(secondsInDay.times(unlockFundsInSec).div(10 ** 6).times(rTokenPrice).div(totalStakedAmount).div(sTokenPrice).times(100).toFormat(2))

      const stakeValue = val === '' ? 0 : new BigNumber(val)
      let estimatedRewards = secondsInDay.times(unlockFundsInSec).div(10 ** 6).times(rTokenPrice).div(totalStakedAmount).div(sTokenPrice).times(stakeValue)
      estimatedRewards = estimatedRewards.times(sTokenPrice).div(rTokenPrice)
      setEstimatedDailyRewards(estimatedRewards.toFormat(4))
    }
  }, [sFarm, totalStakedAmount, unlockFundsInSec, polarPrice, bnbPrice, val])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  return (
    <Modal title={`${TranslateString(316, 'Deposit')} ${tokenName} Tokens`} onDismiss={onDismiss}>
      <TokenInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
        depositFeeBP={depositFeeBP}
      />
      <div style={{ color: 'white', margin: 'auto', paddingTop: '10px' }}>Estimated Daily Rewards: {estimatedDailyRewards} {sFarm.isRewardSingleToken ? sFarm.rTokenSymbol : sFarm.rLpSymbol}</div>
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss} style={{ width: '180px' }}>
          {TranslateString(462, 'Cancel')}
        </Button>
        <Button
          disabled={pendingTx}
          onClick={async () => {
            setPendingTx(true)
            await onConfirm(val)
            setPendingTx(false)
            onDismiss()
          }}
          style={{ width: '180px' }}
        >
          {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Confirm')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default DepositModal
