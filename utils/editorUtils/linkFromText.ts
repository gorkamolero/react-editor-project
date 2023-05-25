export default function linkFromText(text: string) {
  const match = String(text).match(/status\/(\d+)/)?.[1]
  return match
}
