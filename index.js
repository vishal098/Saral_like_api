const express = require("express")

const fs = require("fs")

const morgan = require("morgan")

const app = express()

const bodyparser = require("body-parser")


app.use(express.json())
app.use(morgan("dev"))


app.get("/",(req, res) => {
	let convert = JSON.parse(fs.readFileSync("course.json"))
	res.send(convert)
});

app.get('/coursedetail/:id', (req, res) => {
	let convert = JSON.parse(fs.readFileSync("course.json"))
	let course = [] 
	for (i of convert){
		if (i.id == req.params.id){
			course.push(i)
		}
	}res.status(200).send(course)
});



app.get("/courses",(req, res) => {
	let convert = JSON.parse(fs.readFileSync("course.json"))

	let arr = []
	for (i of convert){
		delete i.submission
		arr.push(i)
	}res.status(200).send(arr)
});



app.get("/course/:id",(req, res) => {
	let convert = JSON.parse(fs.readFileSync("course.json"))

	let arr = []
	for (i of convert){
		if (i.id == req.params.id){
			delete i.submission
			arr.push(i)
		}
	}res.status(200).send(arr)
});

// submission ###########################

app.get('/exercises', (req, res) => {
	let convert = JSON.parse(fs.readFileSync("course.json"))
	let list1 = [] 
	for (i of convert){
			for (j of i.submission){
				delete j.usersummision
				list1.push(j)
			}
	}res.status(200).send(list1)
});


app.get('/exercisedetail/:id', (req, res) => {
	let convert = JSON.parse(fs.readFileSync("course.json"))
	let list1 = [] 
	for (i of convert){
		if (i.id == req.params.id){
			list1.push(i.submission)
		}
	}res.status(200).send(list1)
});


app.get('/exercises/:id', (req, res) => {
	let convert = JSON.parse(fs.readFileSync("course.json"))
	let list1 = [] 
	for (i of convert){
		if (i.id == req.params.id){
			for (j of i.submission){
				delete j.usersummision
				list1.push(j)
			}
		}
	}res.status(200).send(list1)});





app.get('/exercises/:id/:course_id/', (req, res) => {
	let convert = JSON.parse(fs.readFileSync("course.json"))
	let list1 = [] 
	for (i of convert){
		if (i.id == req.params.id){
			for (j of i.submission){
				if (j.courseid == req.params.course_id){
					delete j.usersummision
					list1.push(j)
				}
			}
		}
	}res.status(200).send(list1)
});
// console.log(convert)


// comment####################################



app.get('/comment', (req, res) => {
	let convert = JSON.parse(fs.readFileSync("course.json"))
	let list1 = [] 
	for (i of convert){
			for (j of i.submission){
				list1.push(j.usersummision)
			}
	}res.status(200).send(list1)
});

app.get('/comment/:id', (req, res) => {
	let convert = JSON.parse(fs.readFileSync("course.json"))
	let list1 = [] 
	for (i of convert){
		if (i.id == req.params.id){
			for (j of i.submission){
				list1.push(j.usersummision)
			}
		}
	}res.status(200).send(list1)
});


app.get('/comment/:id/:courseid', (req, res) => {
	let convert = JSON.parse(fs.readFileSync("course.json"))
	let list1 = [] 
	for (i of convert){
		if (i.id == req.params.id){
			for (j of i.submission){
				if (j.courseid == req.params.courseid){
					list1.push(j.usersummision)
				}
			}
		}
	}res.status(200).send(list1)});


// delete????????????????????????????????????????????????

app.delete('/delete/:id', (req, res) => {
	let convert = JSON.parse(fs.readFileSync("course.json"))
	
	let indexOfId=req.params.id-1
	delete convert[indexOfId]
	res.send(convert)
	fs.writeFileSync("course.json",JSON.stringify(convert,null,2),null)


});


app.delete('/delete/course/:id/:courseid/', (req, res) => {
	let convert = JSON.parse(fs.readFileSync("course.json"))
	
	let indexOfId=req.params.id-1
	let indexOfC=req.params.courseid -1
	const data = convert[indexOfId]["submission"]
	delete data[indexOfC]
	res.send(data)
	fs.writeFileSync("course.json",JSON.stringify(convert,null,2),null)


});

