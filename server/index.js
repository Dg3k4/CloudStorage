const express = require("express")
const mongoose = require("mongoose")
const config = require("config")
const fileUploader = require("express-fileupload")
const authRouter = require("./routes/auth.routes")
const fileRouter = require("./routes/file.roures")
const corsMiddleware = require("./middleware/cors.middleware")
const filePathMiddleware = require("./middleware/filePathMiddleware")
const path = require("path")

const app = express()
const PORT = process.env.PORT || config.get("serverPort")


app.use(fileUploader({
    defCharset: "utf8",
    defParamCharset: "utf8"
}));
app.use(corsMiddleware)
app.use(filePathMiddleware(path.resolve(__dirname, "files")))
app.use(express.json())
app.use(express.static("static"))
app.use("/api/auth", authRouter)
app.use("/api/files", fileRouter)

const start = async () => {
    try {
        console.log("Сервер грузится....")
        await mongoose.connect(config.get("dbUrl"))


        app.listen(PORT, () => {
            console.log("СИСЬКИ НА ПОРТУ ", PORT)
        })
    }catch (e) {
        console.log(e)
    }
}

start()