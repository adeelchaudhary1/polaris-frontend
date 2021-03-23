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
        href: 'https://exchange.polarisdefi.io/#/add/0xe9e7cea3dedca5984780bafc599bd69add087d56/0x1C545E9943CFd1b41E60a7917465911fa00Fc28C',
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
    href: '/nests',
  },
  {
    label: 'Supernovas (Coming soon)',
    icon: 'GeyserIcon',
    href: '/supernova',
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
        href: 'https://bscscan.com/token/0x1C545E9943CFd1b41E60a7917465911fa00Fc28C',
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
