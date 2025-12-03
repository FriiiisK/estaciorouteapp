import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Item = {
  nome: string;
  quantidade: number;
};

export default function Index() {
  const [items, setItems] = useState<Item[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantidadeEditada, setQuantidadeEditada] = useState('');
  const [itemEditIndex, setItemEditIndex] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function loadItems() {
        try {
          const stored = await AsyncStorage.getItem('@itens');
          if (stored) {
            setItems(JSON.parse(stored));
          } else {
            setItems([]);
          }
        } catch (error) {
          console.log('Erro ao carregar itens:', error);
        }
      }
      loadItems();
    }, [])
  );

  function deletarItem(index: number) {
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja excluir este item?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancelado'),
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => {
            const novaLista = [...items];
            novaLista.splice(index, 1);
            setItems(novaLista);
            AsyncStorage.setItem('@itens', JSON.stringify(novaLista));
          },
        },
      ],
      { cancelable: true }
    );
  }

  function abrirModalEditar(index: number) {
    setItemEditIndex(index);
    setQuantidadeEditada('');
    setModalVisible(true);
  }

  async function alterarQuantidade(tipo: 'adicionar' | 'remover') {
    if (!quantidadeEditada.trim() || isNaN(Number(quantidadeEditada))) {
      alert('Digite uma quantidade válida');
      return;
    }
    if (itemEditIndex === null) return;

    const valor = Number(quantidadeEditada);
    const novaLista = [...items];
    const atual = novaLista[itemEditIndex].quantidade;

    let novaQuantidade = tipo === 'adicionar' ? atual + valor : atual - valor;
    if (novaQuantidade < 0) novaQuantidade = 0;

    novaLista[itemEditIndex].quantidade = novaQuantidade;

    setItems(novaLista);
    await AsyncStorage.setItem('@itens', JSON.stringify(novaLista));

    setModalVisible(false);
    setItemEditIndex(null);
    setQuantidadeEditada('');
  }

  function renderItem({ item, index }: { item: Item; index: number }) {
    return (
      <View style={styles.itemBox}>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemText}>
            <Text style={styles.itemLabel}>Item: </Text>
            {item.nome}
          </Text>
          <Text style={styles.itemText}>
            <Text style={styles.itemLabel}>Quantidade: </Text>
            {item.quantidade}
          </Text>
        </View>
        <View style={styles.direitaBox}>
          <TouchableOpacity onPress={() => abrirModalEditar(index)} style={styles.iconButton}>
            <Ionicons name="pencil" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deletarItem(index)} style={styles.iconButton}>
            <Ionicons name="trash" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Quantidade</Text>
            <TextInput
              style={styles.modalInput}
              value={quantidadeEditada}
              onChangeText={setQuantidadeEditada}
              keyboardType="numeric"
              autoFocus
              placeholder="Digite a quantidade"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#008000' }]}
                onPress={() => alterarQuantidade('adicionar')}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Adicionar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#800000' }]}
                onPress={() => alterarQuantidade('remover')}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffde7',
    padding: 20,
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  itemBox: {
    backgroundColor: '#f7e709ff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  itemTextContainer: {
    flex: 1,
    marginRight: 15, // Para não encostar nos ícones
  },
  itemLabel: {
    fontSize: 14,
    color: '#000000cc',
    fontWeight: '600',
  },
  itemText: {
    fontSize: 16,
    color: '#000000ff',
    marginBottom: 5,
  },
  direitaBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 10,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#f7e709ff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
    color: '#000000ff',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#000000aa',
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#000000ff',
    backgroundColor: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    minWidth: 90,
  },
  modalButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
});
