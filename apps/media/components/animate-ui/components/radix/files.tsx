import * as React from 'react'
import { IconFolder, IconFolderOpen, IconFile } from '@tabler/icons-react'

import {
  Files as FilesPrimitive,
  FilesHighlight as FilesHighlightPrimitive,
  FolderItem as FolderItemPrimitive,
  FolderHeader as FolderHeaderPrimitive,
  FolderTrigger as FolderTriggerPrimitive,
  FolderHighlight as FolderHighlightPrimitive,
  Folder as FolderPrimitive,
  FolderIcon as FolderIconPrimitive,
  FileLabel as FileLabelPrimitive,
  FolderContent as FolderContentPrimitive,
  FileHighlight as FileHighlightPrimitive,
  File as FilePrimitive,
  FileIcon as FileIconPrimitive,
  type FilesProps as FilesPrimitiveProps,
  type FolderItemProps as FolderItemPrimitiveProps,
  type FolderContentProps as FolderContentPrimitiveProps,
  type FileProps as FilePrimitiveProps,
  type FileLabelProps as FileLabelPrimitiveProps
} from '@/components/animate-ui/primitives/radix/files'
import { cn } from '@/lib/utils'

type GitStatus = 'untracked' | 'modified' | 'deleted'

type FilesProps = FilesPrimitiveProps

function Files({ className, children, ...props }: FilesProps) {
  return (
    <FilesPrimitive className={cn('w-full p-2', className)} {...props}>
      <FilesHighlightPrimitive className="bg-accent pointer-events-none rounded-lg">
        {children}
      </FilesHighlightPrimitive>
    </FilesPrimitive>
  )
}

type SubFilesProps = FilesProps

function SubFiles(props: SubFilesProps) {
  return <FilesPrimitive {...props} />
}

type FolderItemProps = FolderItemPrimitiveProps

function FolderItem(props: FolderItemProps) {
  return <FolderItemPrimitive {...props} />
}

type FolderTriggerProps = FileLabelPrimitiveProps & {
  gitStatus?: GitStatus
}

function FolderTrigger({ children, className, gitStatus, ...props }: FolderTriggerProps) {
  return (
    <FolderHeaderPrimitive>
      <FolderTriggerPrimitive className="w-full text-start">
        <FolderHighlightPrimitive>
          <FolderPrimitive className="pointer-events-none flex items-center justify-between gap-2 p-2">
            <div
              className={cn(
                'flex items-center gap-2',
                gitStatus === 'untracked' && 'text-green-400',
                gitStatus === 'modified' && 'text-amber-400',
                gitStatus === 'deleted' && 'text-red-400'
              )}
            >
              <FolderIconPrimitive
                closeIcon={<IconFolder className="size-4.5" />}
                openIcon={<IconFolderOpen className="size-4.5" />}
              />
              <FileLabelPrimitive className={cn('text-sm', className)} {...props}>
                {children}
              </FileLabelPrimitive>
            </div>

            {gitStatus && (
              <span
                className={cn(
                  'size-2 rounded-full',
                  gitStatus === 'untracked' && 'bg-green-400',
                  gitStatus === 'modified' && 'bg-amber-400',
                  gitStatus === 'deleted' && 'bg-red-400'
                )}
              />
            )}
          </FolderPrimitive>
        </FolderHighlightPrimitive>
      </FolderTriggerPrimitive>
    </FolderHeaderPrimitive>
  )
}

type FolderContentProps = FolderContentPrimitiveProps

function FolderContent(props: FolderContentProps) {
  return (
    <div className="before:bg-border relative ml-6 before:absolute before:inset-y-0 before:-left-2 before:h-full before:w-px">
      <FolderContentPrimitive {...props} />
    </div>
  )
}

type FileItemProps = FilePrimitiveProps & {
  icon?: React.ElementType
  gitStatus?: GitStatus
}

function FileItem({
  icon: Icon = IconFile,
  className,
  children,
  gitStatus,
  ...props
}: FileItemProps) {
  return (
    <FileHighlightPrimitive>
      <FilePrimitive
        className={cn(
          'flex items-center justify-between gap-2 p-2',
          gitStatus === 'untracked' && 'text-green-400',
          gitStatus === 'modified' && 'text-amber-400',
          gitStatus === 'deleted' && 'text-red-400'
        )}
      >
        <div className="flex items-center gap-2">
          <FileIconPrimitive>
            <Icon className="size-4.5" />
          </FileIconPrimitive>
          <FileLabelPrimitive className={cn('text-sm', className)} {...props}>
            {children}
          </FileLabelPrimitive>
        </div>

        {gitStatus && (
          <span className="text-sm font-medium">
            {gitStatus === 'untracked' && 'U'}
            {gitStatus === 'modified' && 'M'}
            {gitStatus === 'deleted' && 'D'}
          </span>
        )}
      </FilePrimitive>
    </FileHighlightPrimitive>
  )
}

export {
  Files,
  FolderItem,
  FolderTrigger,
  FolderContent,
  FileItem,
  SubFiles,
  type FilesProps,
  type FolderItemProps,
  type FolderTriggerProps,
  type FolderContentProps,
  type FileItemProps,
  type SubFilesProps
}
