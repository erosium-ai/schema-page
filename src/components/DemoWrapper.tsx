import { PageData } from "@/lib/types";
import { isDemoAllowlistEnabled } from "@/lib/founder";
import DemoBanner from "@/components/DemoBanner";
import PageShell from "@/components/PageShell";

export default function DemoWrapper({ page }: { page: PageData }) {
  const showDemoBanner = isDemoAllowlistEnabled();

  return (
    <>
      {showDemoBanner && <DemoBanner />}
      <PageShell page={page} demoSafeMode />
    </>
  );
}
