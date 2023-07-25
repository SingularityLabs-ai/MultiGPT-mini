import type { ProcessedJSSelfProfile } from './jsSelfProfiling';
/**
 * Performs lookup in the event cache and sends the profile to Sentry.
 * If the profiled transaction event is found, we use the profiled transaction event and profile
 * to construct a profile type envelope and send it to Sentry.
 */
export declare function sendProfile(profileId: string, profile: ProcessedJSSelfProfile): void;
//# sourceMappingURL=sendProfile.d.ts.map