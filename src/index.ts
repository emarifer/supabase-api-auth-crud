import { app } from "./app";
import { ENVIRONMENT } from "./config";

function main() {
  try {
    console.log("->> ✅Connection to the database is successful!\n");

    app.listen(app.get("port"));
    console.log(`->> LISTENING on PORT: ${app.get("port")}\n`);
    console.log(`->> ENVIRONMENT: ${ENVIRONMENT}\n`);
  } catch (err) {
    console.error(err);
  }
}

main();
