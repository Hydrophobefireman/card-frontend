function buf2hex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
const encoder = new TextEncoder();
const cache: Record<string, string> = {};
export function emailToUserId(str: string) {
  str = str.toLowerCase();
  if (cache[str]) {
    return cache[str];
  }
  const enc = encoder.encode(str);
  return (cache[str] = buf2hex(enc));
}
