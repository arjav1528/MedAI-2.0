"use client";
// app/page.tsx
import HomePagePatient from '@/components/HomePage/PatientHomePage';
import AuthPage from '../components/AuthPage/AuthPage';
import { useAuth } from '@/lib/AuthContext';
import ClinianHomePage from '@/components/HomePage/ClinianHomePage';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if(user){
      if(user.role === "patient"){
        router.push("/patient");
      } else {
        router.push("/clinician");
      }
    }else{
      router.push("/auth");
    }
  })

}
