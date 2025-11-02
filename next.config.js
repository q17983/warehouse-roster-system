/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable telemetry to avoid build cache issues on Railway
  telemetry: {
    enabled: false,
  },
  // Ensure consistent output for Railway
  output: 'standalone',
}

module.exports = nextConfig
