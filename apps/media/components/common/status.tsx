function MediaStatus({ html }: { html: string }) {
  return (
    <div className="card bg-background dark:bg-input/30 dark:border-input mx-2 mb-2 border border-transparent p-2 text-sm md:p-4 md:text-base 2xl:mx-0">
      <div
        className="[&_span]:text-destructive [&_span]:pl-2"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

export { MediaStatus }
