import { useEffect, useState } from "react"
import type { Locale } from "@/lib/i18n"

type Theme = "light" | "dark"

export function usePreferences() {
  const [locale, setLocale] = useState<Locale>("en")
  const [systemTheme, setSystemTheme] = useState<Theme>(() =>
    matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  )
  const [themeOverride, setTheme] = useState<Theme | null>(null)
  const theme = themeOverride ?? systemTheme

  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)")
    const syncTheme = () => setSystemTheme(media.matches ? "dark" : "light")
    syncTheme()
    media.addEventListener("change", syncTheme)
    return () => media.removeEventListener("change", syncTheme)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en"
    document.title =
      locale === "zh" ? "Yongchao 的主页" : "Yongchao’s page"
  }, [locale])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    document.documentElement.style.colorScheme = theme
  }, [theme])

  return { locale, theme, setLocale, setTheme }
}
