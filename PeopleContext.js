import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";

const PeopleContext = createContext();

export const PeopleProvider = ({ children }) => {
  const [people, setPeople] = useState([]);
  const STORAGE_KEY = "people";
  
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
      ideas: [], 
    };
    const updatedPeople = [...people, newPerson];
    updatedPeople.sort((a,b) => new Date(a.dob) - new Date(b.dob))
    setPeople(updatedPeople);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
  };

  const removePerson = async (personId) => {
    const updatedPeople = people.filter((person) => person.id !== personId)
    setPeople(updatedPeople);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
  }

  const addIdea = async (personId, idea) => {
    const person = people.find((person) => person.id === personId);
    if (!person) {
      console.error("Person not found");
      return;
    }
    const newIdea = { id: randomUUID(), ...idea };
    const updatedPerson = {
      ...person,
      ideas: [...(person.ideas || []), newIdea], 
    };
    const updatedPeople = people.map((person) =>
      person.id === personId ? updatedPerson : person
    );
    setPeople(updatedPeople);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
  };

  const removeIdea = async (personId, ideaId) => {
    const person = people.find((person) => person.id === personId);
    if (!person) {
      console.error("Person not found");
      return;
    }
    const updatedPerson = {
      ...person,
      ideas: person.ideas.filter((idea) => idea.id !== ideaId),
    };
    const updatedPeople = people.map((person) =>
      person.id === personId ? updatedPerson : person
    );
    setPeople(updatedPeople);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
  }

  return (
    <PeopleContext.Provider value={{ people, setPeople, addPerson, addIdea, removePerson, removeIdea }}>
      {children}
    </PeopleContext.Provider>
  );
};

export default PeopleContext;