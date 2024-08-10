const adjectives: string[] = [
  "Brave", "Mighty", "Cunning", "Swift", "Fierce", "Valiant", "Noble", "Bold",
  "Wise", "Loyal", "Fearless", "Gentle", "Gallant", "Steadfast", "Daring",
  "Heroic", "Radiant", "Majestic", "Savage", "Resolute", "Stalwart", "Unyielding",
  "Tenacious", "Vigilant", "Epic", "Harmonious", "Invincible", "Merciless"
];

const nouns: string[] = [
  "Tiger", "Phoenix", "Dragon", "Falcon", "Knight", "Wizard", "Samurai", "Ninja",
  "Pirate", "Viking", "Ranger", "Guardian", "Warrior", "Scholar", "Mystic",
  "Explorer", "Hunter", "Seeker", "Rogue", "Paladin", "Druid", "Sage", "Champion",
  "Scribe", "Monk", "Bard", "Hermit", "Alchemist", "Adventurer", "Protector"
];

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export default function getNickname() {
  const adjectiveIndex = getRandomInt(adjectives.length);
  const nounIndex = getRandomInt(nouns.length);
  const randomNumber = getRandomInt(9999);
  return `${adjectives[adjectiveIndex]}_${nouns[nounIndex]}_${randomNumber}`;
}