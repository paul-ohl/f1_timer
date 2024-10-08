import { connect_to_database } from "./config/db";

async function main() {
	try {
		await connect_to_database();
		console.log("Connected to Database");
	} catch (error) {
		console.error("Failed to connect to Database: ", error);
	}
}

main();
