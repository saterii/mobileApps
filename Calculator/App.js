import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Pressable } from 'react-native';
import React, { useState } from 'react';

export default function App() {
  const clearFields = () => {
    setResult()
    setNumber1()
    setNumber2()
  }

  const calcSum = (num1, num2) => {
    num1 = parseInt(num1)
    num2 = parseInt(num2)
    let sum = (num1 + num2).toString()
    setResult(sum)
  }

  const calcSub = (num1, num2) => {
    num1 = parseInt(num1)
    num2 = parseInt(num2)
    let sub = (num1 - num2).toString()
    setResult(sub)
  }

  const calcMul = (num1, num2) => {
    num1 = parseInt(num1)
    num2 = parseInt(num2)
    let mul = (num1 * num2).toString()
    setResult(mul)
  }

  const calcDiv = (num1, num2) => {
    num1 = parseInt(num1)
    num2 = parseInt(num2)
    let div = (num1 / num2).toString()
    setResult(div)
  }  
  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [result, setResult] = useState('0');

  return (
    <View style={styles.container}>
      <Text style={styles.calculator}>Calculator</Text>
      <View style={styles.row}>
        <View style={styles.text}>
          <Text>Number 1:</Text>
        </View>
        <View style={styles.textInput}>
          <TextInput value={number1} 
            onChangeText={text => setNumber1(text)} 
            style={{textAlign:'right'}} 
            keyboardType={'numeric'}>
          </TextInput>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.text}>
          <Text>Number 2:</Text>
        </View>
        <View style={styles.textInput}>
        <TextInput
          value={number2} 
          onChangeText={text => setNumber2(text)} 
          style={{textAlign:'right'}} 
          keyboardType={'numeric'}>
        </TextInput>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={styles.button} onPress={()=> calcSum(number1, number2)}><Text style={styles.text1}>+</Text></Pressable>
        <Pressable style={styles.button} onPress={()=>calcSub(number1, number2)}><Text style={styles.text1}>-</Text></Pressable>
        <Pressable style={styles.button} onPress={()=>calcMul(number1, number2)}><Text style={styles.text1}>*</Text></Pressable>
        <Pressable style={styles.button} onPress={()=>calcDiv(number1, number2)}><Text style={styles.text1}>/</Text></Pressable>
      </View>

      <View style={styles.row}>
        <View style={styles.text}>
          <Text>Result:</Text>
        </View>
        
        <View style={styles.textInput}>
          <TextInput 
            placeholder="0" 
            value={result} 
            style={{textAlign:'right', color:'black'}} 
            editable={false}>
          </TextInput>
        </View>
        
      </View>
      <View style={styles.clear}>
        <Pressable style={styles.button} onPress={clearFields}><Text style={styles.text1}>CLEAR</Text></Pressable>
        </View>
      <StatusBar style="auto" />

  </View>
    
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculator: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 20
  },
  row: {
    flexDirection: 'row',
    marginTop: 5
  },
  text: {
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 5,
    width:100,
  },
  textInput: {
    justifyContent: 'center',
    padding: 5,
    borderWidth: 1.0,
    width: 100,
    marginLeft: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'space-around',
    width: 220
  },
  clear: {
    marginTop: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 13.5,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    margin: 20,
    borderRadius: 30,
  },
  text1: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});
