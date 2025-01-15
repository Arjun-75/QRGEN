import cors from "cors";
import express from "express";
import qr from "qr-image";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;
app.use(cors());

app.use(express.static(__dirname));

app.get("/generate", (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const qr_svg = qr.image(url, { type: "png" });
  const filePath = `${__dirname}/qr-image.png`;

  qr_svg.pipe(fs.createWriteStream(filePath));
  qr_svg.on("end", () => {
    res.json({ filePath: "qr-image.png" });
  });
});

app.listen(port, () => {
  console.log(`QR code generator running at http://localhost:${port}`);
});