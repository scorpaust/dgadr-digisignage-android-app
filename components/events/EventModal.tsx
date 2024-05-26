import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ImageURISource,
} from "react-native";
import { EventItemType } from "../../types/event-item"; // Certifique-se de importar o tipo corretamente
import { ImageSourcePropType } from "react-native/types";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const scaleFactor = windowWidth / 320;

export const eventsData: EventItemType[] = [
  {
    id: "1",
    title: 'Exposição "Paisagens Ideológicas.',
    subtitle: "Subtítulo Exemplo",
    summary:
      "O projeto expõe a evolução das sete colónias agrícolas implementadas durante o regime do Estado Novo,...",
    date: "2024-03-11 a 2024-06-30",
    time: "9:30 às 16h30",
    imgUrl: require("../../assets/events/2024_03_11_expo_juntas_colonias_agricolas.png"),
  },
  {
    id: "2",
    title: "3ª exposição/venda internacional de orquídeas de Coimbra",
    subtitle: "",
    summary:
      "Depois do enorme sucesso das duas primeiras edições, a Associação Portuguesa de Orquidofilia (A.P.O.) tem o prazer de anunciar a realização da 3.ª Exposição / Venda Internacional de Orquídeas de Coimbra no Seminário Maior de Coimbra numa iniciativa que pretende divulgar e promover o conhecimento das pessoas em torno destas maravilhosas plantas de floração exuberante que apaixona tantos colecionadores e curiosos.",
    date: "2024-06-14 a 2024-06-16",
    time: "10:00 às 19h00",
    imgUrl: require("../../assets/events/20240524101400-flyer_coimbra_2024_main_60x90_004.jpg"),
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
    imgUrl: require("../../assets/events/grapes-276070_1280-1140x570.jpg"),
  },
  // Adicione mais eventos conforme necessário
];

export const getUpcomingEvents = (events: EventItemType[]) => {
  const today = new Date();
  return events.filter((event) => new Date(event.date.split(" a ")[1]) > today);
};

export const EventModal: React.FC<{
  event: EventItemType;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  showNext: boolean;
  showPrevious: boolean;
}> = ({ event, onClose, onNext, onPrevious, showNext, showPrevious }) => {
  return (
    <View style={modalStyles.container}>
      <View style={modalStyles.content}>
        <TouchableOpacity onPress={onPrevious} disabled={!showPrevious}>
          {showPrevious && <Text style={modalStyles.arrow}>{"<"}</Text>}
        </TouchableOpacity>
        <View style={modalStyles.eventContainer}>
          <Text style={modalStyles.title}>{event.title}</Text>
          <Text style={modalStyles.subtitle}>{event.subtitle}</Text>
          <Text style={modalStyles.summary}>{event.summary}</Text>
          <Text style={modalStyles.datetime}>{`Data: ${event.date} \nHorário: ${
            event.time ? event.time : "N/A"
          }`}</Text>
          <Image style={modalStyles.image} source={event.imgUrl} />
        </View>
        <TouchableOpacity onPress={onNext} disabled={!showNext}>
          {showNext && <Text style={modalStyles.arrow}>{">"}</Text>}
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
        <Text style={modalStyles.closeButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );
};

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: windowWidth * 0.9, // Largura fixa
    height: windowHeight * 0.8, // Altura fixa
  },
  eventContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18 * scaleFactor,
    color: "#000",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14 * scaleFactor,
    color: "#333",
    textAlign: "center",
  },
  summary: {
    fontSize: 12 * scaleFactor,
    textAlign: "justify",
    color: "#333",
  },
  datetime: {
    fontSize: 12 * scaleFactor,
    color: "#333",
    marginTop: 8 * scaleFactor,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 100 * scaleFactor,
    resizeMode: "contain",
    marginTop: 10 * scaleFactor,
  },
  arrow: {
    fontSize: 24 * scaleFactor,
    color: "#000",
    padding: 10 * scaleFactor,
  },
  closeButton: {
    position: "absolute",
    top: 40 * scaleFactor,
    right: 20 * scaleFactor,
    backgroundColor: "white",
    padding: 10 * scaleFactor,
    borderRadius: 20 * scaleFactor,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 16 * scaleFactor,
    color: "#000",
  },
});
