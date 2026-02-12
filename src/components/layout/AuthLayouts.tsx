import { Clipboard, FileWarning, SignalIcon } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { FeatureItem } from "@/components/forms/FeatureItem";
import type { FeatureItem as FeatureItemTypes } from "@/types";

interface AuthInterface {
  children: React.ReactNode;
}

const data: FeatureItemTypes[] = [
  {
    icon: Clipboard,
    title: "Easy Surveys",
    desc: "Create and distribute surveys with ease",
  },
  {
    icon: FileWarning,
    title: "Track Issues",
    desc: "Monitor and manage issues in real-time",
  },
  {
    icon: SignalIcon,
    title: "Analytics",
    desc: "Get insights from comprehensive reports",
  },
];

const AuthLayouts = (props: AuthInterface) => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-linear-to-br from-background to-muted">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">{props.children}</div>
        </div>
      </div>

      <div className="relative hidden lg:block overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/70 to-chart-2/90 z-10" />
        <Image
          src="/images/login.jpeg"
          alt="Image"
          className="absolute inset-0 10 h-full w-full object-cover"
          priority
          width={1000}
          height={1000}
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-10 text-primary-foreground">
          <div className="max-w-2xl space-y-8 text-center">
            <div className="space-y-5">
              <div className="space-y-1">
                <h1 className="text-4xl font-bold tracking-tight">MadPro</h1>
              </div>

              <p className="text-xl leading-relaxed max-w-xl">
                Madiun B2B Project Dashboard — a centralized platform to monitor
                progress, manage collaboration, and keep every project under
                control with clarity and precision.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              {data.map((items) => {
                return (
                  <FeatureItem
                    key={items.title}
                    icon={items.icon}
                    title={items.title}
                    desc={items.desc}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayouts;
