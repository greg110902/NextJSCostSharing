import { PieChart } from "@mui/x-charts";

export default function Chart({ data }) {
  return <PieChart series={data} width={400} height={200}></PieChart>;
}
