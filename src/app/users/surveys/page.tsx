"use client";

import { SurveyPage } from "@/features/surveys/pages/SurveysPage";
import { useGet } from "@/hooks/useApi";

const page = () => {
  const { data } = useGet(["enums"], "/enums", {
    isAuth: true,
  });

  const enumsStatusRaw = data?.data?.statusJt ?? [];
  const enumsStatus = ["ALL", ...enumsStatusRaw];

  return <SurveyPage statusJtEnum={enumsStatus} />;
};

export default page;
