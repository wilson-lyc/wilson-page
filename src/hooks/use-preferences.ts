import { useEffect, useState } from "react"
import type { Locale } from "@/lib/i18n"

type Theme = "light" | "dark"

function readPreference(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function storePreference(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* Preferences still work in memory. */
  }
}

export function usePreferences() {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = readPreference("wilson.locale")
    return saved === "en" || saved === "zh"
      ? saved
      : navigator.language.startsWith("zh")
        ? "zh"
        : "en"
  })
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = readPreference("wilson.theme")
    return saved === "light" || saved === "dark"
      ? saved
      : matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
  })

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en"
    document.title =
      locale === "zh" ? "Wilson的主页" : "Wilson’s homepage"
    storePreference("wilson.locale", locale)
  }, [locale])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    document.documentElement.style.colorScheme = theme
    storePreference("wilson.theme", theme)
  }, [theme])

  return { locale, theme, setLocale, setTheme }
}
