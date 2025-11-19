export default function Home() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 300 }).map((_, _k) => (
        <div key={_k}>123456</div>
      ))}
    </div>
  )
}
