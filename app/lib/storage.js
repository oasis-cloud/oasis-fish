// 数据存储工具，使用 localStorage

const STORAGE_KEY = "oasis-fish-pets";

export function getAllPets() {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function savePet(pet) {
  const pets = getAllPets();
  const newPet = {
    ...pet,
    id: pet.id || Date.now().toString(),
    createdAt: pet.createdAt || new Date().toISOString(),
  };
  pets.push(newPet);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
  return newPet;
}

export function getPetById(id) {
  const pets = getAllPets();
  return pets.find((pet) => pet.id === id);
}

export function updatePet(id, updates) {
  const pets = getAllPets();
  const index = pets.findIndex((pet) => pet.id === id);
  if (index === -1) return null;
  pets[index] = { ...pets[index], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
  return pets[index];
}

export function deletePet(id) {
  const pets = getAllPets();
  const filtered = pets.filter((pet) => pet.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}

