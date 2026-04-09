import SegmentacionCanastasScatter from "@/components/SegmentacionCanastasScatter";
import ClusterSummaryCardsCanastas from "@/components/ClusterSummaryCardsCanastas";

export function SegmentacionCanastasPage() {
  return (
    <div className="p-6">
      <SegmentacionCanastasScatter />
      <ClusterSummaryCardsCanastas />
    </div>
  );
}

export default SegmentacionCanastasPage;