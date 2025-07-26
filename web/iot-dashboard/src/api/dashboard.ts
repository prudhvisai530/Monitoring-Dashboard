import axios from "axios";

export const getSensorData = async (token: string | null, date?: string) => {

    const query = date
        ? `
        query GetDataByDate($date: String!) {
          getDataByDate(date: $date) {
            temperature
            humidity
            powerUsage
            createdAt
          }
        }
      `
        : `
        query {
          getData {
            temperature
            humidity
            powerUsage
            createdAt
          }
        }
      `;
    return await axios.post(
        'http://localhost:3000/graphql',
        {
            query,
            variables: date ? { date } : undefined,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
    );
}