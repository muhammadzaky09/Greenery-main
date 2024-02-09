import * as React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Searchbar, IconButton, Portal} from 'react-native-paper';
import PartnerSidebar, {MerchantSidebar, UserSidebar} from './Sidebar';

export default function MerchantHeader({navigation}: {navigation: any}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [shouldShow, setShouldShow] = React.useState(false);

  const onChangeSearch = (query: React.SetStateAction<string>) =>
    setSearchQuery(query);
  return (
    <View style={styles.row}>
      {/* Banner */}
      <View style={styles.banner}>
        <Searchbar
          style={styles.search}
          placeholder="Today's Agenda..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          inputStyle={styles.searchInput}
        />
        <IconButton
          style={styles.iconbutton}
          size={25}
          icon="menu"
          theme={icons}
          onPress={() => setShouldShow(!shouldShow)}
        />
      </View>
      <Portal>
        {shouldShow ? (
          <View>
            <TouchableOpacity
              style={styles.dim}
              onPress={() => setShouldShow(!shouldShow)}
            />
            <MerchantSidebar navigation={navigation} />
          </View>
        ) : null}
      </Portal>
    </View>
  );
}

export function PartnerHeader({navigation}: {navigation: any}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [shouldShow, setShouldShow] = React.useState(false);

  const onChangeSearch = (query: React.SetStateAction<string>) =>
    setSearchQuery(query);
  return (
    <View style={styles.row}>
      {/* Banner */}
      <View style={styles.banner}>
        <Searchbar
          style={styles.search}
          placeholder="Today's Agenda..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          inputStyle={styles.searchInput}
        />
        <IconButton
          style={styles.iconbutton}
          size={25}
          icon="menu"
          theme={icons}
          onPress={() => setShouldShow(!shouldShow)}
        />
      </View>
      <Portal>
        {shouldShow ? (
          <View>
            <TouchableOpacity
              style={styles.dim}
              onPress={() => setShouldShow(!shouldShow)}
            />
            <PartnerSidebar navigation={navigation} />
          </View>
        ) : null}
      </Portal>
    </View>
  );
}

export function UserHeader({navigation}: {navigation: any}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [shouldShow, setShouldShow] = React.useState(false);

  const onChangeSearch = (query: React.SetStateAction<string>) =>
    setSearchQuery(query);

  return (
    <View style={styles.row}>
      {/* Banner */}
      <View style={styles.banner}>
        <Searchbar
          style={styles.search}
          placeholder="Today's Agenda..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          inputStyle={styles.searchInput}
          onIconPress={() => {
            navigation.push('Search', {query: searchQuery});
            console.log('Query: ', searchQuery);
          }}
        />
        <IconButton
          style={styles.iconbutton}
          size={25}
          icon="menu"
          theme={icons}
          onPress={() => setShouldShow(!shouldShow)}
        />
      </View>
      <Portal>
        {shouldShow ? (
          <View>
            <TouchableOpacity
              style={styles.dim}
              onPress={() => setShouldShow(!shouldShow)}
            />
            <UserSidebar navigation={navigation} />
          </View>
        ) : null}
      </Portal>
    </View>
  );
}

const icons = {
  roundness: 40,
  colors: {
    primary: '#ffffff',
    accent: '#f1c40f',
  },
};

const styles = StyleSheet.create({
  dim: {
    width: '85%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  banner: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#0ec167',
  },
  search: {
    width: 300,
    height: 40,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    fontSize: 12,
    justifyContent: 'center',
    marginRight: 10,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  searchInput: {
    height: 40,
  },
  iconbutton: {
    backgroundColor: '#fff',
  },
});
