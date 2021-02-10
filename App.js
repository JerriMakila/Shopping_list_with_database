import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('shoppinglist.db');

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [list, setList] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS shoppinglist (id integer primary key not null, product text, amount text);');
    }, null, updateList);
  }, []);

  const addItem = () => {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO shoppinglist (product, amount) VALUES (?, ?);', [product, amount]);
    }, null, updateList);
    setProduct('');
    setAmount('');
  }

  const deleteItem = (id) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM shoppinglist WHERE id = ?;', [id]);
    }, null, updateList)
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM shoppinglist;', [], (_, {rows}) =>
        setList(rows._array));
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Product"
          onChangeText={item => setProduct(item)}
          value={product}>
        </TextInput>
        <TextInput
          style={styles.textInput}
          placeholder="Amount"
          onChangeText={amount => setAmount(amount)}
          value={amount}>
        </TextInput>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="ADD" onPress={addItem}></Button>
      </View>
      <View styles={styles.listContainer}>
        <Text style={{color:'blue', fontSize:20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center'}}>Shopping List</Text>
        <FlatList
          keyExtractor={item => item.id.toString()}
          data={list}
          renderItem={({item}) =>
            <View style={styles.listItem}>
              <Text style= {{fontSize: 20}}>{item.product}, {item.amount}</Text><Text style={{fontSize: 20, color: 'blue'}} onPress={() => deleteItem(item.id)}> Bought</Text>
            </View>
            }>
        </FlatList>
      </View>
      <StatusBar hidden={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 200
  },

  inputContainer: {
    marginBottom: 20
  },

  listContainer: {
    
  },

  listItem: {
    flexDirection: 'row',
    justifyContent: 'center'
  },

  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    fontSize: 20,
    paddingHorizontal: 5,
    width: 150
  }
});
