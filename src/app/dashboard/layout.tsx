import Sidebar from "@/components/sidebar/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">

      <Sidebar />

      <main className="flex-1 bg-gray-50 p-8">
        {children}
      </main>

    </div>
  )
}