'use client' // Error boundaries must be Client Components

import { IconServerBolt } from '@tabler/icons-react'
import Link from 'next/link'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="card">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant={'icon'}>
              <IconServerBolt />
            </EmptyMedia>
            <EmptyTitle>服务器发生错误</EmptyTitle>
            <EmptyDescription>
              [{error?.digest}]: {error.message}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button variant={'outline'} asChild size={'sm'}>
                <Link href={'/'}>返回首页</Link>
              </Button>
              <Button onClick={reset} size={'sm'}>
                重试
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  )
}
