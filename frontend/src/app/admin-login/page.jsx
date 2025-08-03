 
import React, { Suspense } from "react"; // Ensure Suspense is imported
import AdminLogin from "./AdminloginPage";

export default function AdminLoginPage() {  
  return (
    <Suspense fallback={<div>Loading admin login...</div>}> 
      <AdminLogin/>
    </Suspense>
  );
}