import { createServer } from "node:http";
import { loadIntern, saveIntern } from "./storage.js";
import { gainXp } from "./intern.js";

const server = createServer(async (request, response) => {
    
    if (request.method === "GET" && request.url === "/intern") {

        try {

            const intern = await loadIntern();
    
            response.writeHead(200, {
                "Cotent-Type": "application/json"
            });
    
            response.end(
                JSON.stringify(intern)
            );

        } catch (error) {

            response.writeHead(500, {
                "Content-Type": "application/json"
            });

            response.end(
                JSON.stringify({
                    message: "Could not load intern"
                })
            );
        }
        
        return;
    }

    if (request.method === "POST" && request.url === "/intern/xp") {
        
        let body = "";

        request.on("data", (chunk) => {
            body = body + chunk;
        });

        request.on("end", async () => {
            try {

                let data;

                try {
                    data = JSON.parse(body);
                } catch {
                    response.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    response.end(
                        JSON.stringify({
                            message: "Invalid JSON"
                        })
                    );

                    return;
                }

                if (typeof data.amount !== "number" || data.amount <=0) {
                    response.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    response.end(
                        JSON.stringify({
                            message: "Amount must be a positive number"
                        })
                    );

                    return;
                }

                const intern = await loadIntern();
    
                gainXp(intern, data.amount);

                await saveIntern(intern)
    
                response.writeHead(200, {
                    "Content-Type": "application/json"
                });
    
                response.end(
                    JSON.stringify(intern)
                );
            } catch (error) {
                    console.error("Error updating intern:", error.message);

                    response.writeHead(500, {
                        "Content-Type": "application/json"
                    });
                    
                    response.end(
                        JSON.stringify({
                            message: "Could not update intern"
                        })
                    );

                }   
        });

        return;
    }
    
});

server.listen(3000, () => {
    console.log("Server running on port 3000")
})