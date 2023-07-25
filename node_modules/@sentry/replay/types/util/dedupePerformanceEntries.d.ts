/**
 * There are some difficulties diagnosing why there are duplicate navigation
 * entries. We've witnessed several intermittent results:
 * - duplicate entries have duration = 0
 * - duplicate entries are the same object reference
 * - none of the above
 *
 * Compare the values of several keys to determine if the entries are duplicates or not.
 */
export declare function dedupePerformanceEntries(currentList: PerformanceEntryList, newList: PerformanceEntryList): PerformanceEntryList;
//# sourceMappingURL=dedupePerformanceEntries.d.ts.map