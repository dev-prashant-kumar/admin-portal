import { Card, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-3 gap-6">

      <Card className="border-l-4 border-brandBlue">
        <CardContent className="p-6">
          <p>Total Workers</p>
          <h2 className="text-2xl font-bold">1200</h2>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-brandOrange">
        <CardContent className="p-6">
          <p>Total Recruiters</p>
          <h2 className="text-2xl font-bold">400</h2>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-brandGreen">
        <CardContent className="p-6">
          <p>Total Jobs</p>
          <h2 className="text-2xl font-bold">230</h2>
        </CardContent>
      </Card>

    </div>
  )
}