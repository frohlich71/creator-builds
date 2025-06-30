

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-full">
        <main className=" lg:-mt-24 mt-5 pb-8">
          {children}
        </main>
      </div>
    </>
  )
}
