export type ChildProfile = { id: string; nickname: string; age: string };
export type LocalProfile = { name: string; location: string; bio: string; children: ChildProfile[] };
export const profileKey = "tiny-treasures-profile-v1";
export const defaultProfile: LocalProfile = {
  name: "Aisha", location: "Tampere, Finland", bio: "Giving little treasures a second happy home.",
  children: [{ id: "child-1", nickname: "Little one", age: "1 year" }, { id: "child-2", nickname: "Big little one", age: "3 years" }],
};

export function parseProfile(raw: string | null): LocalProfile {
  if (!raw) return defaultProfile;
  try {
    const value = JSON.parse(raw);
    if (!value || !["name", "location", "bio"].every(field => typeof value[field] === "string") ||
      !value.name.trim() || value.name.length > 60 || value.location.length > 80 || value.bio.length > 200 ||
      !Array.isArray(value.children) || value.children.length > 5 ||
      !value.children.every((child: ChildProfile) => child && typeof child.id === "string" && typeof child.nickname === "string" && child.nickname.trim() && child.nickname.length <= 40 && typeof child.age === "string" && child.age.length <= 30)) return defaultProfile;
    return value;
  } catch { return defaultProfile; }
}
