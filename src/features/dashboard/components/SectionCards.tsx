import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useGet } from "@/hooks/useApi";
import { cn } from "@/lib/utils";

type StatsData = {
  totalSurvey: number;
  totalPending: number;
  totalGoLive: number;
  approvalRate: number;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: StatsData;
};

interface SectionCardsProps {
  hariTerakhir: number;
  statusJtEnum?: string[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  iconColor?: string;
  iconBgColor?: string;
  isLoading?: boolean;
  progress?: number;
  showProgress?: boolean;
  href?: string;
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-blue-600",
  iconBgColor = "bg-blue-100",
  isLoading = false,
  progress,
  showProgress = false,
  href,
}: StatCardProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-32" />
          {showProgress && <Skeleton className="h-2 w-full" />}
        </CardContent>
      </Card>
    );
  }

  const handleClick = () => {
    if (href) router.push(href);
  };

  return (
    <Card
      className={cn(
        "group hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden",
        href && "cursor-pointer",
      )}
      onClick={handleClick}
      role={href ? "button" : undefined}
      tabIndex={href ? 0 : undefined}
      onKeyDown={(e) => {
        if (href && (e.key === "Enter" || e.key === " ")) handleClick();
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "p-2 rounded-lg transition-all duration-200",
            iconBgColor,
            "group-hover:scale-110",
          )}
        >
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 -mt-5">
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
        {showProgress && progress !== undefined && (
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">
              {progress.toFixed(1)}%
            </p>
          </div>
        )}
        {href && (
          <p className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Lihat data →
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function SectionCards({ hariTerakhir }: SectionCardsProps) {
  const { data, isLoading, error } = useGet<ApiResponse>(
    ["survey-stats", hariTerakhir],
    `/survey/stats?hariTerakhir=${hariTerakhir}`,
    { isAuth: true },
  );

  const totalSurvey = data?.data?.totalSurvey ?? 0;
  const totalPending = data?.data?.totalPending ?? 0;
  const totalGoLive = data?.data?.totalGoLive ?? 0;
  const approvalRate = data?.data?.approvalRate ?? 0;

  const pendingPercentage =
    totalSurvey > 0 ? (totalPending / totalSurvey) * 100 : 0;
  const goLivePercentage =
    totalSurvey > 0 ? (totalGoLive / totalSurvey) * 100 : 0;

  const baseUrl = "/admin/surveys";

  const stats = [
    {
      title: "Total Surveys",
      value: totalSurvey.toLocaleString(),
      subtitle: `${hariTerakhir} hari terakhir`,
      icon: FileText,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-100",
      showProgress: false,
      href: `${baseUrl}?hariTerakhir=${hariTerakhir}`,
    },
    {
      title: "Pending Review",
      value: totalPending.toLocaleString(),
      subtitle: `${pendingPercentage.toFixed(1)}% dari total`,
      icon: Clock,
      iconColor: "text-orange-600",
      iconBgColor: "bg-orange-100",
      progress: pendingPercentage,
      showProgress: true,
      href: `${baseUrl}?statusUsulanNot=GOLIVE&statusUsulanNot=APPROVE&statusUsulanNot=CANCEL_PELANGGAN&hariTerakhir=${hariTerakhir}`,
    },
    {
      title: "Sudah Go Live",
      value: totalGoLive.toLocaleString(),
      subtitle: `${goLivePercentage.toFixed(1)}% sudah live`,
      icon: CheckCircle2,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-100",
      progress: goLivePercentage,
      showProgress: true,
      href: `${baseUrl}?statusJt=GOLIVE&hariTerakhir=${hariTerakhir}`,
    },
    {
      title: "Approval Rate",
      value: `${approvalRate.toFixed(1)}%`,
      subtitle:
        approvalRate >= 50
          ? "Di atas rata-rata"
          : approvalRate > 0
            ? "Di bawah rata-rata"
            : "Belum ada data",
      icon: TrendingUp,
      iconColor: approvalRate >= 50 ? "text-green-600" : "text-orange-600",
      iconBgColor: approvalRate >= 50 ? "bg-green-100" : "bg-orange-100",
      progress: approvalRate,
      showProgress: true,
      href: `${baseUrl}?statusJt=APPROVE&hariTerakhir=${hariTerakhir}`,
    },
  ];

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-full border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Gagal memuat data</p>
                <p className="text-sm text-muted-foreground">
                  Silakan refresh halaman atau hubungi admin
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} isLoading={isLoading} />
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            Memuat data...
          </span>
        </div>
      )}
    </div>
  );
}
