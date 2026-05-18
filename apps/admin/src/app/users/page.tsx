import { AdminShell } from "@/components/admin-shell";

const users = ["demo@example.com", "creator@example.com", "ops@example.com"];

export default function UsersPage() {
  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold">Users</h1>
      <div className="mt-6 overflow-hidden rounded-lg border border-white/10">
        {users.map((email) => (
          <div key={email} className="grid grid-cols-3 border-b border-white/10 p-4 text-sm last:border-b-0">
            <span>{email}</span>
            <span className="text-white/[0.58]">ACTIVE</span>
            <span className="text-right text-white/[0.58]">1,240 credits</span>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
