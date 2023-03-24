export function formatCurrency(value: number, currencySymbol = "USD"): string {
  if (!value) value = 0;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencySymbol,
    minimumFractionDigits: 0,
  });
  return formatter.format(value);
}
