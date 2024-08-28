import Image from "next/image";
import Card from "./components/transactions/Card";

export default function Home() {
  return (
    <div>
      <h1>Transactions</h1>
      <div>
        <Card
          transactionID={1}
          author={"Greg"}
          affected={"Alivia"}
          amount={100}
          title={"Condoms"}
          date={"28/08/2024"}
        />
        <Card
          transactionID={1}
          author={"Greg"}
          affected={"Harry"}
          amount={100}
          title={"Peppers"}
          date={"28/08/2024"}
        />
      </div>
    </div>
  );
}
