/** Rewrites bookmarked `/adm/*` paths to the canonical `/gestor/*` URLs. */
export function remapAdmPath(pathname: string): string {
  if (pathname === "/adm/admprojetos" || pathname.startsWith("/adm/admprojetos/")) {
    return pathname.replace("/adm/admprojetos", "/gestor/projetos")
  }
  if (
    pathname === "/adm/monitoring/AdmCertificates" ||
    pathname.startsWith("/adm/monitoring/AdmCertificates/")
  ) {
    return pathname.replace("/adm/monitoring/AdmCertificates", "/gestor/monitoring/certificates")
  }
  if (pathname === "/adm" || pathname.startsWith("/adm/")) {
    return `/gestor${pathname.slice("/adm".length)}`
  }
  return pathname
}
