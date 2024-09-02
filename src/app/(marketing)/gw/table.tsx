import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const data = [
  { id: 1, name: "Emma Thompson", email: "emma@example.com", role: "Designer", status: "Active" },
  { id: 2, name: "Liam Wilson", email: "liam@example.com", role: "Developer", status: "Inactive" },
  { id: 3, name: "Olivia Martinez", email: "olivia@example.com", role: "Manager", status: "Active" },
  { id: 4, name: "Noah Anderson", email: "noah@example.com", role: "Developer", status: "Active" },
  { id: 5, name: "Ava Johnson", email: "ava@example.com", role: "Designer", status: "Inactive" },
]
const table = () => {
  return (
    <div className="rounded-md border border-gray-700 bg-gray-900 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-700 bg-gray-800">
            <TableHead className="font-semibold text-gray-200">Name</TableHead>
            <TableHead className="font-semibold text-gray-200">Email</TableHead>
            <TableHead className="font-semibold text-gray-200">Role</TableHead>
            <TableHead className="font-semibold text-gray-200">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow 
              key={item.id} 
              className={`border-b border-gray-700 ${
                index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
              } hover:bg-gray-700 transition-colors`}
            >
              <TableCell className="font-medium text-gray-200">{item.name}</TableCell>
              <TableCell className="text-gray-300">{item.email}</TableCell>
              <TableCell className="text-gray-300">{item.role}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  item.status === 'Active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                }`}>
                  {item.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default table