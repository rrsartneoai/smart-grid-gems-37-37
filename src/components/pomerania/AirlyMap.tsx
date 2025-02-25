
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchInstallations, fetchMeasurements } from "./airlyService";
import { createMarkerPopup } from "./AirQualityPopup";

export function AirlyMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const map = L.map(mapRef.current).setView([54.34854, 18.64966], 11);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        L.control.zoom({
          position: 'bottomright'
        }).addTo(map);

        mapInstance.current = map;

        const installations = await fetchInstallations(54.34854, 18.64966);

        for (const installation of installations) {
          try {
            const measurements = await fetchMeasurements(installation.id);
            const marker = L.marker([
              installation.location.latitude,
              installation.location.longitude
            ]);

            const popupContent = createMarkerPopup(installation, measurements);
            marker.bindPopup(popupContent);
            
            const index = measurements.current.indexes[0];
            if (index) {
              marker.setIcon(L.divIcon({
                className: 'custom-div-icon',
                html: `<div style="
                  width: 24px;
                  height: 24px;
                  background-color: ${index.color};
                  border-radius: 50%;
                  border: 2px solid white;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                "></div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              }));
            }

            marker.addTo(map);
          } catch (error) {
            console.error(`Error processing installation ${installation.id}:`, error);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setError('Wystąpił błąd podczas ładowania danych');
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center min-h-[200px]">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6 text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-[#1A1F2C]">
      <CardHeader>
        <CardTitle>Mapa czujników Airly - Trójmiasto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[600px] rounded-lg overflow-hidden" ref={mapRef} />
        <div className="mt-4 text-sm text-muted-foreground">
          Dane pochodzą z czujników Airly. Kliknij w znacznik na mapie, aby zobaczyć szczegółowe informacje o jakości powietrza.
          Kolor znacznika odpowiada jakości powietrza w danym miejscu.
        </div>
      </CardContent>
    </Card>
  );
}
