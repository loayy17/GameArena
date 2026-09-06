interface IHealth {
  status: string;
  service: string;
  timestamp: string;
  uptimeSeconds: number;
  database: string;
}

export type { IHealth };
