import * as dotenv from 'dotenv-safe';

import { getEnv } from '../utils/helper';

dotenv.config();

export default {
    env: getEnv('NODE_EV', 'local'),
    host: getEnv('APP_HOST', '0.0.0.0'),
    port: getEnv('APP_PORT', 3000),
    timezone: getEnv('TZ', 'Europe/Rome'),
    jwt: {
        secret: getEnv('JWT_SECRET', '', true),
        ttl: getEnv('JWT_TTL', '', true),
    },
    redis: {
        host: getEnv('REDIS_HOST', '', true),
        port: getEnv('REDIS_PORT', '', true),
        pass: getEnv('REDIS_PASS', '', true),
    },
    minio: {
        user: getEnv('MINIO_ROOT_USER', '', true),
        pass: getEnv('MINIO_ROOT_PASSWORD', '', true),
        api: {
            host: getEnv('MINIO_HOST', '', true),
            port: getEnv('MINIO_API_PORT', '', true),
        },
    },
    mailhog: {
        host: getEnv('MAILHOG_HOST', '', true),
        port: getEnv('MAILHOG_SMTP_PORT', '', true),
    },
    database: {
        type: getEnv('DB', 'mongodb'),
        host: getEnv('MONGO_HOST', '', true),
        port: getEnv('MONGO_PORT', '', true),
        name: getEnv('MONGO_DB_NAME', '', true),
        user: getEnv('MONGO_USER', '', true),
        pass: getEnv('MONGO_PASS', '', true),
    },
};
