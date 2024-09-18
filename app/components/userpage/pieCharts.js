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
  let owesData = [];
  let owedData = [];

  let owedBalance = 0;
  let owesBalance = 0;

  userBalances.forEach((user) => {
    let userName;
    let data;
    users.forEach((us) => {
      if (user.id === us.id) {
        userName = us.firstName;
      }
    });

    if (user.balance >= 0) {
      owesBalance += user.balance;
      owesData.push({
        id: user.id,
        value: Math.abs(user.balance),
        label: userName,
      });
    } else {
      owedBalance -= user.balance;
      owedData.push({
        id: user.id,
        value: Math.abs(user.balance),
        label: userName,
      });
    }
  });

  console.log("owes", owesData);

  return (
    <div>
      <h1>House is owed:</h1>
      <PieChart
        series={[{ data: owedData, innerRadius: 40 }]}
        width={300}
        height={150}
      >
        <PieCenterLabel>{"£ " + (owedBalance).toFixed(2)}</PieCenterLabel>
      </PieChart>
      <h1>House owes</h1>
      <PieChart
        series={[{ data: owesData, innerRadius: 40 }]}
        width={300}
        height={150}
      >
        <PieCenterLabel>{"£ " + (owesBalance).toFixed(2)}</PieCenterLabel>
      </PieChart>
    </div>
  );
}
