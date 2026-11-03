import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    health(): {
        status: string;
    };
    healthVersion(): {
        name: string;
        version: string;
    };
    demoAdmin(): {
        ok: boolean;
        area: string;
    };
    demoClient(): {
        ok: boolean;
        area: string;
    };
}
