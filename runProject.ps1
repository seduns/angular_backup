# Define the full path for your Tye YAML file and Docker Compose file
$dockerComposeFilePath = "E:\DEV\Survey_Form_3_Backup\angular\etc\docker\docker-compose.infrastructure.yml"
$tyeFilePath = "E:\DEV\Survey_Form_3_Backup\angular\run-service"
$AngularFilePath = "E:\DEV\Survey_Form_3_Backup\angular\apps\angular"

# Create the Docker network and run Docker Compose
docker network create mymicroservice_7 --label=mymicroservice_7
docker-compose -f $dockerComposeFilePath up -d

# Start the Tye services in the background
Start-Process "cmd.exe" -ArgumentList "/C", "cd $tyeFilePath && tye run"


# Start the Angular app using the full path to the start.ps1 script in the background
Start-Process "cmd.exe" -ArgumentList "/C", "cd $AngularFilePath && yarn start"

# Wait for the Tye services to exit and capture the exit code

# Exit with the same exit code as the Tye process (if necessary)
exit $LASTEXITCODE
        