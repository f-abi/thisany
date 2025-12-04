import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'

interface PaginationBarProps {
  total: number
  current: number
  pathName: string
  searchParams?: { [key: string]: string | string[] | undefined }
}

export function PaginationBar({ total, current, pathName, searchParams }: PaginationBarProps) {
  if (total <= 1) return null

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams()
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (key !== 'page' && value) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v))
          } else {
            params.set(key, value)
          }
        }
      })
    }
    params.set('page', page.toString())
    return `${pathName}?${params.toString()}`
  }

  const renderPageNumbers = () => {
    const items = []

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink href={createPageUrl(i)} isActive={current === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      // Always show first
      items.push(
        <PaginationItem key={1}>
          <PaginationLink href={createPageUrl(1)} isActive={current === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      )

      if (current > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      // Calculate range around current page
      // We want to show current-1, current, current+1 if possible
      // But we need to handle edge cases where current is close to 1 or total
      let start = Math.max(2, current - 1)
      let end = Math.min(total - 1, current + 1)

      // Adjust if we are too close to the beginning
      if (current <= 3) {
        end = Math.min(total - 1, 4) // 1, 2, 3, 4 ...
      }

      // Adjust if we are too close to the end
      if (current >= total - 2) {
        start = Math.max(2, total - 3) // ... 97, 98, 99, 100
      }

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink href={createPageUrl(i)} isActive={current === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }

      if (current < total - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      // Always show last
      items.push(
        <PaginationItem key={total}>
          <PaginationLink href={createPageUrl(total)} isActive={current === total}>
            {total}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={current > 1 ? createPageUrl(current - 1) : '#'}
            aria-disabled={current <= 1}
            className={current <= 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem>
          <PaginationNext
            href={current < total ? createPageUrl(current + 1) : '#'}
            aria-disabled={current >= total}
            className={current >= total ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
