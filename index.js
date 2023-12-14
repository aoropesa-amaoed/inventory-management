import express from "express";
//morgan middelware
import morgan from "morgan";
import cors from "cors";

//assign port to host the server
//access port to environment variables
const PORT=process.env.PORT || 3001;
//Create a http server
const app = express();

morgan.token("body",function(req, res){
    return JSON.stringify(req.body);
});

//sample data since we dont have database

//add a  middleware to read json data
//this is need before you create the http post request
//use the use method
app.use(cors());
app.use(express.json());
app.use(morgan(":method :url :status - :response-time ms :body"));



let itemMaster = [
    {
        id:1,
        itemcode: "FG001",
        itemDescription: "Nutty Chocolate",
    },
    {
        id:2,
        itemcode: "FG002",
        itemDescription: "Strawberry Field",
    },
    {
        id:3,
        itemcode: "FG003",
        itemDescription: "Choco Wacko",
    },
    {
        id:4,
        itemcode: "FG004",
        itemDescription: "Butternut",
    },
];

//logger ng information of request na pumapasok sa server

//handling wrong url
//also a middleware, however calling it at the end of the http methods
function unknownEnpoint(req, res)   {
    res.status(404).send({error:"unknown endpoint"})
}
//helper to generete id since wala pang database
function  generateId(){
    const maxId = itemMaster.length > 0 ? Math.max(...itemMaster.map(n=>n.id)) : 0;
    return maxId +1;
};

//http methods here
app.get("/",(req, res)=>{
    return res.send("<h1>Main Page</h1>");
});
 app.get("/itemMaster/info", (req, res)=>{
    const itemCount = itemMaster.length;
    return res.send(`<p>Items has a total of ${itemCount}</p>`)
 });

app.get("/itemMaster",(req, res)=>{
    return res.json(itemMaster);
});

//get specific data
app.get("/itemMaster/:id", (req, res)=>{
    const id = Number(req.params.id);
    const item = itemMaster.find((item)=> item.id===id);
    return res.json(item);
});

app.delete("/itemMaster/:id",(req, res)=>{
    //access id
    const id = Number(req.params.id);
    //get item master data array then re-assigned the value
    itemMaster = itemMaster.filter(note => note.id !==id)
    //send response to client status 204 then end the request
    return res.status(204).end();   
    
});

app.post("/itemMaster",(req,res)=>{
   
    const body = req.body;

    //validate if there is no content when creating a new item
    if(!body.itemcode || !body.itemDescription){
      return res.status(400).json({
        error:"Both item code and item description are required"});      
    }
    
    const item ={
        itemcode:body.itemcode,
        itemDescription: body.itemDescription,
        id:generateId()
    }
        //get the item master data array then push the new item
    itemMaster = itemMaster.concat(item);
     //send response to client status 204 then end the request
     return res.status(201).json(item);  

});

app.use(unknownEnpoint);

//call for the port
app.listen(PORT,()=>{
//to check
console.log(`Server is now running in port ${PORT}`); 
});
