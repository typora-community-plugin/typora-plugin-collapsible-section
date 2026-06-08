/**
 * Expand brace expressions like {a,b,c} into multiple patterns.
 * Only handles top-level braces (no nesting).
 */
function expandBraces(pattern: string): string[] {
  const depth = findTopLevelBrace(pattern)
  if (depth === -1) return [pattern]

  let end = depth + 1, d = 1
  while (end < pattern.length && d > 0) {
    if (pattern[end] === '{') d++
    else if (pattern[end] === '}') d--
    end++
  }

  const before = pattern.slice(0, depth)
  const inner = pattern.slice(depth + 1, end - 1)
  const after = pattern.slice(end)

  // Split by comma at top level (not inside nested braces or brackets)
  const alternatives = splitTopLevelCommas(inner)
  const results: string[] = []

  for (const alt of alternatives) {
    const mid = before + alt.trim() + after
    results.push(...expandBraces(mid))
  }
  return results
}

/** Find index of top-level `{`, skip `[...]` blocks. Returns -1 if none. */
function findTopLevelBrace(s: string): number {
  let inBracket = false
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c === '[') inBracket = true
    else if (c === ']') inBracket = false
    else if (!inBracket && c === '{') return i
  }
  return -1
}

/** Split string by commas at top level, respecting nested braces and brackets. */
function splitTopLevelCommas(s: string): string[] {
  const parts: string[] = []
  let depth = 0, start = 0
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c === '[' || c === '{') depth++
    else if (c === ']' || c === '}') depth--
    else if (depth === 0 && c === ',') {
      parts.push(s.slice(start, i))
      start = i + 1
    }
  }
  parts.push(s.slice(start))
  return parts
}

/**
 * Convert a simple glob expression to a RegExp.
 * Supports: *, **, ?, [chars], # comments (stripped).
 */
function globToRegExp(pattern: string): RegExp {
  let i = 0, n = pattern.length
  let re = ''

  // Handle leading **/ -> zero or more directory prefixes
  if (pattern.startsWith('**/')) {
    const rest = pattern.slice(3)
    const restRe = globToRegExp(rest).source.slice(1, -1) // strip ^ and $
    return new RegExp(`^(?:.*/${restRe}|${restRe})$`)
  }

  while (i < n) {
    const c = pattern[i]

    switch (c) {
      case '#':
        // Rest is a comment - stop processing
        break

      case '*':
        if (i + 1 < n && pattern[i + 1] === '*') {
          // ** - match everything including /
          i += 2
          if (i < n && pattern[i] === '/') {
            i++ // skip trailing slash after **
            re += '(?:[^/]*\\/)*'
          } else {
            re += '.*'
          }
        } else {
          // * - match anything except /
          re += '[^/]*'
          i++
        }
        break

      case '?':
        re += '[^/]'
        i++
        break

      case '[': {
        let cls = ''
        i++
        while (i < n && pattern[i] !== ']') {
          const cc = pattern[i]
          // Escape backslash, caret inside class
          if (cc === '\\' || cc === '^' || cc === '-') re += '\\';
          cls += cc
          i++
        }
        if (i < n) i++ // skip ]
        re += '[' + cls + ']'
        break
      }

      default:
        if ('.^$*?+{}()|\\[]'.includes(c)) re += '\\' + c
        else re += c
        i++
    }
  }

  return new RegExp('^' + re + '$')
}

/**
 * Check if a file path matches any of the given glob patterns.
 * @param filePath - The file path to check (relative or absolute)
 * @param patterns - Comma-separated glob expressions (empty string means match all)
 * @returns true if pattern is empty or the file path matches at least one pattern
 */
export function matchesGlob(filePath: string, patterns: string): boolean {
  const trimmed = patterns.trim()
  if (!trimmed) return true

  // Normalize to forward slashes (glob matching works with posix-style paths)
  const normalizedPath = filePath.replace(/\\/g, '/')

  // Split by top-level commas only (skip those inside {} or [])
  const parts = splitTopLevelCommas(trimmed)
    .map(p => p.trim())
    .filter(Boolean)

  if (parts.length === 0) return true

  for (const pattern of parts) {
    try {
      const expanded = expandBraces(pattern)
      for (const expPattern of expanded) {
        const re = globToRegExp(expPattern)
        if (re.test(normalizedPath)) return true
      }
    } catch {
      // Invalid glob pattern - skip it
    }
  }

  return false
}
