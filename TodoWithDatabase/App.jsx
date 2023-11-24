import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput
} from 'react-native';

import Realm from "realm";
import { createRealmContext } from '@realm/react';

class ToDo extends Realm.Object {
  static schema = {
    name: 'ToDo',
    properties: {
      _id: "objectId",
      text: 'string',
    },
    primaryKey: '_id',
  };
}

const realmConfig = {
  schema: [ToDo],
};

const { RealmProvider, useRealm } = createRealmContext(realmConfig);

function AppWrapper() {
  return (
    <RealmProvider>
      <ToDoList />
    </RealmProvider>
  );
}

function Banner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>ToDo example with React Native</Text>
    </View>
  );
}

function ToDoList() {
  const [realm, setRealm] = useState(null);
  const [itemText, setItemText] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const initializeRealm = async () => {
      const openedRealm = await Realm.open(realmConfig);
      setRealm(openedRealm);
    };

    initializeRealm();

    return () => {
      if (realm) {
        realm.close();
      }
    };
  }, []);

  useEffect(() => {
    if (realm) {
      const todoObjects = realm.objects("ToDo");
      setTodos(todoObjects);
    }
  }, [realm]);

  const addTodo = (text) => {
    if (realm) {
      realm.write(() => {
        realm.create('ToDo', {
          _id: new Realm.BSON.ObjectID(),
          text: text,
        });
      });
      setItemText("");
      const updatedTodos = realm.objects("ToDo")
      setTodos([...updatedTodos])
    }
  };

  const deleteTodo = (todo) => {
    if (realm) {
      realm.write(() => {
        realm.delete(todo);
      });
      const updatedTodos = realm.objects("ToDo")
      setTodos([...updatedTodos])
    }
  };

  return (
    <View>
      <View style={styles.addToDo}>
        <TextInput
          style={styles.addToDoTextInput}
          onChangeText={(text) => setItemText(text)}
          placeholder="Write a new todo here"
          value={itemText}
        />
        <Pressable style={styles.addTodoButton} onPress={() => addTodo(itemText)}>
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </View>
      <ScrollView style={styles.list}>
        {todos.map((todo) => (
          <View key={todo._id} style={styles.listItem}>
            <Text style={styles.listItemText}>● {todo.text}</Text>
            <Pressable onPress={() => deleteTodo(todo)}>
              <Text style={styles.listItemDelete}>X</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <Banner />
      <AppWrapper />
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    margin: 5
  }, 
  banner: {
    backgroundColor: 'black',
    justifyContent: 'center',
    marginBottom: 20
  },
  bannerText: {
    color: 'white',
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 20
  },
  addToDo: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  addToDoTextInput : {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ccc',
    padding: 5,
    margin: 2,
    flex: 1,
  },
  list: {
    color: 'black',
    margin: 2,
  },
  listItem: {
    flex: 1, 
    flexDirection: 'row',
    margin: 5
  },
  listItemText: {
  },
  listItemDelete: {
    marginStart: 10,
    color: 'red',
    fontWeight: 'bold',
    padding: 3,
    paddingTop: 0.5,
  },
  addTodoButton: {
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 0,
  },
  buttonText: {
    color: "white"
  }
});

