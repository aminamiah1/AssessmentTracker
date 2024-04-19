export function isProformaLink(link: string): boolean {
  const pattern =
    /^https:\/\/cf\.sharepoint\.com\/:b:\/r\/teams\/ProformaFiles\/Shared%20Documents\/General\/(?:.+\/)*[\w\d%]+(?:\.pdf|\.doc|\.docx)/;
  return pattern.test(link);
}

/**
 * Removes the query params from a URL.
 * @param link the URL containing query params.
 * @returns the URL with query params removed.
 */
export function removeAllQueryParams(link: string): string {
  const url = new URL(link);
  url.search = "";
  return url.toString();
}

/**
 * Will add query parameters to the end of a URL string.
 * @param link the base URL.
 * @param params an array of objects that correspond to the key-value pairs in the
 * query params of the URL.
 * @returns the new URL string with attached query params.
 *
 * @example addQueryParams("localhost:3000", [{ key: "w", value: "12" }])
 * -> "localhost:3000?w=12"
 */
export function addQueryParams(
  link: string,
  params: { key: string; value: string }[],
) {
  const url = new URL(link);

  params.forEach((param) => {
    url.searchParams.append(param.key, param.value);
  });

  return url.toString();
}
