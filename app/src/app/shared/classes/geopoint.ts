class Geometry {
  type!: string;
  coordinates!: number[];
}

class Feature {
  type!: string;
  geometry!: Geometry; 
}

export class Geopoint {
  features!: Feature[];
}