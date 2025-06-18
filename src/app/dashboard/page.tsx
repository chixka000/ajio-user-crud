"use client";
import UserTable from '../../components/UserTable';

export default function DashboardPage() {
  return (
    <main style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontWeight: 600, fontSize: 32, marginBottom: 24 }}>Users Dashboard</h1>
      <UserTable />
    </main>
  );
} 