import { Toaster } from 'react-hot-toast';

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <main>
      <Toaster
        position="bottom-right"
        reverseOrder={false}  // newest toast on bottom
      />
      {children}
    </main>
  )
}
