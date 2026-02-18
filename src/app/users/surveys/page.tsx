"use client";

import { SurveyPage } from "@/features/surveys/pages/SurveysPage";
import { useGet } from "@/hooks/useApi";

const page = () => {
  const { data } = useGet(["enums"], "/enums", {
    isAuth: true,
  });

  const enumsStatusRaw = data?.data?.statusJt ?? [];

  return <SurveyPage statusJtEnum={enumsStatusRaw} />;
};

export default page;
