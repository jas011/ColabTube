"use client";
import Layout from "./Layout";
import { Main } from "./Main";
import { Suspense } from "react";
export default function Page() {
  return (
    <Layout>
      <Suspense fallback={<div />}>
        <Main />
      </Suspense>
    </Layout>
  );
}
