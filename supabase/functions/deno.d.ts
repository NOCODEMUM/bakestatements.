/// <reference lib="dom" />
/// <reference path="./types/shims.d.ts" />

// Minimal ambient Deno types for local Node/TS editors (env + serve only)
declare global {
    const Deno: {
        env: {
            get(key: string): string | undefined;
        };
        serve(handler: (req: Request) => Response | Promise<Response>): void;
    };
}

export { };
