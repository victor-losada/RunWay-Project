Introduction:

Runway Domicilios is an application that allows for efficient order management. This documentation will guide you through the installation and usage process of the application on Linux and Windows operating systems.

Prerequisites:
* Node.js: Required to run the application.
* Git: To clone the repository.
* MySQL: For the application to work correctly, you need to have MySQL installed and configured.
* Laragon (optional): Laragon is a local development environment that simplifies the installation and management of web applications.

Cloning the Repository:

Open a terminal (either on Windows or Linux) and execute the following command to clone the repository.:
git clone https://github.com/victor-losada/RunWay-Project.git

Installation of Dependencies
* Navigate to the project directory for both the frontend (FRONTEND) and the backend (Runwaydomicilios):
cd Runwaydomicilios or FRONTEND

* Install the necessary dependencies by running:
npm install

IMPORT THE "runway.." DATABASE ON YOUR MACHINE

Database Configuration:

Before running the application, it is necessary to configure some environment variables. Open the .env file at the root of the project (Runwaydomicilios) and add the following lines:

DB_HOST=localhost

DB_USER=you_user

DB_PASSWORD=you_password

DB_NAME=name_database

FRONTEND CONFIGURATION - environment variables

* After setting up the database in the backend, we head to the frontend to the "config.js" file located in the SRC folder.
* There, what we do is change the API_HOST to the local IP address we have on the device.
   Note: Make sure that the IP address and port are correct and accessible from your device. If you can't find or don't know which IP address is being referred to, simply run the frontend with the following command:
npm run dev -- --host or npm run dev

WHAT YOU WILL SEE WILL BE SOMETHING LIKE THIS:

  VITE v5.4.10  ready in 951 ms

  ➜  Local:   http://localhost:5173/
  
  ➜  Network: http://192.168.100.6:5173/
  
  ➜  press h + enter to show help
  
and where it says Network, only the IP is copied and pasted into the variables. In this case, the IP would be: 192.168.100.6

WHY IS THIS DONE?

The system is designed to work on both computers and mobiles. Keep in mind that it is not software deployed on any server or cloud, so if the system is to be tested on any mobile device or computer solely via URL, both the backend and frontend must be running on the local machine. And as an important point, for it to work on multiple devices, all must be connected to the same Wi-Fi network of the local machine.

NOTIFICATION CONFIGURATION (socket.io)

* Once the above is completed, we go to a folder in the frontend called "context," which contains a configuration file for notifications (SocketContext).
* Once inside, we will modify the URL that connects the notifications from the backend to the frontend:
 useEffect(() => {

    if (auth?.user) {
  
      const newSocket = io('http://---ip----:3000/', {
  
        transports: ['websocket', 'polling'],
  
        withCredentials: true
  
      });
  
* Here we do the same as the previous step, we change the IP☝️.  
*  
  - Note: 3000 is kept. Unless you have changed the port in the backend to any other one. 
  
Running the Application  
  
- Finally, once the frontend is running well, we head to the backend to the "index.js" file in the root of the backend, and we will modify the CORS of the socket.:
  
  const io = new SocketIOServer(server, {
  
    cors: {
  
        origin: ["http://192.168.100.6:5173/"],
  
        methods: ["GET", "POST", "PATCH", "PUT"],
  
        credentials: true
    }
  
});

* We change the origin URL to the one given in the terminal where we are running the frontend☝️

Application Usage

* Once the application is configured, run the backend (with the frontend running) using the following code:
npm run dev

* You can access it through your web browser. Just enter the URL http://localhost:5173/ if you only want to test the software locally. If you want to try it on other devices with other people, enter the second URL. For example:
  
Network: http://192.168.100.6:5173/

* IMPORTANT NOTE *
To start testing the system, the database already has one or more users (or users by role), and the login details for each user can be found in the USUARIOS.txt file of this repository.

LINUX

Considerations for Linux

If you are using Linux, make sure that:

* You have permissions to open the necessary ports (3000 and 5173).
  
* The firewall is not blocking the connections. You can use ufw to allow traffic:

- sudo ufw allow 3000
  
- sudo ufw allow 5173

Also, make sure your system is updated. Open a terminal and run the following commands:

- sudo apt-get update
  
- sudo apt-get upgrade

On Linux, after verifying the above, you can continue configuring and deploying the project in the same way as mentioned at the beginning.

Troubleshooting

* If you encounter problems when running the application, check the following:
  
* Make sure that Node.js and npm are properly installed.
  
* Verify that the environment variables are correctly configured.
  
* Check the terminal console for any error messages.
