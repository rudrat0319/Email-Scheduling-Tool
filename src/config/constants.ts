import { DEFAULT_CIPHERS } from "node:tls";

export enum JobStatus{
    SCHEDULED = 'scheduled',
    PROCESSING = 'processing',
    SENT = 'sent',
    FAILED = 'failed',
}

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
};

export const SCHEDULING = {
    MIN_DELAY_SECONDS: 1,
    MAX_DELAY_SECONDS: 3600,
    MIN_HOURLY_LIMIT: 1,
    MAX_HOURLY_LIMIT: 10000,
    MAX_RECIPIENTS: 10000,
}