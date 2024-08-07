const http=require('http');
const fs=require('fs');
var requests=require('requests');
const homefile=fs.readFileSync("index.html", "utf-8");

const replaceval =(tempVal, orgVal) =>{
    
let temperature = tempVal.replace("{%tempval%}",(orgVal.main.temp - 273.15).toFixed(2)); // Convert to fixed decimal places if needed
temperature = temperature.replace("{%tempmin%}", (orgVal.main.temp_min - 273.15).toFixed(2)); // Convert min temp to Celsius
temperature = temperature.replace("{%tempmax%}", (orgVal.main.temp_max - 273.15).toFixed(2)); // Convert max temp to Celsius
temperature = temperature.replace("{%country%}", orgVal.sys.country);
temperature = temperature.replace("{%location%}", orgVal.name);
temperature = temperature.replace("{%tempstatus%}", (orgVal.weather[0].main));

return temperature;
     
}

const server=http.createServer((req,res)=>
    {
        if(req.url=="/"){
            requests("https://api.openweathermap.org/data/2.5/weather?q=Nashik&appid=4da0cba990bbe3043e5a1294f88b0e60")
            .on("data",(chunk)=>{
                const objdata=JSON.parse(chunk);
                const arrydata=[objdata];
              
               const realTimeData= arrydata.map((val) => replaceval(homefile,val)).join(" ");
                res.write(realTimeData);
            //  console.log(realTimeData);
               
            })
            .on("end",(err)=>{
               if(err)return console.log("connnection is not established",err);
               res.end();
               
            });

        }
    });
    server.listen(3000,"127.0.0.1");
