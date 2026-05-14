import Link from "next/link";
import { deleteUser } from "./action";
import { prisma } from "@/app/lib/db"; // ✅ Use your singleton
import type { UserModel } from "@/app/generated/prisma/models"; // ✅ Correct type import

export default async function UserListPage() {
  const users = await prisma.user.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <Link href="/user/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add New User
        </Link>
      </div>

      <table className="w-full border-collapse border border-gray-200 shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-3 text-left">ID</th>
            <th className="border p-3 text-left">Name</th>
            <th className="border p-3 text-left">Email</th>
            <th className="border p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: UserModel) => {
            const deleteAction = deleteUser.bind(null, user.id);
            return (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border p-3">{user.id}</td>
                <td className="border p-3">{user.name}</td>
                <td className="border p-3">{user.email}</td>
                <td className="border p-3 flex justify-center gap-4">
                  <Link href={`/user/${user.id}/edit`} className="text-blue-500 hover:underline">
                    Edit
                  </Link>
                  <form action={deleteAction}>
                    <button type="submit" className="text-red-500 hover:underline">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
