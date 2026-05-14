import Link from "next/link";
import { deleteUser } from "./action";
import { prisma } from "../lib/db"; // Using relative path for safety

export default async function UserListPage() {
  const users = await prisma.user.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <div className="min-vh-100 bg-dark text-white pt-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="container mt-5">
        
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary">
          <div>
            <h1 className="fw-bold text-warning mb-0" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1.5rem' }}>
              System Pilots
            </h1>
            <p className="text-muted mb-0 mt-2">Manage all registered users and admins.</p>
          </div>
          <div className="d-flex gap-3">
            <Link href="/dashboard" className="btn btn-outline-light">
              &larr; Back
            </Link>
            <Link href="/users/add_user" className="btn btn-primary fw-bold">
              + Add User
            </Link>
          </div>
        </div>

        {/* Users Table */}
        <div className="table-responsive shadow-lg rounded">
          <table className="table table-dark table-hover table-bordered align-middle mb-0">
            <thead className="table-active text-uppercase" style={{ fontFamily: "'Roboto Condensed', sans-serif" }}>
              <tr>
                <th className="p-3 text-center" style={{ width: '80px' }}>ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Username</th>
                <th className="p-3 text-center">Clearance</th>
                <th className="p-3 text-center" style={{ width: '200px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                // Pre-bind the ID to the server action so it's ready to fire
                const deleteAction = deleteUser.bind(null, user.id);
                
                return (
                  <tr key={user.id}>
                    <td className="p-3 text-center fw-bold ">{user.id}</td>
                    <td className="p-3 fw-bold">{user.name}</td>
                    <td className="p-3 text-info">{user.email}</td>
                    <td className="p-3 text-info">{user.username}</td>
                    <td className="p-3 text-center">
                      <span className={`badge ${user.roles === 'ADMIN' ? 'bg-danger' : 'bg-success'}`}>
                        {user.roles}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Link href={`/users/${user.id}/edit_user`} className="btn btn-sm btn-outline-info">
                          Edit
                        </Link>
                        <form action={deleteAction}>
                          <button type="submit" className="btn btn-sm btn-outline-danger">
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {/* Empty state if there are no users (which shouldn't happen since you are logged in!) */}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-5 text-muted">
                    No pilots found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}