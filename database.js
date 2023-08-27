
import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Bluepeacock_322',
  database: 'target'
}).promise()

// Get a List of States
export async function getState() {
  const [rows] = await pool.query(`SELECT DISTINCT State FROM target.zillow ORDER BY State ASC`);
  return rows;
}
// Get a List of Cities From Each State
export async function getCities(State) {
  const [rows] = await pool.query(
    `SELECT DISTINCT RegionName FROM target.zillow WHERE State = ? ORDER BY RegionName ASC`,
    [State]
  );
  return rows;
}
// Get House Prices for a City
export async function getPrice(RegionName) {
  const [rows] = await pool.query(`SELECT RegionName, CompleteDate, price FROM target.zillow 
  WHERE RegionName = ?`, [RegionName])
  return rows;
}
// more specific to State
export async function getPriceSpecific(RegionName, State) {
  const [rows] = await pool.query(`SELECT RegionName, State, CompleteDate, price FROM target.zillow 
  WHERE RegionName = ? AND State = ?`, [RegionName, State])
  return rows;
}
// Get House Prices for a State
export async function getStatePrice(State) {
  const qu = `
  SELECT State, CompleteDate, AVG(price) AS averagePrice
  FROM target.zillow
  WHERE State = ?
  GROUP BY State, CompleteDate
  `;
  const [rows] = await pool.query(qu, [State]);
  return rows;
}

const note = await getState()
console.log(note)


// export async function getPrice1() {
//   const [rows] = await pool.query(`SELECT * FROM target.zillow WHERE RegionName = 'New York' AND CompleteDate = '2003-11-30'`)
//   return rows;
// }
