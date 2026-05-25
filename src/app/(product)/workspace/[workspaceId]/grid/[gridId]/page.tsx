import GridView from "@/components/grid/grid-view";
export default function GridPage({ params }: { params: Promise<{ workspaceId: string; gridId: string }> }) {
  return <GridView params={params} />;
}
