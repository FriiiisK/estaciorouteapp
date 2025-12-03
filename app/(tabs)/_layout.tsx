import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Importando o safearea para corrigir problema dos botões encima do navigation

export default function TabsLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}> 
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: true,
          header: () => <HeaderCustomizado />,

          tabBarShowLabel: false,
          tabBarActiveTintColor: '#000000ff',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            borderTopWidth: 1,
            backgroundColor: '#f7e709ff',
            paddingTop: 15,
            justifyContent: 'center',
            height: 70,
          },

          tabBarIcon: ({ color, size, focused }) => {
            let iconName: keyof typeof Ionicons.glyphMap;
            const IconSize = 35;

            switch (route.name) {
              case 'index':
                iconName = 'home';
                break;
              default:
                iconName = 'add-sharp';
            }

            return <Ionicons name={iconName} size={IconSize} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="index" options={{ title: 'Início' }} />
        <Tabs.Screen name="adicionar" options={{ title: 'Adicionar' }} />
      </Tabs>
    </SafeAreaView>
  );
}

function HeaderCustomizado() {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require('../../src/assets/logoroute.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({ // style mantendo a cor da route
  headerContainer: {
    height: 70,
    backgroundColor: '#f7e709ff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  logo: {
    width: 120,
    height: 40,
  },
});