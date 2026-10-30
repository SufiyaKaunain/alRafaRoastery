import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function localUploadPlugin() {
  return {
    name: 'local-upload-plugin',
    configureServer(server) {
      server.middlewares.use('/api/upload-local', (req, res, next) => {
        if (req.method !== 'POST') return next();

        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
          try {
            const buffer = Buffer.concat(chunks);
            const contentType = req.headers['content-type'] || '';

            let ext = '.jpg';
            if (contentType.includes('image/png')) ext = '.png';
            else if (contentType.includes('image/webp')) ext = '.webp';
            else if (contentType.includes('image/svg')) ext = '.svg';
            else if (contentType.includes('image/gif')) ext = '.gif';

            let fileBuffer = buffer;
            if (contentType.includes('multipart/form-data')) {
              const boundary = contentType.split('boundary=')[1]?.trim();
              if (boundary) {
                const headerEnd = buffer.indexOf('\r\n\r\n');
                if (headerEnd !== -1) {
                  const headerStr = buffer.slice(0, headerEnd).toString();
                  const match = headerStr.match(/filename="([^"]+)"/);
                  if (match && path.extname(match[1])) {
                    ext = path.extname(match[1]).toLowerCase();
                  }
                  const footerStart = buffer.lastIndexOf(`\r\n--${boundary}`);
                  if (footerStart > headerEnd + 4) {
                    fileBuffer = buffer.slice(headerEnd + 4, footerStart);
                  } else {
                    fileBuffer = buffer.slice(headerEnd + 4);
                  }
                }
              }
            }

            const fileName = `product-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
            const rootDir = process.cwd();
            const targetDirs = [
              path.resolve(rootDir, 'public/assets/products'),
              path.resolve(rootDir, 'src/assets/products'),
              path.resolve(rootDir, '../frontend/public/assets/products'),
              path.resolve(rootDir, '../backend/wwwroot/assets/products'),
            ];

            for (const dir of targetDirs) {
              try {
                fs.mkdirSync(dir, { recursive: true });
                fs.writeFileSync(path.join(dir, fileName), fileBuffer);
              } catch {
                // ignore write error for optional dirs
              }
            }

            const url = `/assets/products/${fileName}`;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ url, fileName }));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), localUploadPlugin()],
  server: {
    port: 5174,
  }
});
