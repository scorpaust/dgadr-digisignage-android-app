import React, { useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import EventItem from "../components/events/EventItem";
import FullScreenImage from "../components/events/FullScreenImage";
import { EventItemType } from "../types/event-item"; // Certifique-se de importar o tipo corretamente

const eventsData: EventItemType[] = [
  {
    id: "1",
    title:
      'Exposição "Paisagens Ideológicas. O Tempo nas Colónias Agrícolas em Portugal"',
    subtitle: "",
    summary:
      "O projeto expõe a evolução das sete colónias agrícolas implementadas durante o regime do Estado Novo, através de imagens e relatos que atravessam mais de meio século. A iniciativa visa não apenas resgatar a memória histórica desses espaços, mas também refletir sobre as transformações socioeconómicas ocorridas no meio rural português. A DGADR espera a presença de todos para promover a partilha de conhecimentos sobre um capítulo importante da História agrícola do País",
    date: "2024-03-11 a 2024-04-30",
    time: "9:30 às 16h30",
    imgUrl: require("../assets/events/2024_03_11_expo_juntas_colonias_agricolas.png"),
  },
  // Adicione mais eventos conforme necessário
];

const EventListScreen = () => {
  const [selectedImage, setSelectedImage] = useState<NodeRequire | null>(null);

  const onCloseHandler = () => {
    setSelectedImage(null);
  };

  const renderItem = ({ item }: { item: EventItemType }) => (
    <TouchableOpacity onPress={() => setSelectedImage(item.imgUrl)}>
      <EventItem
        title={item.title}
        subtitle={item.subtitle}
        summary={item.summary}
        date={item.date}
        time={item.time}
        id={item.id}
        imgUrl={item.imgUrl}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={eventsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      {selectedImage && (
        <Modal
          visible={true}
          transparent={true}
          onRequestClose={() => setSelectedImage(null)}
        >
          <FullScreenImage imgUrl={selectedImage} onClose={onCloseHandler} />
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default EventListScreen;
