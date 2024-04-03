

export const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:4173",
        process.env.CLIENT_URL],
    Methods: [ "GET","POST","PUT","DELETE"],
    credentials: true
};

export const chatToken = "chat-token";