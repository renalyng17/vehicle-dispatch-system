import Nav from "./Client_nav.jsx";
import NotificationBar from "./Client_NotificationBar.jsx";

function Client_Requests() {
  const requests = [
    {
      name: "John Doe",
      department: "Logistics",
      vehicle: "Toyota Hilux",
      date: "2025-06-10",
      status: "Accepted",
    },
    {
      name: "Jane Smith",
      department: "Finance",
      vehicle: "Mitsubishi L300",
      date: "2025-06-09",
      status: "Declined",
    },
  ];

  return (
    

      <div
        className=" h-full bg-[#F9FFF5] overflow-auto"
      style={{ backgroundColor: "#FBFFF5" }}
      >
        <div className="p-6 ml-1">
          <h1 className="text-3xl font-bold">Request List</h1>
        </div>

        <div className="mx-8 mt-6 p-6 bg-white shadow rounded-md">
          <table className="w-full text-left border-collapse">
            <thead className="md:bg-green-600 text-white">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Office/Department</th>
                <th className="py-3 px-4">Vehicle Type</th>
                <th className="py-3 px-4">Date Entered</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 px-4">{req.name}</td>
                  <td className="py-3 px-4">{req.department}</td>
                  <td className="py-3 px-4">{req.vehicle}</td>
                  <td className="px-6 py-4">
                    {new Date(req.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    })}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-4 py-1 rounded-md text-sm font-medium ${
                        req.status === "Accepted"
                          ? "bg-green-300 text-green-900"
                          : "bg-rose-300 text-rose-900"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    
  );
}

export default Client_Requests;