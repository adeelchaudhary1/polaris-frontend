import styled from 'styled-components'
import Container from './Container'

const Page = styled(Container)`
  min-height: calc(100vh - 64px);
  padding-top: 16px;
  padding-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
    padding-bottom: 32px;
  }
`

export default Page

// import React from 'react'
// import styled from 'styled-components'
// import Container from './Container'

// import backgroundMajor from './background-major.png'

// const StyledPage = styled(Container)`
//   min-height: calc(100vh - 64px);
//   padding-top: 16px;
//   padding-bottom: 16px;

//   ${({ theme }) => theme.mediaQueries.sm} {
//     padding-top: 24px;
//     padding-bottom: 24px;
//   }

//   ${({ theme }) => theme.mediaQueries.lg} {
//     padding-top: 32px;
//     padding-bottom: 32px;
//   }
// `

// const StyledPageMajor = styled(Container)`
//   background-image: url(${backgroundMajor});
//   background-repeat: no-repeat;
//   background-size: contain;

//   min-height: calc(100vh - 64px);
//   padding-top: 16px;
//   padding-bottom: 16px;

//   ${({ theme }) => theme.mediaQueries.sm} {
//     padding-top: 24px;
//     padding-bottom: 24px;
//   }

//   ${({ theme }) => theme.mediaQueries.lg} {
//     padding-top: 32px;
//     padding-bottom: 32px;
//   }
// `

// const Page: React.FC = (props) => {
//   const { children } = props
//   return <StyledPage style={{ backgroundColor: '#0e0b22' }}>{children}</StyledPage>
// }

// export default Page
