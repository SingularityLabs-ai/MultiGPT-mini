import type { CheckInEvelope, DsnComponents, SdkMetadata, SerializedCheckIn } from '@sentry/types';
/**
 * Create envelope from check in item.
 */
export declare function createCheckInEnvelope(checkIn: SerializedCheckIn, metadata?: SdkMetadata, tunnel?: string, dsn?: DsnComponents): CheckInEvelope;
//# sourceMappingURL=checkin.d.ts.map