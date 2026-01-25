import SideMenu from "./SideMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start ">
      <SideMenu />
      <main className="flex-1 bg-[#0C0A14] min-h-screen">{children}</main>
    </div>
  );
}
