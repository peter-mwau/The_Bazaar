const runtimeEnv =
    typeof window !== "undefined" && window.__BAZAAR_ENV__
        ? window.__BAZAAR_ENV__
        : {};

export const getEnv = (key) => {
    const runtimeValue = runtimeEnv[key];
    if (runtimeValue !== undefined && runtimeValue !== null && runtimeValue !== "") {
        return runtimeValue;
    }

    return import.meta.env[key];
};
