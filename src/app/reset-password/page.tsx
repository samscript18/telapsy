import { Suspense } from "react";
import { ResetPasswordForm } from "./reset-password-form";
export default function ResetPasswordPage(){return <Suspense fallback={<div className="shell py-24">Loading reset form…</div>}><ResetPasswordForm/></Suspense>}
