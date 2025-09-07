import { MenuItem } from "../types/menu-item";

export const MENU_ITEMS: MenuItem[] = [
  /*{
    id: "1",
    icon: "business-outline",
    title: "Sobre a DGADR",
    color: "#f5428d",
    onPress: "MissionScreen",
  },*/
  /*{
    id: "1",
    icon: "organization",
    title: "Organograma",
    color: "#368dff",
    onPress: "OrganogramScreen",
  },*/
  {
    id: "2",
    icon: "time-outline",
    title: "Horário",
    color: "#f54242",
    onPress: "ScheduleScreen",
  },
  {
    id: "3",
    icon: "book-outline",
    title: "Livro de Reclamações",
    color: "#fddd03",
    onPress: "ComplaintScreen",
  },
  {
    id: "4",
    icon: "documents",
    title: "Projetos Cofinanciados",
    color: "#7fffcc",
    onPress: "ProjectsScreen",
  },
  {
    id: "5",
    icon: "link",
    title: "As Nossas Ligações",
    color: "#8A2BE2",
    onPress: "UsefulLinksScreen",
  },
  {
    id: "6",
    icon: "images",
    title: "Galeria",
    color: "#f5a442",
    onPress: "MediaScreen",
  },
  /*{
    id: "7",
    icon: "calendar-outline",
    title: "Eventos",
    color: "#f5428d",
    onPress: "EventsScreen",
  },*/
  {
    id: "8",
    icon: "barcode",
    title: "Destaques da Biblioteca",
    color: "#E33332",
    onPress: "LibFeatScreen",
  },
];
