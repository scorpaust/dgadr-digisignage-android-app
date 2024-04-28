import React, { useState, useEffect } from "react";
import { db } from "../../config";
import { ref, onValue } from "firebase/database";
import GreetingModal from "../ui/GreetingModal";

interface Employee {
  name: string;
  startDate: string;
  endDate?: string;
  startYear?: number;
}

const NotificationScheduler: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isWelcomeModalVisible, setIsWelcomeModalVisible] = useState(false);
  const [isByeModalVisible, setIsByeModalVisible] = useState(false);
  const [welcomeMsg, setWelcomeMsg] = useState("");
  const [byeMsg, setByeMsg] = useState("");

  useEffect(() => {
    const employeesRef = ref(db, "/employees");
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
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const todayFormatted = formatDateToYYYYMMDD(currentDate);

    let welcomeNames: string[] = [];
    let leavingEmployees: string[] = [];

    employees.forEach((employee) => {
      if (isSameDay(employee.startDate, todayFormatted)) {
        welcomeNames.push(employee.name);
      }
      if (
        employee.endDate &&
        isSameDay(employee.endDate, todayFormatted) &&
        employee.startYear &&
        new Date(employee.endDate).getFullYear() === currentYear
      ) {
        leavingEmployees.push(
          `${employee.name} (${employee.startYear}-${currentYear})`
        );
      }
    });

    if (welcomeNames.length > 0) {
      setWelcomeMsg(
        `A DGADR dá as boas vindas aos trabalhadores: ${welcomeNames.join(
          ", "
        )}`
      );
      setIsWelcomeModalVisible(true);
    }

    if (leavingEmployees.length > 0) {
      setByeMsg(
        `A DGADR despede-se dos seguintes trabalhadores, agradecendo o contributo dos mesmos: ${leavingEmployees.join(
          ", "
        )}.`
      );
      setIsByeModalVisible(true);
    }
  }, [employees]);

  function formatDateToYYYYMMDD(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
  }

  function isSameDay(date1: string, date2: string) {
    return date1 === date2;
  }

  const distribute: boolean = isWelcomeModalVisible && isByeModalVisible;

  return (
    <>
      {isWelcomeModalVisible && (
        <GreetingModal
          title="Bem vindos à DGADR"
          message={welcomeMsg}
          modalVisible={isWelcomeModalVisible}
          setModalVisible={() => setIsWelcomeModalVisible(false)}
          distribute={distribute}
        />
      )}
      {isByeModalVisible && (
        <GreetingModal
          title="Despedida da DGADR"
          message={byeMsg}
          modalVisible={isByeModalVisible}
          setModalVisible={() => setIsByeModalVisible(false)}
          distribute={distribute}
        />
      )}
    </>
  );
};

export default NotificationScheduler;
