import { produce } from 'immer'
import type { Draft } from 'immer'
import { atom } from 'jotai/vanilla'
import type { PrimitiveAtom, WritableAtom } from 'jotai/vanilla'

const cache1 = new WeakMap()
const memo1 = <T>(create: () => T, dep1: object): T =>
  (cache1.has(dep1) ? cache1 : cache1.set(dep1, create())).get(dep1)

export function withImmer<Value>(
  anAtom: PrimitiveAtom<Value>
): WritableAtom<Value, [Value | ((draft: Draft<Value>) => void)], void>

export function withImmer<Value, Result>(
  anAtom: WritableAtom<Value, [Value], Result>
): WritableAtom<Value, [Value | ((draft: Draft<Value>) => void)], Result>

export function withImmer<Value, Result>(
  anAtom: WritableAtom<Value, [Value], Result>
) {
  return memo1(() => {
    const derivedAtom = atom(
      (get) => get(anAtom),
      (get, set, fn: Value | ((draft: Draft<Value>) => void)) =>
        set(
          anAtom,
          produce(
            get(anAtom),
            typeof fn === 'function'
              ? (fn as (draft: Draft<Value>) => void)
              : () => fn
          )
        )
    )
    return derivedAtom
  }, anAtom)
}
