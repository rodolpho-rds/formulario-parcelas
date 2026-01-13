export const metadata = {
  title: 'Gestão de Parcelas',
  description: 'Sistema de gestão de parcelas e contratos',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
