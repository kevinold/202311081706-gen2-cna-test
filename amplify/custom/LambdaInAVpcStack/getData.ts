import { APIGatewayProxyResultV2 } from "aws-lambda";

const geoData = [
  {
    name: "United States",
    states: [
      "Alabama",
      "Alaska",
      "Arizona",
      //...
    ],
  },
  {
    name: "Canada",
    states: [
      "Alberta",
      "British Columbia",
      "Manitoba",
      // ...
    ],
  },
  {
    name: "Mexico",
    states: [
      "Jalisco",
      "Mexico City",
      "Oaxaca",
      // ...
    ],
  },
];

export async function handler(): Promise<APIGatewayProxyResultV2> {
  try {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geoData, null, 2),
    };
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(error),
    };
  }
}
