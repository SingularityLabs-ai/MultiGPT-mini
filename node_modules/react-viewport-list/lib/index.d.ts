import { MutableRefObject, ForwardedRef, RefObject, CSSProperties } from 'react';
export interface ScrollToIndexOptions {
    index?: number;
    alignToTop?: boolean;
    offset?: number;
    delay?: number;
    prerender?: number;
}
export interface ViewportListRef {
    scrollToIndex: (options: ScrollToIndexOptions) => void;
    getScrollPosition: () => {
        index: number;
        offset: number;
    };
}
export interface ViewportListPropsBase {
    viewportRef?: MutableRefObject<HTMLElement | null> | RefObject<HTMLElement | null> | {
        current: HTMLElement | null;
    } | null;
    itemSize?: number;
    itemMargin?: number;
    overscan?: number;
    axis?: 'y' | 'x';
    initialIndex?: ScrollToIndexOptions['index'];
    initialAlignToTop?: ScrollToIndexOptions['alignToTop'];
    initialOffset?: ScrollToIndexOptions['offset'];
    initialDelay?: ScrollToIndexOptions['delay'];
    initialPrerender?: ScrollToIndexOptions['prerender'];
    onViewportIndexesChange?: (viewportIndexes: [number, number]) => void;
    overflowAnchor?: 'none' | 'auto';
    withCache?: boolean;
    scrollThreshold?: number;
    renderSpacer?: (props: {
        ref: MutableRefObject<any>;
        style: CSSProperties;
        type: 'top' | 'bottom';
    }) => any;
    indexesShift?: number;
    getItemBoundingClientRect?: (element: Element) => DOMRect | {
        bottom: number;
        left: number;
        right: number;
        top: number;
        width: number;
        height: number;
    };
}
export interface ViewportListPropsWithItems<T> extends ViewportListPropsBase {
    items?: T[];
    children: (item: T, index: number, array: T[]) => any;
}
export interface ViewportListPropsWithCount extends ViewportListPropsBase {
    count: number;
    children: (index: number) => any;
}
declare const ViewportListInner: <T>({ items, count, children, viewportRef, itemSize, itemMargin, overscan, axis, initialIndex, initialAlignToTop, initialOffset, initialDelay, initialPrerender, onViewportIndexesChange, overflowAnchor, withCache, scrollThreshold, renderSpacer, indexesShift, getItemBoundingClientRect, }: ViewportListPropsBase & {
    items?: T[] | undefined;
    count?: number | undefined;
    children: (...args: any) => any;
}, ref: ForwardedRef<ViewportListRef>) => JSX.Element;
export interface ViewportList {
    <T>(props: ViewportListPropsWithItems<T> & {
        ref?: ForwardedRef<ViewportListRef>;
    }): ReturnType<typeof ViewportListInner>;
    (props: ViewportListPropsWithCount & {
        ref?: ForwardedRef<ViewportListRef>;
    }): ReturnType<typeof ViewportListInner>;
}
export declare const ViewportList: ViewportList;
export {};
