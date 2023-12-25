/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'tailwindui.com'
            }
        ]
    }
}

module.exports = nextConfig
