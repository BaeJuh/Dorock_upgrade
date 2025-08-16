export interface AIResponseObj {
  result: {
    recommendation: string;
    [key: string]: { places: string[] } | string;
  };
}
