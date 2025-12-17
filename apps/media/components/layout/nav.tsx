import Link from 'next/link'

import { NavLinkBox } from '@/components/common/nav-link-box'
import { APP_NAV_CONFIG } from '@/constants'

export function Nav() {
  return (
    <nav className="ml-8 hidden flex-row items-center gap-8 md:flex">
      {APP_NAV_CONFIG.map(({ type, name }) => (
        <Link key={type} href={`/collection/${type}`}>
          <NavLinkBox type={type} name={name} />
        </Link>
      ))}
    </nav>
  )
}
