export function isProformaLink(link: string): boolean {
  const pattern =
    /^https:\/\/cf\.sharepoint\.com\/:b:\/r\/teams\/ProformaFiles\/Shared%20Documents\/General\/(?:.+\/)*[\w\d%]+(?:\.pdf|\.doc|\.docx)/;
  return pattern.test(link);
}

export function removeQueryParams(link: string): string {
  const url = new URL(link);
  url.search = "";
  return url.toString();
}
