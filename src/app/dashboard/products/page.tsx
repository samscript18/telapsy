import { ProductsClient } from "@/app/products/products-client";
import { AccountShell } from "@/components/account-shell";

export default function DashboardProductsPage() {
  return <AccountShell title="Products"><ProductsClient authenticated /></AccountShell>;
}
