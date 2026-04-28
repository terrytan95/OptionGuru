import { redirect } from "next/navigation";
import { appConfig } from "@/lib/config";

export default function HomePage() {
  redirect(`/dashboard/${appConfig.defaultSymbol}`);
}
