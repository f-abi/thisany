'use client'

import { IconLink, IconLock, IconReport, IconUser } from '@tabler/icons-react'
import { VideoPanList } from 'gying'
import Link from 'next/link'

import {
  FileItem,
  Files,
  FolderContent,
  FolderItem,
  FolderTrigger,
  SubFiles
} from '@/components/animate-ui/components/radix/files'

function PanList({ panList }: { panList: Array<VideoPanList> }) {
  return (
    <div className="mx-2 mb-2 2xl:mx-0">
      <Files className="card md:p-4">
        {panList.map((pan, panIdx) => (
          <FolderItem key={panIdx} value={pan.name}>
            <FolderTrigger>{pan.name}</FolderTrigger>
            <FolderContent>
              <SubFiles>
                {pan.data.map((d, dIdx) => (
                  <FolderItem key={dIdx} value={d.name}>
                    <FolderTrigger>{d.name}</FolderTrigger>
                    <FolderContent>
                      <SubFiles>
                        <FileItem icon={IconLink}>
                          <Link href={d.url} target="_blank">
                            {d.url}
                          </Link>
                        </FileItem>
                        {d.password && <FileItem icon={IconLock}>提取码：{d.password}</FileItem>}
                        <FileItem icon={IconUser}>{d.user}</FileItem>
                        <FileItem icon={IconReport}>{d.time}</FileItem>
                      </SubFiles>
                    </FolderContent>
                  </FolderItem>
                ))}
              </SubFiles>
            </FolderContent>
          </FolderItem>
        ))}
      </Files>
    </div>
  )
}

export { PanList }
