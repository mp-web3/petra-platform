import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHealth() {
        return {
            ok: true,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
        };
    }
}

