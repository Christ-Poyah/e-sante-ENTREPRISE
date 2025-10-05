/**
 * Données prédéfinies de patients pour E-SANTE v0.2.0
 * Remplace l'intégration Firestore par des données locales
 */

export const PREDEFINED_PATIENTS = [
  {
    id: "PAT001",
    cmuNumber: "CMU123456",
    firstName: "Jean",
    lastName: "Dupont",
    age: 45,
    dateOfBirth: "1979-03-15",
    gender: "M"
  },
  {
    id: "PAT002",
    cmuNumber: "CMU789012",
    firstName: "Marie",
    lastName: "Martin",
    age: 32,
    dateOfBirth: "1992-07-22",
    gender: "F"
  },
  {
    id: "PAT003",
    cmuNumber: "CMU345678",
    firstName: "Ahmed",
    lastName: "Kouassi",
    age: 28,
    dateOfBirth: "1996-11-08",
    gender: "M"
  },
  {
    id: "PAT004",
    cmuNumber: "CMU901234",
    firstName: "Fatou",
    lastName: "Traore",
    age: 56,
    dateOfBirth: "1968-05-30",
    gender: "F"
  },
  {
    id: "PAT005",
    cmuNumber: "CMU567890",
    firstName: "Pierre",
    lastName: "Leblanc",
    age: 41,
    dateOfBirth: "1983-09-14",
    gender: "M"
  }
];

/**
 * Recherche un patient par numéro CMU
 * @param {string} cmuNumber - Le numéro CMU du patient
 * @returns {Object|null} - Le patient trouvé ou null
 */
export const findPatientByCMU = (cmuNumber) => {
  return PREDEFINED_PATIENTS.find(
    patient => patient.cmuNumber === cmuNumber
  ) || null;
};

/**
 * Recherche un patient par ID
 * @param {string} id - L'ID du patient
 * @returns {Object|null} - Le patient trouvé ou null
 */
export const findPatientById = (id) => {
  return PREDEFINED_PATIENTS.find(
    patient => patient.id === id
  ) || null;
};
