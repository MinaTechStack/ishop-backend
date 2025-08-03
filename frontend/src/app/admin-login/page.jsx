// app/admin-login/page.js (or whatever your AdminLogin's parent page file is)
import React, { Suspense } from "react"; // Ensure Suspense is imported
import AdminLogin from "./AdminloginPage";

export default function AdminLoginPage() { // Renamed for clarity, if this is the page for admin-login
  return (
    <Suspense fallback={<div>Loading admin login...</div>}> // Wrap AdminLogin with Suspense
      <AdminLogin/>
    </Suspense>
  );
}