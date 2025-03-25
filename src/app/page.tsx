
// app/page.tsx
import HomePagePatient from '@/components/HomePage/PatientHomePage';
import AuthPage from '../components/AuthPage/AuthPage';
import { AuthProvider } from '@/lib/AuthContext';

export default function Home() {
  return(
    <>
      <AuthProvider>
        <HomePagePatient />
      </AuthProvider>
    </>
  )
}
