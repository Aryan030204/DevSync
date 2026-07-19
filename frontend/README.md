# DevSync Frontend

## Local development

1. Copy `frontend/.env.example` to `frontend/.env`.
2. Set `VITE_API_URL=http://localhost:3000` for local backend development.
3. Run `npm install`.
4. Run `npm run dev --prefix frontend`.

## Production build

1. Copy `frontend/.env.example` to `frontend/.env.production`.
2. Set `VITE_API_URL` to your deployed backend origin, for example `https://api.example.com`.
3. Run `npm run build --prefix frontend`.
4. Deploy the generated `frontend/dist` folder to your frontend host.

## Notes

- The frontend expects the backend to allow credentials and your frontend origin through CORS.
- Chat uses Socket.IO on the same backend origin configured by `VITE_API_URL`.
