import Link from 'next/link'

export function Footer() {
  return (
    <footer className="glass mb-2 flex flex-col p-4">
      <Link href={'https://beian.miit.gov.cn/'}>闽ICP备2023007468号-1</Link>
      <span>本站所有内容均来自互联网分享站点所提供的公开引用资源，未提供资源上传、存储服务</span>
    </footer>
  )
}
