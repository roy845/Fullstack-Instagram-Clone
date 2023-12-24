import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
} from "recharts";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import ViewListIcon from "@mui/icons-material/ViewList";
import { TimeSpentInApp } from "../../../types";

const generateRandomColor = () => {
  let color = "#2596be";

  return color;
};

const useStyles = makeStyles((theme) => ({
  toggleButton: {
    backgroundColor: "white",
    color: "#2596be",
    border: "1px solid #2596be",
    "&.Mui-selected": {
      backgroundColor: "#2596be",
      color: "black",
      "&:hover": {
        backgroundColor: "#2596be",
      },
    },
  },
}));

interface TimeSpentAnalyticsProps {
  timeSpent: TimeSpentInApp[];
}

const TimeSpentAnalytics: React.FC<TimeSpentAnalyticsProps> = ({
  timeSpent,
}) => {
  const [displayMode, setDisplayMode] = useState<string>("graphs");
  const [chartMode, setChartMode] = useState<string>("grid");

  const handleDisplayModeChange = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    newDisplayMode: string
  ) => {
    setDisplayMode(newDisplayMode);
  };

  const handleChartModeChange = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    newChartMode: string
  ) => {
    setChartMode(newChartMode);
  };

  const classes = useStyles();
  return (
    <div>
      <ToggleButtonGroup
        value={displayMode}
        exclusive
        onChange={handleDisplayModeChange}
        aria-label="display mode"
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ToggleButton
          value="graphs"
          aria-label="graphs"
          className={classes.toggleButton}
        >
          <ShowChartIcon />
          Graphs
        </ToggleButton>
        <ToggleButton
          value="table"
          aria-label="table"
          className={classes.toggleButton}
        >
          <TableChartIcon />
          Table
        </ToggleButton>
      </ToggleButtonGroup>
      {displayMode === "graphs" ? (
        <>
          <ToggleButtonGroup
            value={chartMode}
            exclusive
            onChange={handleChartModeChange}
            aria-label="chart mode"
            style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ToggleButton
              value="grid"
              aria-label="grid"
              className={classes.toggleButton}
            >
              <ViewComfyIcon />
            </ToggleButton>
            <ToggleButton
              value="stacked"
              aria-label="stacked"
              className={classes.toggleButton}
            >
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>

          {chartMode === "grid" && (
            <Grid container spacing={2}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {" "}
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  {" "}
                  <LineChart width={500} height={300} data={timeSpent}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={generateRandomColor()}
                    />
                    <XAxis dataKey="date" stroke={generateRandomColor()} />
                    <YAxis stroke={generateRandomColor()} />
                    <Tooltip
                      formatter={(value, name, props) => [
                        `Date: ${props.payload.date}`,
                        `Time Spent: ${value}`,
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="timeSpent"
                      stroke={generateRandomColor()}
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </Grid>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {" "}
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  {" "}
                  <BarChart width={500} height={300} data={timeSpent}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={generateRandomColor()}
                    />
                    <XAxis dataKey="date" stroke={generateRandomColor()} />
                    <YAxis stroke={generateRandomColor()} />
                    <Tooltip
                      formatter={(value, name, props) => [
                        `Date: ${props.payload.date}`,
                        `Time Spent: ${value}`,
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="timeSpent" fill={generateRandomColor()} />
                  </BarChart>
                </Grid>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {" "}
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <AreaChart width={500} height={300} data={timeSpent}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={generateRandomColor()}
                    />
                    <XAxis dataKey="date" stroke={generateRandomColor()} />
                    <YAxis stroke={generateRandomColor()} />
                    <Tooltip
                      formatter={(value, name, props) => [
                        `Date: ${props.payload.date}`,
                        `Time Spent: ${value}`,
                      ]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="timeSpent"
                      stroke={generateRandomColor()}
                      fill={generateRandomColor()}
                    />
                  </AreaChart>
                </Grid>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {" "}
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  {" "}
                  <RadarChart
                    cx={300}
                    cy={250}
                    outerRadius={150}
                    width={600}
                    height={500}
                    data={timeSpent}
                  >
                    <PolarGrid stroke={generateRandomColor()} />
                    <PolarAngleAxis
                      dataKey="date"
                      stroke={generateRandomColor()}
                    />
                    <PolarRadiusAxis stroke={generateRandomColor()} />
                    <Radar
                      name="timeSpent"
                      dataKey="timeSpent"
                      stroke={generateRandomColor()}
                      fill={generateRandomColor()}
                      fillOpacity={0.6}
                    />

                    <Legend />
                    <Tooltip
                      formatter={(value, name, props) => [
                        `Date: ${props.payload.date}<br/>`,
                        `Time Spent: ${value}`,
                      ]}
                      contentStyle={{ whiteSpace: "pre-line" }}
                    />
                  </RadarChart>
                </Grid>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {" "}
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <ComposedChart width={500} height={300} data={timeSpent}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={generateRandomColor()}
                    />
                    <XAxis dataKey="date" stroke={generateRandomColor()} />
                    <YAxis stroke={generateRandomColor()} />
                    <Tooltip
                      formatter={(value, name, props) => [
                        `Date: ${props.payload.date}`,
                        `Time Spent: ${value}`,
                      ]}
                      contentStyle={{ whiteSpace: "pre-line" }}
                    />
                    <Legend />
                    <Bar dataKey="timeSpent" fill={generateRandomColor()} />
                    <Line
                      type="monotone"
                      dataKey="timeSpent"
                      stroke={generateRandomColor()}
                      dot={{ r: 5 }}
                    />
                  </ComposedChart>
                </Grid>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {" "}
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  {" "}
                  <PieChart width={500} height={300}>
                    <Pie
                      data={timeSpent}
                      dataKey="timeSpent"
                      nameKey="date"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {timeSpent?.map((entry, index) => (
                        <Cell key={index} fill={generateRandomColor()} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        `Date: ${props.payload.date}`,
                        `Time Spent: ${value}`,
                      ]}
                      contentStyle={{ whiteSpace: "pre-line" }}
                    />
                  </PieChart>
                </Grid>
              </div>
            </Grid>
          )}

          {chartMode === "stacked" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <LineChart width={500} height={300} data={timeSpent}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={generateRandomColor()}
                />
                <XAxis dataKey="date" stroke={generateRandomColor()} />
                <YAxis stroke={generateRandomColor()} />
                <Tooltip
                  formatter={(value, name, props) => [
                    `Date: ${props.payload.date}`,
                    `Time Spent: ${value}`,
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="timeSpent"
                  stroke={generateRandomColor()}
                  dot={{ r: 5 }}
                />
              </LineChart>
              <BarChart width={500} height={300} data={timeSpent}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={generateRandomColor()}
                />
                <XAxis dataKey="date" stroke={generateRandomColor()} />
                <YAxis stroke={generateRandomColor()} />
                <Tooltip
                  formatter={(value, name, props) => [
                    `Date: ${props.payload.date}`,
                    `Time Spent: ${value}`,
                  ]}
                />
                <Legend />
                <Bar dataKey="timeSpent" fill={generateRandomColor()} />
              </BarChart>
              <AreaChart width={500} height={300} data={timeSpent}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={generateRandomColor()}
                />
                <XAxis dataKey="date" stroke={generateRandomColor()} />
                <YAxis stroke={generateRandomColor()} />
                <Tooltip
                  formatter={(value, name, props) => [
                    `Date: ${props.payload.date}`,
                    `Time Spent: ${value}`,
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="timeSpent"
                  stroke={generateRandomColor()}
                  fill={generateRandomColor()}
                />
              </AreaChart>
              <RadarChart
                cx={300}
                cy={250}
                outerRadius={150}
                width={600}
                height={500}
                data={timeSpent}
              >
                <PolarGrid stroke={generateRandomColor()} />
                <PolarAngleAxis dataKey="date" stroke={generateRandomColor()} />
                <PolarRadiusAxis stroke={generateRandomColor()} />
                <Radar
                  name="timeSpent"
                  dataKey="timeSpent"
                  stroke={generateRandomColor()}
                  fill={generateRandomColor()}
                  fillOpacity={0.6}
                />

                <Legend />
                <Tooltip
                  formatter={(value, name, props) => [
                    `Date: ${props.payload.date}<br/>`,
                    `Time Spent: ${value}`,
                  ]}
                  contentStyle={{ whiteSpace: "pre-line" }}
                />
              </RadarChart>
              <ComposedChart width={500} height={300} data={timeSpent}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={generateRandomColor()}
                />
                <XAxis dataKey="date" stroke={generateRandomColor()} />
                <YAxis stroke={generateRandomColor()} />
                <Tooltip
                  formatter={(value, name, props) => [
                    `Date: ${props.payload.date}`,
                    `Time Spent: ${value}`,
                  ]}
                  contentStyle={{ whiteSpace: "pre-line" }}
                />
                <Legend />
                <Bar dataKey="timeSpent" fill={generateRandomColor()} />
                <Line
                  type="monotone"
                  dataKey="timeSpent"
                  stroke={generateRandomColor()}
                  dot={{ r: 5 }}
                />
              </ComposedChart>{" "}
              <PieChart width={500} height={300}>
                <Pie
                  data={timeSpent}
                  dataKey="timeSpent"
                  nameKey="date"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill={generateRandomColor()}
                  label
                >
                  {timeSpent?.map((entry, index) => (
                    <Cell key={index} fill={generateRandomColor()} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `Date: ${props.payload.date}`,
                    `Time Spent: ${value}`,
                  ]}
                  contentStyle={{ whiteSpace: "pre-line" }}
                />
              </PieChart>
            </div>
          )}
        </>
      ) : (
        <TableContainer
          component={Paper}
          style={{
            border: `1px solid ${generateRandomColor()}`,
            marginTop: "20px",
          }}
        >
          <Table
            style={{
              backgroundColor: "white",
              border: `1px solid ${generateRandomColor()}`,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    color: generateRandomColor(),
                    border: `1px solid ${generateRandomColor()}`,
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  style={{
                    color: generateRandomColor(),
                    border: `1px solid ${generateRandomColor()}`,
                  }}
                >
                  Time Spent (Minutes)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              style={{
                color: generateRandomColor(),
                border: `1px solid ${generateRandomColor()}`,
              }}
            >
              {timeSpent?.map((dataPoint, index) => (
                <TableRow
                  style={{
                    color: generateRandomColor(),
                    border: `1px solid ${generateRandomColor()}`,
                  }}
                  key={index}
                >
                  <TableCell
                    style={{
                      color: generateRandomColor(),
                      border: `1px solid ${generateRandomColor()}`,
                    }}
                  >
                    {dataPoint.date}
                  </TableCell>
                  <TableCell
                    style={{
                      color: generateRandomColor(),
                      border: `1px solid ${generateRandomColor()}`,
                    }}
                  >
                    {dataPoint.timeSpent}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default TimeSpentAnalytics;
