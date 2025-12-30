const GRAPHHOPPER_KEY = 'VOTRE_CLE_API'; // À obtenir sur graphhopper.com

export const getRoute = async (startCoords, endCoords) => {
  const url = `https://graphhopper.com/api/1/route?point=${startCoords.lat},${startCoords.lng}&point=${endCoords.lat},${endCoords.lng}&profile=car&locale=fr&calc_points=true&key=${GRAPHHOPPER_KEY}&ch.disable=true&custom_model={"priority":[{"if":"road_class==MOTORWAY || road_class==TRUNK","multiply_by":0}]}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      distance: data.paths[0].distance / 1000, // Conversion en km
      points: data.paths[0].points,
    };
  } catch (error) {
    console.error("Erreur itinéraire:", error);
    return null;
  }
};