import React, { useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthProvider";
import Navbar from "../components/Navbar";



 const API =
   import.meta.env.MODE === "production"
     ? import.meta.env.VITE_API_PROD
     : import.meta.env.VITE_API_DEV;
function UsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })

      .then((res) => res.json())
      .then((data) => {
        setUsers(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <p className="p-4">Loading users...</p>;

  return (
    <>
      <div className="mb-6">
      </div>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Users ({users.length})</h1>
        <table className="w-full border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UsersPage;
