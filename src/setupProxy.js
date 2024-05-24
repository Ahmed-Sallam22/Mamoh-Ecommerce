const {createProxyMiddleware}=require('http-proxy-middleware')


const proxy={
    target:"https://tapis.ma-moh.com",
    changeorigin:true
};
module.exports=function(app){
    app.use('/api',createProxyMiddleware(proxy))
}