"use client";

import AuthPage from "@/components/AuthPage/AuthPage";
import ClinianHomePage from "@/components/HomePage/ClinianHomePage";
import HomePagePatient from "@/components/HomePage/PatientHomePage";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";



export default function PatientHomePage() {
  const router = useRouter();
  const { user, setUser} = useUser();
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  })
  console.log(user?.role);
  if(user?.role === "clinician") {
    return <ClinianHomePage />
  }
  return <HomePagePatient />
}
