import React, { useState, useEffect } from "react";
import { db } from "../../config";
import { ref, onValue } from "firebase/database";
import GreetingModal from "../ui/GreetingModal";

interface Employee {
  name: string;
  startDate: string;
  endDate?: string;
  startYear?: number;
  department?: string;
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
        welcomeNames.push(`${employee.name}\n(${employee.department})`);
      }
      if (
        employee.endDate &&
        isSameDay(employee.endDate, todayFormatted) &&
        employee.startYear &&
        new Date(employee.endDate).getFullYear() === currentYear
      ) {
        leavingEmployees.push(`${employee.name}`);
      }
    });

    if (welcomeNames.length > 0) {
      setWelcomeMsg(
        `A DGADR dá as boas vindas aos trabalhadores:\n\n\n${welcomeNames.join(
          "\n\n"
        )}`
      );
      setIsWelcomeModalVisible(true);
    }

    if (leavingEmployees.length > 0) {
      setByeMsg(
        `A Direção-Geral de Agricultura e Desenvolvimento Rural (DGADR) deseja os maiores sucessos e felicidade aos seguintes trabalhadores, agradecendo todo o empenho e contributo:\n\n${leavingEmployees.join(
          "\n\n"
        )}`
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

  const handleCloseWelcomeModal = () => {
    setIsWelcomeModalVisible(false);
    setTimeout(() => {
      setIsWelcomeModalVisible(true);
    }, 10000); // 10 seconds
  };

  const handleCloseByeModal = () => {
    setIsByeModalVisible(false);
    setTimeout(() => {
      setIsByeModalVisible(true);
    }, 10000); // 10 seconds
  };

  const distribute: boolean = isWelcomeModalVisible && isByeModalVisible;

  return (
    <>
      {isWelcomeModalVisible && (
        <GreetingModal
          title="Bem vindos à DGADR"
          message={welcomeMsg}
          modalVisible={isWelcomeModalVisible}
          setModalVisible={handleCloseWelcomeModal}
          distribute={distribute}
        />
      )}
      {isByeModalVisible && (
        <GreetingModal
          title="Despedida"
          message={byeMsg}
          modalVisible={isByeModalVisible}
          setModalVisible={handleCloseByeModal}
          distribute={distribute}
        />
      )}
    </>
  );
};

export default NotificationScheduler;
