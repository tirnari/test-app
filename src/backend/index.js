import Express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import logger from "logger";

const app = new Express();
const log = logger.createLogger();

const port = process.env.API_PORT || 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const dataStore = {
  rows: [{ id: 1, text: "aaa" }, { id: 2, text: "bbb" }, { id: 3, text: "ccc" }]
};

app.get("/rows", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.json(dataStore);
});

app.post("/rows", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Content-Type", "application/json");
  const { rows } = dataStore;

  if (rows.length >= 10)
    return res.status(400).json({
      error:
        "You can't store more than 10 entries. But you can delete any, just click on it ;)"
    });

  const { text } = req.body;

  if (!text)
    return res.status(400).json({
      error: "You can't store empty entry ;)"
    });

  const id = rows.length + 1;
  dataStore.rows = [...rows, { id, text }];
  res.json({ id, text });
});

app.delete("/rows", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Content-Type", "application/json");
  const { id } = req.body;
  const { rows } = dataStore;
  dataStore.rows = rows.filter(r => r.id !== id);
  res.json({ id });
});

app.listen(port, () => {
  log.info(`Example app listening on port ${port}!`);
});
