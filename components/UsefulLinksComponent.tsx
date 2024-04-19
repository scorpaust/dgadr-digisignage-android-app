import React from 'react';
import { ActivityIndicator, Dimensions, Linking } from 'react-native';
import { StyleSheet, FlatList, Image, TouchableOpacity, Animated } from 'react-native';
import BaseCard from './layout-base/BaseCard';

const windowWidth = Dimensions.get('window').width;

const scaleFactor = windowWidth / 320; 

export interface ListItem {
    id: string;
    imageUrl: string;
    link: string;
}

interface CustomListItemProps {
    item: ListItem;
}

export const CustomListItem: React.FC<CustomListItemProps> = ({ item }) => {

    const [isLoading, setIsLoading] = React.useState(true);
    
    const scale = new Animated.Value(1);

    const onPressIn = () => {
        Animated.spring(scale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
        }).start();
    };

    const onPress = () => Linking.canOpenURL(item.link).then(() => {
        Linking.openURL(item.link);
    });

    return (
        <TouchableOpacity onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress} activeOpacity={0.7}>
            <Animated.View style={[styles.itemContainer, { transform: [{ scale }] }]}>
                {isLoading && (
                    <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
                )}
                <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.image}
                    onLoad={() => setIsLoading(false)}
                    onError={(e) => console.error('Image loading error:', e.nativeEvent.error)}
                />
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    loader: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemContainer: {      
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 5,
        backgroundColor: 'white',
        marginTop: '15%',
        marginHorizontal: '5%',
        padding: '5%'
    },
    image: {
        padding: '5%',
        width: '100%',
        height: 60 * scaleFactor,
        objectFit: 'contain'
    },
});

const UsefulLinksComponent: React.FC<{ data: ListItem[] }> = ({ data }) => {
    return (
        <BaseCard>
            <FlatList
                data={data}
                renderItem={({ item }) => <CustomListItem item={item} />}
                keyExtractor={item => item.id}
            />
        </BaseCard>
    );
};

export default UsefulLinksComponent;
