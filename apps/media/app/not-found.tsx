import { IconError404 } from '@tabler/icons-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="card">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant={'icon'}>
              <IconError404 />
            </EmptyMedia>
            <EmptyTitle>页面不存在</EmptyTitle>
            <EmptyDescription>404 - Page Not Found</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant={'link'} asChild>
              <Link href={'/'}>返回首页</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  )
}
