import React, { Suspense } from "react";
import AuthForm from "./Authform";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthForm/>
    </Suspense>
  );
}
