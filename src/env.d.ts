interface ImportMetaEnv {
    readonly VITE_SERVER_URL: string;
    readonly VITE_DEBUG_LEVEL: 'debug' | 'off';
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}