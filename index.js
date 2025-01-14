import cors from "cors";
import express from "express";
import qr from "qr-image";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Define __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;
app.use(cors());

// Serve static files
app.use(express.static(__dirname));

app.get("/generate", (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  // Generate the QR code
  const qr_svg = qr.image(url, { type: "png" });
  const filePath = `${__dirname}/qr-image.png`;

  // Save and serve the QR code
  qr_svg.pipe(fs.createWriteStream(filePath));
  qr_svg.on("end", () => {
    res.json({ filePath: "qr-image.png" }); // Return the file path to the client
  });
});

app.listen(port, () => {
  console.log(`QR code generator running at http://localhost:${port}`);
});

/*inquirer
  .prompt([
    {
        message:"Please input the url here :",
        name:"url"
    },
  ])
  .then((answers) => {
    const URL = answers.url; 
    var qr_svg = qr.image(URL);
    qr_svg.pipe(fs.createWriteStream('qr-image.png'));

    fs.writeFile( "./URL_deposit", URL,(err) => {
        if (err) throw err;
        console.log("The file has been saved");
    });
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });*/