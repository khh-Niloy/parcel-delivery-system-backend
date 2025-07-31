export function calculateFee(weight: number): number {
  const baseFee = 30;
  const perKg = 15;
  return baseFee + weight * perKg;
}
