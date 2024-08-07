import Fotter from "@/components/orginalcom/Fotter";
import Header from "@/components/orginalcom/Header"; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="">
      <Header />
      <main className="flex-1">{children}</main>
      <Fotter />
    </div>
  )
}