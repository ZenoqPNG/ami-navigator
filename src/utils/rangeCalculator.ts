export const calculateVerdict = (
  batteryLevel: number,
  isRaining: boolean,
  isCold: boolean,
  distanceKm: number,
  isRoundTrip: boolean,
  batteryHealth: number = 100 // SOH (State of Health)
) => {
  // Autonomie max théorique (75km) ajustée par la santé de la batterie
  let maxRange = 75 * (batteryHealth / 100);

  // Malus environnementaux
  if (isRaining) maxRange *= 0.85; // -15%
  if (isCold) maxRange *= 0.80;    // -20%

  // Autonomie restante selon le niveau actuel
  const currentRange = (maxRange * batteryLevel) / 100;
  const totalDistance = isRoundTrip ? distanceKm * 2 : distanceKm;

  // Calcul du verdict avec marge de sécurité de 20%
  if (currentRange >= totalDistance * 1.2) {
    return { label: "C'est large ! ✅", color: "#2ECC71" };
  } else if (currentRange >= totalDistance) {
    return { label: "Ça passe, mais doucement ⚠️", color: "#F39C12" };
  } else {
    return { label: "Impossible sans recharge ❌", color: "#E74C3C" };
  }
};