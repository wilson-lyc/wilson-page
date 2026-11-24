// Discourage basic email scrapers by decoding only on interaction.
// This is obfuscation, not encryption: browser code remains public.
export function openContactEmail() {
  const recipient = atob("bWVAdW1seWMuY29t")
  window.location.href = `mailto:${recipient}`
}
