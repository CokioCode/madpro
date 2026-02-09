import type React from "react";
import AuthLayouts from "@/components/layout/AuthLayouts";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <AuthLayouts>{children}</AuthLayouts>;
};

export default layout;
