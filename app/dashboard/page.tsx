import { Metadata } from "next";
import DashboardContent from "@/app/components/DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard | NIL",
  description: "Manage your encrypted vaults and view security metrics",
};

export default function DashboardPage() {
  return <DashboardContent />;
}
