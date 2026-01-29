import React, { use, useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  FlatList
} from 'react-native';
;

const App = () => {

  const [selectedCategory, setSelectedCategory] = useState('Tops');
  const [clothingItems, setClothingItems]=useState([])


  const categories = [{'id':1,'name': 'Tops', 'icon': '👕'},
    {'id':2, 'name': 'Shirts', 'icon':'👔'},
  {'id':3, 'name': 'Pants', 'icon': '👖'}, 
  {'id':4, 'name': 'Shoes', 'icon': '👟'}, 
   ];

   const DEMO_DATA = [
  { id: '1', title:'Cotton T-Shirt', color: 'White', colorCode: '#FFFFFF', size: 'M' },
  { id: '2', title:'V-Neck Top', color: 'Black', colorCode: '#000000', size: 'S' },
  { id: '3', title:'Sweater', color: 'Gray', colorCode: '#9CA3AF', size: 'L' },
  { id: '4', title:'Blue Tank Top', color: 'Navy', colorCode: '#1e3a8a', size: 'M' },
];
  // const 

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <View>
        <Text style={{ fontSize: 25, fontWeight: 'bold'}}>My WardRobe</Text>
      </View>
      <View>
        <Text>Organize your collection</Text>
      </View>
      </View>

    <View>
      <FlatList
      data={categories}
      horizontal
    justifyContent='center'
      renderItem={({item})=>(
        <View>
          <View  style={styles.categories}>
          <TouchableOpacity>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text>
            {item.icon}
            </Text>
            <Text>
            {item.name}
            </Text>
            </View>
            </TouchableOpacity>
        </View>
        </View>
      )}
            showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />

</View>

<View style={styles.ClothGrid}>
  <FlatList
  data={DEMO_DATA}
  keyExtractor={(item) => item.id}
  numColumns={2}
  renderItem={({item})=>(
    
    <View style={styles.Grid}>
    <View>
      <Text>
      {item.title} 
      </Text>
      <Text>
      {item.color} 
      </Text>
      <Text>
      {item.size} 
      </Text>
      </View>
      </View>
    
  )}
  
  
  
  />
</View>
    



    </View>
  );
};

const styles = StyleSheet.create({

  container:{
    padding:10
// flex:1
  },

  header:{
    margin: 10 
  },
categories:{

// flexDirection:'row',
margin:10,
backgroundColor:'#F8ECDD',
height:40,
width:70,
justifyContent:'center',
alignItems:'center',
borderRadius:10

},
ClothGrid:{
marginTop:20,
justifyContent:'space-between',
backgroundColor:'#dcbbbb',
alignContent:'center',
alignItems:'center',


},
Grid:{
  padding:5,
// justifyContent:'space-between',
// flexDirection:'row',
// backgroundColor:'#E8E8E8',
height:80,
width:150,
justifyContent:'center',
alignItems:'center'
}
});

export default App;