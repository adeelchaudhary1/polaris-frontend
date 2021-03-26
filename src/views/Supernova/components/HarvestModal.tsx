import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Modal } from '@pancakeswap-libs/uikit'
import ModalActions from 'components/ModalActions'
import TokenInput from 'components/TokenInput'
import useI18n from 'hooks/useI18n'
import { getFullDisplayBalance, getPercentNumber } from 'utils/formatBalance'
import { useSFarmUser } from 'state/hooks'
import { SFarm } from 'state/types'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { fetchSFarmUserHarvestEarning } from 'state/sFarms/fetchSFarmUser'

interface HarvestModalProps {
  max: BigNumber
  maxPolar: BigNumber
  onConfirm: (amount: string, polar: string) => void
  onDismiss?: () => void
  tokenName?: string,
  sFarm: SFarm
}

const HarvestModal: React.FC<HarvestModalProps> = ({ sFarm, onConfirm, onDismiss, max, maxPolar, tokenName = '' }) => {
  
  const { earningMultiplier } = useSFarmUser(sFarm.pid)
  const { account } = useWallet()
  const [val, setVal] = useState('')
  const [valPolar, setValPolar] = useState('0')
  const [estimatedHarvestAmount, setEstimatedHarvestAmount] = useState('')
  const [bonusMultiplier, setBonusMultiplier] = useState(1)
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()

  
  const calculateEstimatedHarvest = useCallback(async (unStakingAmount: number, polarAmount= 0) => {
    try {
      const unStakingAmountInBigNumber = Math.floor(unStakingAmount * 10**18).toString()
      const polarAmountInBigNumber = Math.floor(polarAmount * 10**18).toString()

      const harvestResult = await fetchSFarmUserHarvestEarning(account, unStakingAmountInBigNumber, polarAmountInBigNumber,  sFarm.poolAddress)
      
      const maxHarvestCalculated = (Number(harvestResult[0].earning) / 10**18)

      setEstimatedHarvestAmount(maxHarvestCalculated.toFixed(4)) 

    } catch (Error) {
      // eslint-disable-next-line no-console
      console.log(Error)
      setEstimatedHarvestAmount(unStakingAmount.toFixed(4))
    }
  },[account, sFarm.poolAddress])


  useEffect(() => {
    const tempBonusMultiplier = getPercentNumber(earningMultiplier)
    setBonusMultiplier(Number(tempBonusMultiplier))
  }, [earningMultiplier])

  
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const fullPolarBalance = useMemo(() => {
    return getFullDisplayBalance(maxPolar)
  }, [maxPolar])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
      calculateEstimatedHarvest(Number(e.currentTarget.value), Number(valPolar))
      // setEstimatedHarvestAmount(maxHarvest.times(bonusMultiplier).times(new BigNumber(Number(e.currentTarget.value)).div(max)).toFormat(2)) 
    },
    [calculateEstimatedHarvest, valPolar],
  )

  const handlePolarChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setValPolar(e.currentTarget.value)
      setBonusMultiplier(1 + Number(e.currentTarget.value) / 100)
      calculateEstimatedHarvest(Number(val), Number(e.currentTarget.value))

      // setEstimatedHarvestAmount(maxHarvest.times(1 + Number(e.currentTarget.value) / 100).times(new BigNumber(Number(val)).div(max)).toFormat(2)) 
    },
    [calculateEstimatedHarvest, val],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
    calculateEstimatedHarvest(Number(fullBalance), Number(valPolar))
    // setEstimatedHarvestAmount(maxHarvest.times(bonusMultiplier).div(10**18).toFormat(2)) 
  }, [fullBalance, calculateEstimatedHarvest, valPolar])

  const handleSelectPolarMax = useCallback(() => {
    setValPolar(fullPolarBalance)
    setBonusMultiplier(1 + Number(fullPolarBalance) / 100)
    calculateEstimatedHarvest(Number(val), Number(fullPolarBalance))

    // setEstimatedHarvestAmount(maxHarvest.times(1 + Number(fullPolarBalance) / 100).div(10**18).toFormat(2)) 
  }, [fullPolarBalance, calculateEstimatedHarvest, val])

  return (
    <Modal title="Harvest With POLAR To Multiply Your Rewards" onDismiss={onDismiss}>
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
      />

      <TokenInput
        onSelectMax={handleSelectPolarMax}
        onChange={handlePolarChange}
        value={valPolar}
        max={fullPolarBalance}
        symbol="POLAR"
      />

      <div style={{color: 'white', margin: 'auto', paddingTop: '10px'}}>Bonus POLAR Multiplier: {bonusMultiplier}X</div>
      <div style={{color: 'white', margin: 'auto', paddingTop: '10px'}}>Estimated Harvest: {estimatedHarvestAmount} WBNB</div>      

      <ModalActions>
        <Button variant="secondary" onClick={onDismiss}>
          {TranslateString(462, 'Cancel')}
        </Button>
        <Button
          disabled={pendingTx}
          onClick={async () => {
            setPendingTx(true)
            await onConfirm(val, valPolar)
            setPendingTx(false)
            onDismiss()
          }}
        >
          {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Confirm')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default HarvestModal
