import { Request, Response } from "express";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Middleware pentru setările CORS
const setCorsHeaders = (res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

// Funcție pentru a răspunde la cererile OPTIONS (preflight)
export const OPTIONS = async (req: Request, res: Response) => {
  setCorsHeaders(res);
  res.status(200).end();
};

// Endpoint POST - Actualizează AWB pentru un order și adaugă în metadata
export const POST = async (req: Request, res: Response) => {
  setCorsHeaders(res);

  const { orderId, awb } = req.body;

  if (!orderId || !awb) {
    return res.status(400).json({
      status: "error",
      message: "Trebuie să specifici un orderId și un AWB.",
    });
  }

  try {
    const query = `
      UPDATE "order"
      SET metadata = COALESCE(metadata, '{}') || jsonb_build_object('awb', $1::text)
      WHERE id = $2
      RETURNING *;
    `;

    const result = await pool.query(query, [awb, orderId]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "Nu s-a găsit nicio intrare cu acest ID.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "AWB actualizat cu succes în metadata.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Eroare la actualizarea AWB-ului în metadata:", error);
    res.status(500).json({
      status: "error",
      message: "A apărut o eroare la actualizarea AWB-ului în metadata.",
      error: error.message,
    });
  }
};
