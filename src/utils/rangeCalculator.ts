export const calculateVerdict = (
  battery: number,
  isRaining: boolean,
  isCold: boolean,
  distance: number,
  isRoundTrip: boolean,
  soh: number
) => {
  // Consommation de base de l'Ami : ~70 Wh/km
  // Batterie utile : 5.35 kWh (5350 Wh)
  let totalDistance = isRoundTrip ? distance * 2 : distance;
  
  // Ajustement selon l'état de santé de la batterie (SOH)
  let availableWh = 5350 * (soh / 100) * (battery / 100);
  
  // Malus météo
  let consumptionPerKm = 75; // Base un peu large pour la sécurité
  if (isRaining) consumptionPerKm += 10;
  if (isCold) consumptionPerKm += 15;

  let estimatedRange = availableWh / consumptionPerKm;

  if (estimatedRange > totalDistance * 1.2) {
    return { label: "ÇA PASSE LARGEMENT", color: "#2ECC71" }; // Vert
  } else if (estimatedRange > totalDistance) {
    return { label: "PRUDENCE (ÉCO)", color: "#F39C12" }; // Orange
  } else {
    return { label: "TROP LOIN / RECHARGE", color: "#E74C3C" }; // Rouge
  }
};