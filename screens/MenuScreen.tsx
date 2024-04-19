import { FlatList } from "react-native";
import MenuComponent from "../components/ui/MenuComponent";
import { MENU_ITEMS } from "../data/menu-items";

const MenuScreen = () => {
  return (
    <FlatList
      data={MENU_ITEMS}
      renderItem={({ item }) => (
        <MenuComponent
          id={item.id}
          title={item.title}
          color={item.color}
          icon={item.icon}
          onPress={item.onPress}
        />
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default MenuScreen;
