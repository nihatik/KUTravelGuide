export type Coordinates = {
  latitude: number;
  longitude: number;
};

export default class GeoService {
  static async getCurrentPosition(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Геолокация не поддерживается браузером"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log(pos);
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => reject(err)
      );
    });
  }

  public static baseLat = 54.87700928580048;
  public static baseLon = 69.13121316834445;
  private static scale = 10000;

  public static formatCoords(lat: number, lon: number): [number, number] {
    const x = (lat- this.baseLon) * this.scale;
    const z = (lon - this.baseLat) * this.scale;

    return [x, z];
  }
}