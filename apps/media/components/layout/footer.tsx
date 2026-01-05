import Link from 'next/link'

import { cn } from '@/lib/utils'

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn('card mx-2 mb-2 flex flex-col p-2 sm:ml-0 xl:p-4', className)}>
      <Link className="text-sm md:text-base" href={'https://beian.miit.gov.cn/'}>
        闽ICP备2023007468号-1
      </Link>
      <span className="text-muted-foreground text-xs md:text-sm">
        本站所有内容均来自互联网分享站点所提供的公开引用资源，未提供资源上传、存储服务
      </span>
    </footer>
  )
}
