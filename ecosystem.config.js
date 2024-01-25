module.exports = {
	apps: [
		{
			namespace: "my-project",
			name: "web",
			script: "pnpm prod --port 3000",
			cwd: "./apps/web",
			watch: "."
		},
		{
			namespace: "my-project",
			name: "api",
			script: "pnpm prod --port 5000",
			cwd: "./apps/api",
			watch: "."
		}
	]

}