import { healthApi } from "@/repositories/proxy/health.api";
import { ErrorCodeEnum } from "@/domain/enum/ErrorCodeEnum";

import type { IHealth } from "@/domain/meta/IHealth";
import type { TPromise } from "@/domain/type/TCommon";

class HealthService {
    private api = healthApi.api;

    async getHealth(): TPromise<IHealth> {
        const body = (await this.api.getHealth<string>()) as unknown;
        const healthy =
            typeof body === "string" && body.toLowerCase() === "healthy";
        return {
            success: healthy,
            errorCode: healthy ? ErrorCodeEnum.None : ErrorCodeEnum.ServerError,
            data: {
                status: healthy ? "ok" : "error",
                service: "Arena 404 API",
                timestamp: new Date().toISOString(),
                uptimeSeconds: 0,
                database: healthy ? "connected" : "disconnected",
            },
        };
    }
}

export const healthService = new HealthService();

