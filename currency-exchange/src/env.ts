export function requireEnv(name: string, defaultVal?: string): string {
  const envValue = process.env[name];

  if (!envValue) {
    if (defaultVal !== undefined) {
      return defaultVal;
    }

    throw new Error(`Required env #${name}# not set`);
  }

  return envValue;
}
