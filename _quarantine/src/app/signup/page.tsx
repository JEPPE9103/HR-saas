"use client";

import { useRouter } from "next/navigation";
import { getAuthClient, firebaseDb as dbFactory } from "@/lib/firebase/client";
import { doc, getDoc, getDocs, query, where, collection } from "firebase/firestore";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Sign Up</h1>
      <div className="prose prose-slate max-w-none">
        <p className="mb-4">
          Create your account to get started with Pay Transparency analysis.
        </p>
        <p className="mb-4">
          Contact us at sales@paytransparency.com to set up your account.
        </p>
      </div>
    </div>
  );
}


