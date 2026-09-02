import {
  generateProtectedResourceMetadata,
  getPublicOrigin,
  metadataCorsOptionsRequestHandler,
} from "mcp-handler";

export function GET(req: Request) {
  const origin = getPublicOrigin(req);
  return Response.json(
    generateProtectedResourceMetadata({
      authServerUrls: [origin],
      resourceUrl: `${origin}/api/mcp`,
    }),
  );
}

export const OPTIONS = metadataCorsOptionsRequestHandler();
