import Navbar from "@/components/navbar/navbar";
import Sidebar from "@/components/sidebar/sidebar";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex overflow-hidden">

      {/* Sidebar */}
      <div className="border-r">
        <Sidebar/>
      </div>

      {/* Right side */}
      <div className="flex-1 flex flex-col">

        {/* Top Navbar */}
        <div>
          <Navbar/>
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950 scroll-smooth">
          {children}
        </main>

      </div>

    </div>
  );
}