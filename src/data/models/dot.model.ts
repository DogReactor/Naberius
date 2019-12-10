export class Dot {
  Name: string;
  Length: number;
  Entries: Array<{
    Name: string;
    Sprites: Array<{
      X: number;
      Y: number;
      Width: number;
      Height: number;
      OriginX: number;
      OriginY: number;
    }>;
    PatternNo?: Array<{
      Time: number;
      Data: number;
    }>;
    Pos?: Array<{
      Time: number;
      Data: {
        X: number;
        Y: number;
        Z: number;
      };
    }>;
    Scale?: Array<{
      Time: number;
      Data: {
        X: number;
        Y: number;
        Z: number;
      };
    }>;
    Alpha?: Array<{
      Time: number;
      Data: number;
    }>;
  }>;
}
