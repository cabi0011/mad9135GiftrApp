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
    console.log("addIdea called with personId:", personId, "and idea:", idea); // Log function call

    const person = people.find((person) => person.id === personId);
    if (!person) {
      console.error("Person not found");
      return;
    }
    const newIdea = { id: randomUUID(), ...idea };
    const updatedPerson = {
      ...person,
      ideas: [...(person.ideas || []), newIdea], // Correctly spread the ideas array
    };
    const updatedPeople = people.map((person) =>
      person.id === personId ? updatedPerson : person
    );
    setPeople(updatedPeople);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
  };

  const removeIdea = async (personId, ideaId) => {
    console.log("removeIdea called with personId:", personId, "and ideaId:", ideaId); // Log function call

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
  

  // const addIdea = async (personId, idea) => {
  //   try{

  //     // console.log("addIdea called with personId:", personId, "and idea:");
      
  //     const person = people.find((person) => person.id === personId);
  //     console.log(person, "This is a person");
      
  //     const updatedPerson = {
  //       ...person,
  //       ideas: [...(person.ideas || [], idea)],
  //     };
      
      // console.log(updatedPerson, "Checkpoint 2");
      
      // const updatedPeople = people.map((person) => person.id === personId ? updatedPerson : person)
      // console.log(updatedPeople, "Checkpoint 3");
      // const updatedPeople = people.map((person) => {
        //   if (person.id === personId) {
          //     const newIdea = { id: randomUUID(), ...idea };
          //     // console.log("Adding new idea:", newIdea, "to person:", person.name); // Log new idea and person
          //     return { ...person, ideas: [...person.ideas, newIdea] };
          //   }
          //   return person;
          // });
          // console.log("Updated people array:", updatedPeople); // Log updated people array
        //   setPeople(updatedPeople);
        //   await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
        // } catch(err){
        //   console.log("ErrorUpdatingGift",err)
        // }
    // console.log("People saved to AsyncStorage"); // Log save to AsyncStorage
  // };



  return (
    <PeopleContext.Provider value={{ people, setPeople, addPerson, addIdea, removePerson, removeIdea }}>
      {children}
    </PeopleContext.Provider>
  );
};

export default PeopleContext;