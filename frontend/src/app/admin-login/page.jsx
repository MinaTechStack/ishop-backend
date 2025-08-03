 
import React, { Suspense } from "react"; //  
import AdminLogin from "./AdminloginPage";

export default function AdminLoginPage() {  
  return (
    <Suspense fallback={<div>Loading admin login...</div>}> 
      <AdminLogin/>
    </Suspense>
  );
}