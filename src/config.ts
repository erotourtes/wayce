enum NODE_ENV {
  development = "development",
  production = "production",
}

const options: { [key: string]: string} = {
  NODE_ENV: NODE_ENV.development,
};

for (const key in options)
  process.env[key] = options[key];
