export function getInfoHashFromMagnet(magnetURI: string): string | null {
  // Ищем btih (BitTorrent Info Hash) в magnet-ссылке
  const match = magnetURI.match(/btih:([a-fA-F0-9]+)/i)

  if (match && match[1]) {
    // Приводим к верхнему регистру для консистентности
    return match[1].toUpperCase()
  }

  return null
}
