import type { Metadata } from "next";
import { ThankYouContent } from "./content";

export const metadata: Metadata = {
  title: "Спасибо за заявку",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return <ThankYouContent />;
}
