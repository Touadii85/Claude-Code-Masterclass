const ADJECTIVES = [
  "Swift",
  "Silent",
  "Shadow",
  "Bold",
  "Clever",
  "Daring",
  "Fierce",
  "Hidden",
  "Lucky",
  "Mighty",
  "Nimble",
  "Quiet",
  "Rapid",
  "Sly",
  "Sneaky",
  "Sharp",
  "Wild",
  "Brave",
  "Cunning",
  "Rogue",
]

const COLORS = [
  "Crimson",
  "Azure",
  "Violet",
  "Golden",
  "Silver",
  "Obsidian",
  "Emerald",
  "Amber",
  "Scarlet",
  "Indigo",
  "Ivory",
  "Onyx",
  "Ruby",
  "Sapphire",
  "Copper",
  "Jade",
  "Coral",
  "Charcoal",
  "Platinum",
  "Bronze",
]

const NOUNS = [
  "Falcon",
  "Fox",
  "Wolf",
  "Raven",
  "Tiger",
  "Viper",
  "Panther",
  "Hawk",
  "Owl",
  "Lynx",
  "Cobra",
  "Eagle",
  "Jaguar",
  "Puma",
  "Badger",
  "Falcon",
  "Heron",
  "Otter",
  "Wolverine",
  "Sparrow",
]

function pick(words: string[]): string {
  return words[Math.floor(Math.random() * words.length)]
}

export function generateCodename(): string {
  return `${pick(ADJECTIVES)}${pick(COLORS)}${pick(NOUNS)}`
}
