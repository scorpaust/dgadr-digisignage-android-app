import React, { ReactElement, SetStateAction, useEffect } from "react";
import { View } from "react-native";
import { db } from "../../config";
import { ref, orderByChild, onValue, off } from "firebase/database";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../../plugins/notifications";
import { useState } from "react";
import { ListItem } from "../UsefulLinksComponent";
import InfoModal from "../InfoModal";
import GreetingModal from "../ui/GreetingModal";

interface Employee {
  name: string;
  startDate: string;
  endDate?: string;
  startYear?: number;
}

registerForPushNotificationsAsync();

const NotificationScheduler: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isWelcomeModalVisible, setIsWelcomeModalVisible] = useState(false);
  const [isByeModalVisible, setIsByeModalVisible] = useState(false);
  const [welcomeMsg, setWelcomeMsg] = useState("");
  const [byeMsg, setByeMsg] = useState("");

  const handleWelcomeModalClose = () => setIsWelcomeModalVisible(false);
  const handleByeModalClose = () => setIsByeModalVisible(false);

  useEffect(() => {
    function getEmployeesFromDb() {
      const employeesRef = ref(db, "/employees");
      orderByChild("/employees");
      onValue(employeesRef, (snapshot) => {
        const rawData = snapshot.val();
        const fetchedEmployees = rawData
          ? Object.keys(rawData).map((key) => ({
              ...rawData[key],
              id: key,
            }))
          : [];
        setEmployees(fetchedEmployees);
      });
    }

    getEmployeesFromDb();
  }, []);

  useEffect(() => {
    let employeeNames: string[] = [];
    if (employees.length > 0) {
      employees.forEach((employee) => {
        employeeNames.push(employee.name);
        scheduleWelcomeNotification(employeeNames, employee.startDate);
        if (employee.endDate && employee.startYear) {
          scheduleFarewellNotification(
            employeeNames,
            employee.endDate,
            employee.startYear
          );
        }
      });
    }
  }, [employees]);

  async function scheduleWelcomeNotification(
    employeeNames: string[],
    startDate: string
  ): Promise<void> {
    const trigger = new Date(startDate);

    trigger.setHours(22);
    trigger.setMinutes(45);
    trigger.setSeconds(10);

    //if (trigger.getTime() - Date.now() <= 0) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Bem vindos à DGADR!",
        body: `A DGADR dá as boas vindas aos trabalhadores: ${employeeNames.join(
          ", "
        )}`,
        data: { date: startDate },
      },
      trigger: { seconds: 10 },
    });

    setWelcomeMsg(
      `A DGADR dá as boas vindas aos trabalhadores: ${employeeNames.join(", ")}`
    );

    setIsWelcomeModalVisible(
      employeeNames.length > 0 &&
        isSameDay(startDate, formatDateToYYYYMMDD(new Date()))
    );
  }

  async function scheduleFarewellNotification(
    employeeNames: string[],
    endDate: string,
    startYear: number
  ): Promise<void> {
    const trigger = new Date(endDate);

    trigger.setHours(22);
    trigger.setMinutes(50);
    trigger.setSeconds(12);

    const currentYear = new Date().getFullYear();

    //if (trigger.getTime() - Date.now() <= 0) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Despedida da DGADR",
        body: `A DGADR despede-se dos seguintes trabalhadores, agradecendo o contributo dos mesmos: ${employeeNames.join(
          ", "
        )}. (${startYear} - ${currentYear})`,
        data: { date: endDate },
      },
      trigger: { seconds: 10 },
    });

    setByeMsg(
      `A DGADR despede-se dos seguintes trabalhadores, agradecendo o contributo dos mesmos: ${employeeNames.join(
        ", "
      )}. (${startYear} - ${currentYear})`
    );

    setIsByeModalVisible(
      employeeNames.length > 0 &&
        isSameDay(endDate, formatDateToYYYYMMDD(new Date()))
    );
  }

  function formatDateToYYYYMMDD(date: Date) {
    const year = date.getFullYear(); // Gets the year (4 digits)
    const month = date.getMonth() + 1; // Gets the month (0-11, so add 1 to normalize to 1-12)
    const day = date.getDate(); // Gets the day of the month (1-31)

    // Pad the month and day with leading zeros if necessary
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    // Combine into YYYY-MM-DD format
    return `${year}-${formattedMonth}-${formattedDay}`;
  }

  function isSameDay(date1: string, date2: string) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  return (
    <>
      {isWelcomeModalVisible && (
        <GreetingModal
          title="Bem vindos à DGADR"
          message={welcomeMsg}
          modalVisible={isWelcomeModalVisible}
          setModalVisible={handleWelcomeModalClose}
        />
      )}
      {isByeModalVisible && (
        <GreetingModal
          title="Despedida da DGADR"
          message={byeMsg}
          modalVisible={isByeModalVisible}
          setModalVisible={handleByeModalClose}
        />
      )}
    </>
  );
};

export default NotificationScheduler;
