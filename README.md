# programme_manager

## Create the pub/sub topic
````
gcloud pubsub topics create tbd
````

## Naming conventions
### API
````

````


### Pub/Sub
````
topic: "MA_SCHEDULE_TEST"
````


### Cloud Scheduler
````
jobId: [programme]
name: projects/[projectId]/locations/[locationId]/jobs/[programme]
````


### Fire store
````
Collections
⦁	programmes
⦁	channels
⦁	markets
⦁	outputs
⦁	destinations
⦁	selections
Documents are named from what they refer to. For example if market ca is added to markets a document ca is created under markets collection:
markets/ca
The ca document contains { "market": "ca" }

````


## App engine
### Routes
#### /selection
````
/add
POST
Body: 
{  
	String selection, 
	String inclusion,
	String exclusion
} 

/list 
GET

/delete/:selection
POST

/get
GET
````

#### /market
````
/add
POST
Body: 
{  
	String market, 
} 

/list
GET

/get
GET

/delete/:market
POST
````

#### /channel
````
/add
POST
Body: 
{  
	String channel, 
} 

/list
GET

/delete/:channel
POST
````

#### /destination
````
/add
POST
Body: 
{  
	String destination, 
} 

/list
GET

/delete/:destination
POST
````

#### /output
````
/add
POST
Body: 
{  
	String output, 
} 

/list
GET

/delete/:output
POST
````

#### /programme
````
/get/:programme
GET

/list
GET

/add
POST
{
	string programme
    string schedule *
    string channel
    string output
    string market
    string destination
    string selection **
}
*schedule in five point cron format
"[minute] [hour] [day/month] [month] [day/week]"
** Key to complex format selection

/delete
POST
````

#### /SCHEDULE
````
/create/:programme
POST

/run
POST

/get/:programme
GET

/list
GET
````






