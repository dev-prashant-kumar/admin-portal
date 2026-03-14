import Sidebar from "@/components/sidebar/sidebar"
import Navbar from "@/components/navbar/navbar"
import { ReactNode } from "react"

type AdminLayoutProps = {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Navbar />

        <main className="p-6 bg-slate-50 dark:bg-slate-950 min-h-screen">
          {children}
        </main>

      </div>

    </div>
  )
}