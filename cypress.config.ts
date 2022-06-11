import { defineConfig } from 'cypress';

export default defineConfig({
	videoUploadOnPasses: false,
	e2e: {
		baseUrl: 'http://localhost:1234',
	},
});
