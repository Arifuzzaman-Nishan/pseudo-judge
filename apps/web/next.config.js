/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'tailwindui.com'
            },
            {
                hostname: 's.gravatar.com'
            }
        ]
    },
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        return config;
    }

}

module.exports = nextConfig
