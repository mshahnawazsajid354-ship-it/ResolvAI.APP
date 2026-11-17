import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from .env into process.env for local development
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      {
        name: 'api-evaluate-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const url = req.url || '';
            if (url === '/api/evaluate' || url.startsWith('/api/evaluate?')) {
              try {
                // Collect request body
                const chunks: Buffer[] = [];
                for await (const chunk of req) {
                  chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
                }
                const rawBody = Buffer.concat(chunks).toString('utf8');
                let parsedBody: any = {};
                if (rawBody) {
                  try {
                    parsedBody = JSON.parse(rawBody);
                  } catch {
                    parsedBody = {};
                  }
                }
                (req as any).body = parsedBody;

                let statusCode = 200;
                const mockRes = {
                  setHeader(name: string, value: string) {
                    res.setHeader(name, value);
                    return mockRes;
                  },
                  status(code: number) {
                    statusCode = code;
                    res.statusCode = code;
                    return mockRes;
                  },
                  json(data: any) {
                    res.statusCode = statusCode;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                    return mockRes;
                  },
                  end(data?: any) {
                    res.statusCode = statusCode;
                    res.end(data);
                    return mockRes;
                  },
                };

                // Load and run the serverless function directly via Vite SSR module loader
                const apiModule = await server.ssrLoadModule('/api/evaluate.ts');
                await apiModule.default(req, mockRes);
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  success: false,
                  error: 'DEV_MIDDLEWARE_ERROR',
                  message: 'Local server encountered an error processing evaluation.',
                }));
              }
            } else {
              next();
            }
          });
        },
      },
    ],
    server: {
      port: 3000,
      host: true,
    },
    preview: {
      port: 3000,
      host: true,
    },
  };
});
