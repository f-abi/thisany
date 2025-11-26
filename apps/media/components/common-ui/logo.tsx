import Image from 'next/image'
import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/" className="flex cursor-pointer items-center gap-2 py-2">
      <Image className="dark:invert" src={'/logo.svg'} alt="logo" width={32} height={32} />
      <span className="font-sans text-xl font-bold">ThisAny</span>
    </Link>
  )
}
