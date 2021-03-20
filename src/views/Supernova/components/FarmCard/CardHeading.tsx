import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading, Image } from '@pancakeswap-libs/uikit'
import { CommunityTag, CoreTag, NoFeeTag, RiskTag } from 'components/Tags'
import iconLinks from '../../../../config/constants/iconLinks'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  risk?: number
  depositFee?: number
  farmImage?: string
  tokenSymbol?: string
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 0.25rem;
  }
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
  background: #191439;
  border: 2px solid #191439;
  color: #7d65ff;
`

const AvatarDiv = styled.div`
  position: relative;
  width: 55px;
  height: 55px;
`

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  multiplier,
  risk,
  farmImage,
  tokenSymbol,
  depositFee,
}) => {
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      {/* <Image src={`/images/farms/${farmImage}.png`} alt={tokenSymbol} width={64} height={64} /> */}
      <AvatarDiv>
        <img
          alt=""
          src={iconLinks[lpLabel]}
          style={{ position: 'absolute', width: '30px', height: '30px', left: 0, zIndex: 1 }}
        />
        <div style={{ position: 'absolute', left: '8px', top: '8px', width: '55px' }}>
          <Image src="/images/galaxy/circle.png" alt={tokenSymbol} width={55} height={55} />
        </div>
      </AvatarDiv>
      <Flex flexDirection="column" alignItems="flex-end">
        <Heading mb="4px" color="#7D65FF">
          {lpLabel}
        </Heading>
        <Flex justifyContent="center">
          {depositFee === 0 ? <NoFeeTag /> : null}
          {/* {isCommunityFarm ? <CommunityTag /> : <CoreTag />} */}
          {/* <RiskTag risk={risk} /> */}
          <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
