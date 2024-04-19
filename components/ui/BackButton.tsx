import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const scaleFactor = windowWidth / 320; 


const BackButton = () => {

    const navigation = useNavigation();

    function pressBackButtonHandler() {
        if (navigation.canGoBack())
            navigation.goBack()
        else
            navigation.navigate({ name: 'MenuScreen'} as never)
    }

    return (

        <Ionicons name="arrow-back" size={24 * scaleFactor} color="black" onPress={pressBackButtonHandler} />
   
    );
}

export default BackButton;