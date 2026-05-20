# Dual-Calendar System

## Overview

The Ethiopian Heritage Portal features a precision-engineered **Dual-Calendar Engine** that seamlessly synchronizes the Gregorian (Western) calendar with the **Ethiopian Ge'ez Calendar** — one of the oldest calendar systems still in active use today.

## The Ethiopian Calendar

| Property | Detail |
|---|---|
| **Structure** | 13 months total |
| **Regular Months** | 12 months × 30 days each = 360 days |
| **13th Month (Pagumē)** | 5 days (6 in Ethiopian leap years) |
| **Year Difference** | Ethiopia is ~7–8 years behind the Gregorian calendar |
| **New Year (Enkutatash)** | September 11 (or 12 in leap years) |
| **Religious Basis** | Coptic Orthodox Christian tradition |

## Conversion Algorithm

The conversion uses the **Julian Day Number (JDN)** algorithm — a universal, zero-offset method for date conversion that eliminates all rounding and drift errors.

```
Gregorian Date → JDN → Ethiopian Date
Ethiopian Date → JDN → Gregorian Date
```

This ensures perfect accuracy across all historical dates, from ancient kingdom records to modern public holidays.

## Calendar Features

- **Synchronized View:** Both calendars rendered side-by-side in real-time
- **Cultural Events:** Religious, public, and seasonal holidays mapped on both timelines
- **Navigation:** Month-by-month browsing with instant conversion
- **Event Highlighting:** Color-coded categories (Religious 🟡, Cultural 🟢, Public 🔵)
- **Private Vault:** Users can save personal reminders tied to Ethiopian dates
- **13th Month Support:** Pagumē correctly displayed with its 5 or 6 days

## Why It Matters

The Ethiopian calendar is deeply embedded in daily life — bank holidays, religious fasts, harvest seasons, and national celebrations all follow it. This calendar engine makes that world accessible and navigable to anyone globally.

---

*Built by Gemachis Tesfaye — All Rights Reserved © 2026*
