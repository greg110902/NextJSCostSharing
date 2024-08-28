import Image from "next/image";
import Card from "./components/transactions/Card";

export default function Home() {
  return (
    <Card
      transactionID={1}
      author={"Greg"}
      affected={"Alivia"}
      amount={100}
      title={"Condoms"}
      date={"28/08/2024"}
    />
  );
}
