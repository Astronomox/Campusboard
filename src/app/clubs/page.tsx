import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";
import { Empty } from "@/components/ui/Empty";

export default function ComingSoonPage() {
  return (
    <>
      <Backdrop />
      <PageShell title="Coming soon" back="/feed">
        <Empty icon="🚧" title="In the pipeline" body="This feature is planned for a future update of CampusBoard." />
      </PageShell>
    </>
  );
}
