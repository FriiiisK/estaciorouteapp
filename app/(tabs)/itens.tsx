import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Adicionar() {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');

  async function adicionarItem() {
    if (!nome.trim() || !quantidade.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const novoItem = {
      nome,
      quantidade: parseInt(quantidade),
    };

    try {
      const armazenado = await AsyncStorage.getItem('@itens');
      const listaAtual = armazenado ? JSON.parse(armazenado) : [];
      listaAtual.push(novoItem);
      await AsyncStorage.setItem('@itens', JSON.stringify(listaAtual));
      setNome('');
      setQuantidade('');
      Keyboard.dismiss();
      Alert.alert('Sucesso', 'Item adicionado');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o item');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Adicionar novo item ao estoque</Text>

      <TextInput
        placeholder="Nome do item"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholderTextColor="#888"
      />

      <TextInput
        placeholder="Quantidade"
        style={styles.input}
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.button} onPress={adicionarItem}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
}

//  style mantendo a cor da route
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffde7', 
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    backgroundColor: '#f7e709ff', 
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '90%',
    height: 50,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  button: {
    backgroundColor: '#f7e709ff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
