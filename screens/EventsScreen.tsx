import React, { useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ImageSourcePropType,
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
  {
    id: "2",
    title: "3ª exposição/venda internacional de orquídeas de Coimbra",
    subtitle: "",
    summary:
      "Depois do enorme sucesso das duas primeiras edições, a Associação Portuguesa de Orquidofilia (A.P.O.) tem o prazer de anunciar a realização da 3.ª Exposição / Venda Internacional de Orquídeas de Coimbra no Seminário Maior de Coimbra numa iniciativa que pretende divulgar e promover o conhecimento das pessoas em torno destas maravilhosas plantas de floração exuberante que apaixona tantos colecionadores e curiosos.",
    date: "2024-06-14 a 2024-06-16",
    time: "10:00 às 19h00",
    imgUrl: require("../assets/events/20240524101400-flyer_coimbra_2024_main_60x90_004.jpg"),
  },
  {
    id: "3",
    title: "VitiVino 2024",
    subtitle:
      "III Simpósio de Viticultura e V Colóquio Vitivinícol em Cantanhede",
    summary:
      "Nos dias 14 e 15 de novembro de 2024, Cantanhede será palco do III Simpósio de Viticultura e V Colóquio Vitivinícola, um evento organizado pela Associação Portuguesa de Horticultura e a Sociedade de Ciências Agrárias de Portugal, em parceria com o Município de Cantanhede e o Biocant Park.",
    date: "2024-11-14 a 2024-11-15",
    time: "",
    imgUrl: require("../assets/events/grapes-276070_1280-1140x570.jpg"),
  },
  // Adicione mais eventos conforme necessário
];

const EventListScreen = () => {
  const [selectedImage, setSelectedImage] =
    useState<ImageSourcePropType | null>(null);

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
