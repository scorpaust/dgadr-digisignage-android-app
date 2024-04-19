import { FlatList, StyleSheet } from "react-native";
import { View } from "react-native";
import BaseCard from "../components/layout-base/BaseCard";
import UsefulLinksComponent, { CustomListItem, ListItem } from "../components/UsefulLinksComponent";

const items: ListItem[] = [
    {
        id: "1",
        imageUrl: "https://www.dgadr.gov.pt/images/prod_trad_2019.png",
        link: "https://tradicional.dgadr.pt/pt/"
    },
    {
        id: "2",
        imageUrl: "https://www.dgadr.gov.pt/images/images/logo_agribio.png",
        link: "https://mpb.dgadr.gov.pt/"
    },
    {
        id: "3",
        imageUrl: "https://www.dgadr.gov.pt/images/images/parceria_solos.png",
        link: "https://parceriaptsolo.dgadr.gov.pt/"
    },
    {
        id: "4",
        imageUrl: "https://www.dgadr.gov.pt/images/images/logosir.png",
        link: "http://sir.dgadr.pt/"
    },
    {
        id: "5",
        imageUrl: "https://www.dgadr.gov.pt/images/images/bolsaterras.gif",
        link: "http://www.bolsanacionaldeterras.pt/"
    },
    {
        id: "6",
        imageUrl: "https://www.dgadr.gov.pt/images/images/logo_rede_pac.png",
        link: "https://www.dgadr.gov.pt/images/images/logo_rede_pac.png"
    },
    {
        id: "7",
        imageUrl: "https://www.dgadr.gov.pt/images/saaf_logo.png",
        link: "http://saaf.dgadr.gov.pt/"
    },
    {
        id: "8",
        imageUrl: "https://www.dgadr.gov.pt/images/images/rectec2.png",
        link: "http://rectec.dgadr.pt/"
    },
    {
        id: "9",
        imageUrl: "https://www.dgadr.gov.pt/images/af/logo_agrifam_final.png",
        link: "https://agrifam.dgadr.gov.pt/"
    },
    {
        id: "10",
        imageUrl: "https://www.dgadr.gov.pt/images/PTP_PEO_Cores2.png",
        link: "https://www.dgadr.gov.pt/estruturacao-fundiaria/emparcelar-para-ordenar#candidaturas"
    },
    {
        id: "11",
        imageUrl: "https://www.dgadr.gov.pt/images/images/biblioteca_online.png",
        link: "http://biblioteca.dgadr.pt/"
    },
    {
        id: "12",
        imageUrl: "https://www.dgadr.gov.pt/images/images/alimente_imagemsite.png",
        link: "https://www.alimentequemoalimenta.pt/"
    },
    {
        id: "13",
        imageUrl: "https://www.dgadr.gov.pt/images/images/logo_snis.png",
        link: "https://snisolos.dgadr.gov.pt/"
    },
    {
        id: "14",
        imageUrl: "https://www.dgadr.gov.pt/images/images/logo_animalbio3_dgadr.png",
        link: "https://animalbio.dgadr.gov.pt/"
    },
    {
        id: "15",
        imageUrl: "https://www.dgadr.gov.pt/images/images/bolsa_iniciativas_logo.png",
        link: "https://rrn.dgadr.pt/prr/"
    },
    {
        id: "16",
        imageUrl: "https://www.dgadr.gov.pt/images/images/lista_tecnicos.png",
        link: "https://app.dgadr.gov.pt/apoiotecnico"
    },
    {
        id: "17",
        imageUrl: "https://www.dgadr.gov.pt/images/projetos_cofinanciados_logo.png",
        link: "https://www.dgadr.gov.pt/dgadr/projetos-cofinanciados"
    }
]



const UsefulLinksScreen = () => {

    return (
            <FlatList
            data={items}
            renderItem={({ item }) => <CustomListItem item={item} />}
            keyExtractor={item => item.id}
            />
    
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

});

export default UsefulLinksScreen;