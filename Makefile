import:
	mongoimport --uri=mongodb://mongoadmin:secret@127.0.0.1:27888/test?authSource=admin --collection alltypes --drop --file examples/alltypes.json

#For Mac user running Colima.
#I had the same problem on Mac and it turns out it was a problem when using the default Colima settings. Changing the vmType to vz and mountType to virtiofs.
#To fix this run:
#Colima delete
#Colima start --edit and update vmType and mountType
run_mongo:
	docker run -p 27888:27017 -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=secret -v ${HOME}/MongoDB/data:/data/db mongo
