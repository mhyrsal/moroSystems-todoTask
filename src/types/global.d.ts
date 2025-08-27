/// <reference types="vite/client" />

declare module '*.svg' {
    import * as React from 'react';
    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
    const src: string;
    export default src;
}

declare module '*.css' {
    const content: Record<string, string>;
    export default content;
}

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_WS_URL: string;
    readonly VITE_ENABLE_MSW: string;
    readonly VITE_APP_VERSION: string;
    readonly VITE_APP_NAME: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
}

// Extend global types
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test';
        }
    }
}

// Custom event types
interface CustomEventMap {
    'local-storage': CustomEvent<{ key: string; newValue: any }>;
    'theme-change': CustomEvent<{ theme: 'light' | 'dark' }>;
    'language-change': CustomEvent<{ language: 'en' | 'cs' }>;
    'todo-update': CustomEvent<{ todoId: string; updates: any }>;
    'sync-complete': CustomEvent<{ timestamp: string }>;
}

declare global {
    interface WindowEventMap extends CustomEventMap {}
}

// Utility types
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type Maybe<T> = T | null | undefined;

type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

type DeepRequired<T> = T extends object
    ? {
          [P in keyof T]-?: DeepRequired<T[P]>;
      }
    : T;

type DeepReadonly<T> = T extends object
    ? {
          readonly [P in keyof T]: DeepReadonly<T[P]>;
      }
    : T;

type ValueOf<T> = T[keyof T];

type Entries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (...args: any) => Promise<infer R> ? R : any;

type Await<T> = T extends PromiseLike<infer U> ? U : T;

// Brand types for type safety
type Brand<K, T> = K & { __brand: T };

type TodoId = Brand<string, 'TodoId'>;
type UserId = Brand<string, 'UserId'>;
type Timestamp = Brand<string, 'Timestamp'>;

// Re-export for convenience
export type {
    Nullable,
    Optional,
    Maybe,
    DeepPartial,
    DeepRequired,
    DeepReadonly,
    ValueOf,
    Entries,
    ArrayElement,
    AsyncReturnType,
    Await,
    Brand,
    TodoId,
    UserId,
    Timestamp,
};
