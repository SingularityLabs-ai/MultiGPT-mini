import { useCallback } from 'react'
import { produce } from 'immer'
import type { Draft } from 'immer'
import { useAtom } from 'jotai/react'
import type { WritableAtom } from 'jotai/vanilla'

type Scope = NonNullable<Parameters<typeof useAtom>[1]>

export function useImmerAtom<Value, Result>(
  anAtom: WritableAtom<Value, [(draft: Draft<Value>) => void], Result>,
  scope?: Scope
): [Value, (fn: (draft: Draft<Value>) => void) => Result]

export function useImmerAtom<Value, Result>(
  anAtom: WritableAtom<Value, [(value: Value) => Value], Result>,
  scope?: Scope
): [Value, (fn: (draft: Draft<Value>) => void) => Result]

export function useImmerAtom<Value, Result>(
  anAtom: WritableAtom<Value, [(value: Value) => Value], Result>,
  scope?: Scope
) {
  const [state, setState] = useAtom(anAtom, scope)
  const setStateWithImmer = useCallback(
    (fn: (draft: Draft<Value>) => void) => setState(produce(fn)),
    [setState]
  )
  return [state, setStateWithImmer]
}
