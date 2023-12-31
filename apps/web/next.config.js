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
    }
}

module.exports = nextConfig
