export const extractEmailFromString = (
  emailStr: string | null
): string | null => {
  // regex that matches email addresses
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/
  const matches = emailStr?.match(emailRegex)
  if (matches) {
    emailStr = matches[0]
  }
  return emailStr
}

export const getTextBeforeEmail = (str: string): string | null => {
  // if the string is "Paula Clark <paula.clark@gmail>", return "Paula Clark"
  const regex = /(.*?)\s[<]?[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[>]*/g
  const match = regex.exec(str)
  return match ? match[1].trim() : null
}
