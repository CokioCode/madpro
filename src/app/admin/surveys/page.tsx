"use client";

import { Suspense } from "react";
import { SurveyPage } from "@/features/surveys/pages/SurveysPage";
import { useGet } from "@/hooks/useApi";

const page = () => {
  const { data } = useGet(["enums"], "/enums", {
    isAuth: true,
  });

  const enumsStatusRaw = data?.data?.statusJt ?? [];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SurveyPage statusJtEnum={enumsStatusRaw} />
    </Suspense>
  );
};

export default page;
