import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { Button, FlatList, View, Text, SafeAreaView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import PeopleContext from "../PeopleContext";
import { MaterialIcons } from '@expo/vector-icons';
import { FAB } from 'react-native-paper'; 

export default function PeopleScreen() {
  const navigation = useNavigation();
  const { people } = useContext(PeopleContext);

  // Sort people by month and day of their birthdays
  const sortedPeople = [...people].sort((a, b) => {
    const [aMonth, aDay] = a.dob.split('-').slice(1).map(Number);
    const [bMonth, bDay] = b.dob.split('-').slice(1).map(Number);
    return aMonth === bMonth ? aDay - bDay : aMonth - bMonth;
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {sortedPeople.length === 0 ? (
          <Text>Please add a first person.</Text>
        ) : (
          <FlatList
            data={sortedPeople}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text>{item.name}</Text>
                  <Text>{new Date(item.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("IdeaScreen", { id: item.id })}>
                  <MaterialIcons name="lightbulb-outline" size={24} color="black" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => navigation.navigate("AddPerson")}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

// export default function PeopleScreen() {
//   const navigation = useNavigation();
  //   const people = [
  //     {
  //       id: "d825796c-4fc1-4879-ad86-048ece613581",
  //       name: "Tom",
  //       dob: "2001-01-09",
  //     },
  //     {
  //       id: "b825796d-4fc1-4879-ad86-048ece613582",
  //       name: "Megan",
  //       dob: "2001-02-28",
  //     },
  //     {
  //       id: "a825796e-4fc1-4879-ad86-048ece613583",
  //       name: "Conor",
  //       dob: "2001-04-28",
  //     },
  //   ];

//   const { people } = useContext(PeopleContext);

//   return (
//     <SafeAreaProvider>
//       <SafeAreaView>
//         <FlatList
//           data={people}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <View>
//               <Text>{item.name}</Text>
//               <Text>{item.dob}</Text>
//             </View>
//           )}
//         />
//         <Button
//           title="Add Person"
//           onPress={() => navigation.navigate("AddPerson")}
//         />
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// }