import { MenuEntry } from '@pancakeswap-libs/uikit'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    items: [
      {
        label: 'Exchange',
        href: 'https://exchange.polarisdefi.io/',
      },
      {
        label: 'Liquidity',
        href: 'https://exchange.polarisdefi.io/#/add/0xe9e7cea3dedca5984780bafc599bd69add087d56/0x3a5325f0e5ee4da06a285e988f052d4e45aa64b4',
      },
    ],
  },
  {
    label: 'Major Pools',
    icon: 'LaunchIcon',
    href: '/farms',
  },
  {
    label: 'Minor Pools',
    icon: 'LaunchIcon',
    href: '/minor',
  },
  {
    label: 'Supernovas',
    icon: 'GeyserIcon',
    href: '/supernova',
  },
  {
    label: 'Certik Audit',
    icon: 'AuditIcon',
    href: 'https://www.certik.org/projects/polarisdefi',
  },
  // {
  //   label: 'Pools',
  //   icon: 'PoolIcon',
  //   href: '/pools',
  // },
  // {
  //   label: 'Lottery',
  //   icon: 'TicketIcon',
  //   href: '/lottery',
  // },
  // {
  //   label: 'NFT',
  //   icon: 'NftIcon',
  //   href: '/nft',
  // },
  {
    label: 'Info',
    icon: 'InfoIcon',
    items: [
      {
        label: 'Medium',
        href: 'https://medium.com/@polarisdefi',
      },
      {
        label: 'Docs',
        href: 'https://polarisproject.gitbook.io/polaris-defi/',
      },
      {
        label: 'Github',
        href: 'https://github.com/polarisdefi/',
      },
      {
        label: 'BSCScan',
        href: 'https://bscscan.com/token/0x3a5325f0e5ee4da06a285e988f052d4e45aa64b4',
      },
    ],
  },
  // {
  //   label: 'More',
  //   icon: 'MoreIcon',
  //   items: [
  //     {
  //       label: 'Github',
  //       href: 'https://github.com/goosedefi/',
  //     },
  //     {
  //       label: 'Docs',
  //       href: 'https://goosedefi.gitbook.io/goose-finance/',
  //     },
  //     {
  //       label: 'Blog',
  //       href: 'https://goosefinance.medium.com/',
  //     },
  //   ],
  // },
  // {
  //   label: 'Audit by Hacken',
  //   icon: 'AuditIcon',
  //   href: 'https://www.goosedefi.com/files/hackenAudit.pdf',
  // },
  // {
  //   label: 'Audit by CertiK',
  //   icon: 'AuditIcon',
  //   href: 'https://certik.org/projects/goose-finance',
  // },
]

export default config
