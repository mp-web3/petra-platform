import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PlansService {
    private readonly planSlugToPriceId: Record<string, string>;

    constructor(private configService: ConfigService) {
        this.planSlugToPriceId = {
            // Woman Plans
            'woman-starter-6w': this.configService.get('PRICE_ID_W_STARTER_6W') || '',
            'woman-starter-18w': this.configService.get('PRICE_ID_W_STARTER_18W') || '',
            'woman-starter-36w': this.configService.get('PRICE_ID_W_STARTER_36W') || '',
            'woman-premium-6w': this.configService.get('PRICE_ID_W_PREMIUM_6W') || '',
            'woman-premium-18w': this.configService.get('PRICE_ID_W_PREMIUM_18W') || '',
            'woman-premium-36w': this.configService.get('PRICE_ID_W_PREMIUM_36W') || '',
            // Man Plans
            'man-starter-6w': this.configService.get('PRICE_ID_M_STARTER_6W') || '',
            'man-starter-18w': this.configService.get('PRICE_ID_M_STARTER_18W') || '',
            'man-starter-36w': this.configService.get('PRICE_ID_M_STARTER_36W') || '',
            'man-premium-6w': this.configService.get('PRICE_ID_M_PREMIUM_6W') || '',
            'man-premium-18w': this.configService.get('PRICE_ID_M_PREMIUM_18W') || '',
            'man-premium-36w': this.configService.get('PRICE_ID_M_PREMIUM_36W') || '',
        };
    }

    getPriceIdByPlanSlug(planSlug: string): string | null {
        return this.planSlugToPriceId[planSlug] || null;
    }

    getAllPlans(): Record<string, string> {
        return this.planSlugToPriceId;
    }
}

