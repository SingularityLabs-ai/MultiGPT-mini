import type { Transaction, TransactionContext } from '@sentry/types';
import * as React from 'react';
import type { CreateRouterFunction, CreateRoutesFromChildren, MatchRoutes, Router, RouterState, UseEffect, UseLocation, UseNavigationType, UseRoutes } from './types';
export declare function reactRouterV6Instrumentation(useEffect: UseEffect, useLocation: UseLocation, useNavigationType: UseNavigationType, createRoutesFromChildren: CreateRoutesFromChildren, matchRoutes: MatchRoutes): (customStartTransaction: (context: TransactionContext) => Transaction | undefined, startTransactionOnPageLoad?: boolean, startTransactionOnLocationChange?: boolean) => void;
export declare function withSentryReactRouterV6Routing<P extends Record<string, any>, R extends React.FC<P>>(Routes: R): R;
export declare function wrapUseRoutes(origUseRoutes: UseRoutes): UseRoutes;
export declare function wrapCreateBrowserRouter<TState extends RouterState = RouterState, TRouter extends Router<TState> = Router<TState>>(createRouterFunction: CreateRouterFunction<TState, TRouter>): CreateRouterFunction<TState, TRouter>;
//# sourceMappingURL=reactrouterv6.d.ts.map