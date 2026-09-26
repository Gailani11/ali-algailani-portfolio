/**
 * Minimal React type surface.
 * The workspace this was built in had no access to the npm registry, so @types/react
 * could not be installed. This shim covers exactly the API the project uses, so
 * `tsc --noEmit` still type-checks our own code. When you install @types/react
 * (`npm i -D @types/react @types/react-dom`) delete this file.
 */
declare module 'react' {
  export type ReactNode = any;
  export type Key = string | number;
  export interface CSSProperties {
    [k: string]: string | number | undefined;
  }
  export interface RefObject<T> {
    readonly current: T | null;
  }
  export interface MutableRefObject<T> {
    current: T;
  }
  export type Ref<T> = RefObject<T> | ((v: T | null) => void) | null;
  export type Dispatch<A> = (a: A) => void;
  export type SetStateAction<S> = S | ((prev: S) => S);
  export type FC<P = {}> = (props: P & { children?: ReactNode }) => any;
  export type PropsWithChildren<P = {}> = P & { children?: ReactNode };
  export interface Context<T> {
    Provider: any;
    Consumer: any;
    _t?: T;
  }
  export type MouseEvent<T = Element> = globalThis.MouseEvent & { currentTarget: T };
  export type PointerEvent<T = Element> = globalThis.PointerEvent & { currentTarget: T };
  export type KeyboardEvent<T = Element> = globalThis.KeyboardEvent & { currentTarget: T };
  export type ElementType = any;

  export function useState<S>(init: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  export function useEffect(fn: () => void | (() => void), deps?: readonly unknown[]): void;
  export function useLayoutEffect(fn: () => void | (() => void), deps?: readonly unknown[]): void;
  export function useRef<T>(init: T): MutableRefObject<T>;
  export function useRef<T>(init: T | null): RefObject<T>;
  export function useMemo<T>(fn: () => T, deps: readonly unknown[]): T;
  export function useCallback<T extends (...a: any[]) => any>(fn: T, deps: readonly unknown[]): T;
  export function useContext<T>(c: Context<T>): T;
  export function createContext<T>(v: T): Context<T>;
  export function useId(): string;
  export function memo<T>(c: T): T;
  export function lazy<T>(f: () => Promise<{ default: T }>): T;
  export const Fragment: any;
  export const StrictMode: any;
  export const Suspense: any;
  const React: any;
  export default React;
}
declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}
declare module 'react-dom/client' {
  export function createRoot(el: Element): { render(n: any): void };
}
declare namespace JSX {
  interface IntrinsicElements {
    [el: string]: any;
  }
  type Element = any;
  interface ElementChildrenAttribute {
    children: {};
  }
  interface IntrinsicAttributes {
    key?: string | number;
  }
}
declare module '*.css';
