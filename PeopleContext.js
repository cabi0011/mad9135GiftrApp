import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";

const PeopleContext = createContext();

export const PeopleProvider = ({ children }) => {
  const [people, setPeople] = useState([]);

  const STORAGE_KEY = "people";

  // Load people from AsyncStorage
  useEffect(() => {
    const loadPeople = async () => {
      const savedPeople = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedPeople) setPeople(JSON.parse(savedPeople));
    };
    loadPeople();
  }, []);

  const addPerson = async (name, dob) => {
    const newPerson = {
      id: randomUUID(),
      name,
      dob,
      ideas: [], // Initialize with an empty ideas array
    };
    const updatedPeople = [...people, newPerson];
    setPeople(updatedPeople);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
  };

  const addIdea = async (personId, idea) => {
    const updatedPeople = people.map((person) => {
      if (person.id === personId) {
        const newIdea = { id: randomUUID(), ...idea };
        return { ...person, ideas: [...person.ideas, newIdea] };
      }
      return person;
    });
    setPeople(updatedPeople);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
  };

  return (
    <PeopleContext.Provider value={{ people, addPerson, addIdea }}>
      {children}
    </PeopleContext.Provider>
  );
};

export default PeopleContext;