app.delete('/deletecomments/:id/:courseid/', (req, res) => {

	let convert = JSON.parse(fs.readFileSync("course.json"))
	let indexOfC=req.params.id-1
	let indexOfid=req.params.courseid-1
	const data = convert[indexOfC]["submission"][indexOfid]
	delete data.usersummision
	res.send(data)
	fs.writeFileSync("course.json",JSON.stringify(convert,null,2),null)

});


app.delete('/deleteusercomment/:id/:courseid/:email', (req, res) => {

	let convert = JSON.parse(fs.readFileSync("course.json"))
	let indexOfC=req.params.id-1
	let indexOfid=req.params.courseid-1
	const data = convert[indexOfC].submission[indexOfid].usersummision

	for  (i of data){
		if (i.username==req.params.email){
			console.log(i.usersubmissions)
			delete i.usersubmissions
		}
	}
	res.send(data)
	fs.writeFileSync("course.json",JSON.stringify(convert,null,2),null)

});

// post##########################################################


app.post('/create',(req, res) => {
	let convert = JSON.parse(fs.readFileSync("course.json"))
	let l = convert.length
    let post1 = {"id": l+1 ,
    "name": req.body.name,
    "description": req.body.description,
    "submission": req.body.submission
	}
	console.log(post1)
    convert.push(post1)
    res.send(convert)
	fs.writeFileSync("course.json",JSON.stringify(convert,null,2),null)
});

app.post('/create/course/:id',(req, res) => {
	let convert = JSON.parse(fs.readFileSync("course.json"))
	let submission=convert[req.params.id -1].submission
	let l = submission.length
	// console.log(l)
    let post1 = {
    	"id": req.params.id,
        "courseid": l+1,
        "name": req.body.name ,
        "description": req.body.description,
        "usersummision": req.body.usersummision
    }
	console.log(post1)
    submission.push(post1)
    res.send(convert)
	fs.writeFileSync("course.json",JSON.stringify(convert,null,2),null)
});

app.post('/create/course/comment/:id/:courseid',(req, res) => {
	let convert = JSON.parse(fs.readFileSync("course.json"))
	let submission=convert[req.params.id -1].submission
	let usersummision = submission[req.params.courseid -1].usersummision
    let post1 = {
            "id": req.params.id,
            "courseid": req.params.courseid,
            "username": req.body.username,
            "usersubmissions":req.body.usersubmissions
    }
	console.log(post1)
    usersummision.push(post1)
    res.send(convert)
	fs.writeFileSync("course.json",JSON.stringify(convert,null,2),null)
});

// update####################################################

app.put('/update/idname/:id',(req,res) => {
	let convert = JSON.parse(fs.readFileSync("course.json"))
	convert[req.params.id - 1].name="updated"
	fs.writeFileSync("course.json",JSON.stringify(convert,null,2),null)
})


app.put('/update/iddescription/:id',(req,res) => {
	let convert = JSON.parse(fs.readFileSync("course.json"))
	convert[req.params.id - 1].description="updated"
	fs.writeFileSync("course.json",JSON.stringify(convert,null,2),null)
})


app.put('/update/course/name/:id/:courseid',(req,res) => {
	let convert = JSON.parse(fs.readFileSync("course.json"))
	let indexOfId = convert[req.params.id -1].submission
	indexOfId[req.params.courseid-1].name="updated"
	res.send(convert)
	fs.writeFileSync("course.json",JSON.stringify(convert,null,2),null)
})



app.put('/update/course/description/:id/:courseid',(req,res) => {
	let convert = JSON.parse(fs.readFileSync("course.json"))
	let indexOfId = convert[req.params.id -1].submission
	indexOfId[req.params.courseid-1].description="updated"
	res.send(convert)
	fs.writeFileSync("course.json",JSON.stringify(convert,null,2),null)
})


app.put('/edit/comment/:id/:courseid/:email',(req,res) => {
	let convert = JSON.parse(fs.readFileSync("course.json"))
	let indexOfId = convert[req.params.id -1].submission
	usersummision=indexOfId[req.params.courseid-1].usersummision
	for (i of usersummision ){
		if (req.params.email==i.username){
			i.usersubmissions="updated"
		}
	}res.send(convert)
	// fs.writeFileSync("course.json",JSON.stringify(convert,null,2),null)
})


const port = 3000
app.listen(port,()=> {
	console.log("server is runing " + port)
});

