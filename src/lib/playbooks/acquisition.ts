/** Attribute only an initial library landing; never overwrite an external campaign. */
export function libraryLandingCampaign(pathname: string): string | null {
  if (pathname === "/playbooks" || pathname === "/playbooks/") return "library.index";
  const match = pathname.match(/^\/playbooks\/([a-z0-9-]+)\/?$/);
  return match ? `library.${match[1]}`.slice(0, 100) : null;
}
