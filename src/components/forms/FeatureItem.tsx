import type { LucideIcon } from "lucide-react";

export interface FeatureItemProps {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export const FeatureItem = ({ icon: Icon, title, desc }: FeatureItemProps) => {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div
        className="flex size-12 items-center justify-center rounded-lg 
                  bg-primary-foreground/10 
                  backdrop-blur-md 
                  border border-white/10
                  shadow-sm"
      >
        <Icon className="size-6" />
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm opacity-90">{desc}</p>
      </div>
    </div>
  );
};
