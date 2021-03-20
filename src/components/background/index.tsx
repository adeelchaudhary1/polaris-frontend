import React from 'react'
import styled from 'styled-components'

import background from './background.png'

const Background: React.FC = (props) => {
  const { children } = props
  return <StyledBackground style={{ backgroundColor: '#0e0b22' }}>{children}</StyledBackground>
}

export default Background

const StyledBackground = styled.div`
  background-image: url(${background});
  background-repeat: no-repeat;
  background-size: contain;
  width: 100%;
`
