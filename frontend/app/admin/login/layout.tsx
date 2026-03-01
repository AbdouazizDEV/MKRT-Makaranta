/**
 * Layout spécifique pour la page de login
 * N'inclut pas la Navbar et le Footer
 */

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {children}
    </div>
  );
}
