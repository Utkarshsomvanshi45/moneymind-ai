import AppSidebar from './AppSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="md:ml-[220px] min-h-screen pb-20 md:pb-0 page-enter">
        <div className="max-w-[1200px] mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
