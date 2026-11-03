import { CatalogService } from './catalog.service';
export declare class CatalogController {
    private readonly catalogService;
    constructor(catalogService: CatalogService);
    getSummary(): Promise<{
        totalProducts: number;
        totalStockUnits: number;
    }>;
}
