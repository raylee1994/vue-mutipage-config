const Koa = require("koa");
const app = new Koa();
const static = require("koa-static");

const port = 1325;
const router = require("koa-router")();

router.get("/", async (ctx, next) => {
    ctx.request.url = "/index.html";
    await next();
})

app.use(router.routes());
app.use(static("./dist"));

app.listen(port, function(){
    console.log(`listening at localhost:${port}`);
});