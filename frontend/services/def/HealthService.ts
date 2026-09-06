import { healthApi } from "@/repositories/proxy/health.api";

import type { IHealth } from "@/domain/meta/IHealth";
import type { TPromise } from "@/domain/type/TCommon";

class HealthService {
  private api = healthApi.api;

  async getHealth(): TPromise<IHealth> {
    return this.api.getHealth<IHealth>();
  }
}

export const healthService = new HealthService();
