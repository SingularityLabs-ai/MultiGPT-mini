import type { DsnComponents, Event, EventEnvelope, SdkMetadata } from '@sentry/types';
import type { JSSelfProfile, RawThreadCpuProfile, ThreadCpuProfile } from './jsSelfProfiling';
/**
 *
 */
export declare function enrichWithThreadInformation(profile: ThreadCpuProfile | RawThreadCpuProfile): ThreadCpuProfile;
export interface ProfiledEvent extends Event {
    sdkProcessingMetadata: {
        profile?: RawThreadCpuProfile;
    };
}
/**
 * Creates a profiling event envelope from a Sentry event. If profile does not pass
 * validation, returns null.
 * @param event
 * @param dsn
 * @param metadata
 * @param tunnel
 * @returns {EventEnvelope | null}
 */
/**
 * Creates a profiling event envelope from a Sentry event.
 */
export declare function createProfilingEventEnvelope(event: ProfiledEvent, dsn: DsnComponents, metadata?: SdkMetadata, tunnel?: string): EventEnvelope | null;
/**
 *
 */
export declare function isProfiledTransactionEvent(event: Event): event is ProfiledEvent;
/**
 *
 */
export declare function maybeRemoveProfileFromSdkMetadata(event: Event | ProfiledEvent): Event;
/**
 * Converts a JSSelfProfile to a our sampled format.
 * Does not currently perform stack indexing.
 */
export declare function convertJSSelfProfileToSampledFormat(input: JSSelfProfile): ThreadCpuProfile;
//# sourceMappingURL=utils.d.ts.map