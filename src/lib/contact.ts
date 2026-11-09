// Discourage basic email scrapers by decoding only on interaction.
// This is obfuscation, not encryption: browser code remains public.
export function openContactEmail() {
  const recipient = atob("d2lsc29uX2x5Y0Bmb3htYWlsLmNvbQ==")
  window.location.href = `mailto:${recipient}`
}
