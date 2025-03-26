"use client";

import AuthPage from "@/components/AuthPage/AuthPage";
import ClinianHomePage from "@/components/HomePage/ClinianHomePage";
import HomePagePatient from "@/components/HomePage/PatientHomePage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";



export default function PatientHomePage() {
  const router = useRouter();
  
  
  return <HomePagePatient />
}
