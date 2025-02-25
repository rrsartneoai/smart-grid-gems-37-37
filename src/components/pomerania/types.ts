
export interface Installation {
  id: number;
  location: {
    latitude: number;
    longitude: number;
  };
  address: {
    streetNumber?: string;
    street?: string;
    city?: string;
  };
}

export interface Measurement {
  current: {
    fromDateTime: string;
    tillDateTime: string;
    values: Array<{
      name: string;
      value: number;
    }>;
    indexes: Array<{
      name: string;
      value: number;
      level: string;
      description: string;
      advice: string;
      color: string;
    }>;
  };
}
