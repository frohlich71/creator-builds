

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-full">
        <main className="-mt-24 pb-8">
          {children}
        </main>
      </div>
    </>
  )
}
