import { PieChart } from "@mui/x-charts";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 20,
}));

export default function OwedOwingCharts({ userBalances, users }) {
  let owingData = [];
  let owedData = [];

  let owedBalance = 0;
  let owingBalance = 0;

  userBalances.forEach((user) => {
    let userName;
    users.forEach((us) => {
      if (user.id === us.id) {
        userName = us.firstName;
      }
    });
    if (user.balance >= 0) {
      owedBalance += user.balance;
      owedData.push({
        id: user.id,
        value: Math.abs(user.balance),
        label: userName,
      });
    } else {
      owingBalance -= user.balance;
      owingData.push({
        id: user.id,
        value: Math.abs(user.balance),
        label: userName,
      });
    }
  });

  return (
    <div>
      <h1>House is owed:</h1>
      <PieChart
        series={[{ data: owingData, innerRadius: 40 }]}
        width={300}
        height={150}
      >
        <PieCenterLabel>{"£ " + owedBalance}</PieCenterLabel>
      </PieChart>
      <h1>House owes</h1>
      <PieChart
        series={[{ data: owedData, innerRadius: 40 }]}
        width={300}
        height={150}
      >
        <PieCenterLabel>{"£ " + owingBalance}</PieCenterLabel>
      </PieChart>
    </div>
  );
}
