import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Lorena Lash Studio",
  description: "Comanda chiar acum produse sau cursuri pentru a intra in lumea extensiilor de gene!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
