export function randomTimeKey(): string {
  const random = Math.floor(Date.now() + Math.random()).toString();

  return random.substr(random.length - 6);
}
