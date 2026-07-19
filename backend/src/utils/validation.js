const validator = require("validator");

const allowedProfileFields = [
  "firstName",
  "lastName",
  "about",
  "age",
  "gender",
  "skills",
  "photoUrl",
];

const normalizeSkills = (skills) => {
  if (Array.isArray(skills)) {
    return skills.map((skill) => String(skill).trim()).filter(Boolean);
  }

  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeGender = (gender) => {
  if (!gender) {
    return undefined;
  }

  const normalizedGender = String(gender).trim().toLowerCase();
  if (normalizedGender === "other") {
    return "others";
  }

  return normalizedGender;
};

const normalizeUserPayload = (payload) => {
  const normalizedPayload = { ...payload };

  if ("skills" in normalizedPayload) {
    normalizedPayload.skills = normalizeSkills(normalizedPayload.skills);
  }

  if ("gender" in normalizedPayload) {
    normalizedPayload.gender = normalizeGender(normalizedPayload.gender);
  }

  if ("age" in normalizedPayload && normalizedPayload.age !== "") {
    normalizedPayload.age = Number(normalizedPayload.age);
  }

  if ("photoUrl" in normalizedPayload && typeof normalizedPayload.photoUrl === "string") {
    normalizedPayload.photoUrl = normalizedPayload.photoUrl.trim();
  }

  if ("about" in normalizedPayload && typeof normalizedPayload.about === "string") {
    normalizedPayload.about = normalizedPayload.about.trim();
  }

  if ("firstName" in normalizedPayload && typeof normalizedPayload.firstName === "string") {
    normalizedPayload.firstName = normalizedPayload.firstName.trim();
  }

  if ("lastName" in normalizedPayload && typeof normalizedPayload.lastName === "string") {
    normalizedPayload.lastName = normalizedPayload.lastName.trim();
  }

  if ("emailId" in normalizedPayload && typeof normalizedPayload.emailId === "string") {
    normalizedPayload.emailId = normalizedPayload.emailId.trim().toLowerCase();
  }

  return normalizedPayload;
};

const validate = (payload) => {
  const { firstName, lastName, emailId, password, skills } =
    normalizeUserPayload(payload);

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  }

  if (!validator.isEmail(emailId || "")) {
    throw new Error("Email is not valid");
  }

  if (!validator.isStrongPassword(password || "")) {
    throw new Error("Enter a stronger password");
  }

  if (skills.length === 0) {
    throw new Error("Add at least one skill");
  }
};

const validateProfileData = (payload) =>
  Object.keys(payload).every((field) => allowedProfileFields.includes(field));

module.exports = {
  normalizeGender,
  normalizeSkills,
  normalizeUserPayload,
  validate,
  validateProfileData,
};
