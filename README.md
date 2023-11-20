## SafeJWTUserExpress

SafeJWTUserExpress is an open-source Node.js repository dedicated to providing a secure, user-friendly, and easily maintainable authentication and user management solution. Built with a focus on robust security practices, seamless JWT integration, and the simplicity of Express.js, this project aims to empower developers with a reliable toolkit for user authentication and a starter kit for all your Express projects to save your hours or even days of hard work.

### Features

- **Security First:** Incorporates best practices for secure user authentication to safeguard your application against common threats.

- **JWT Integration:** Seamless integration of JSON Web Tokens (JWT) for efficient and secure user authentication and authorization.

- **Express.js Compatibility:** Designed to work seamlessly with Express.js, allowing for easy integration into your Node.js web applications.

- **Easy to Maintain:** Built with clean and maintainable code, enhanced with comprehensive commenting for developers to easily understand, extend, and update the codebase.

- **Modular Design:** Follows a modular architecture, allowing you to easily customize and extend functionality based on your project's requirements.

- **Professional Responses:** Ensures good and professional responses to enhance the user experience and provide meaningful feedback during authentication and user management processes.

- **Robust Error Handling:** Implements robust error handling mechanisms for graceful degradation and effective troubleshooting.

- **Token Blacklisting:** Provides token blacklisting to enhance security by efficiently managing and invalidating tokens.

- **Works with ORM (Mongoose):** Currently supports NoSQL databases using Mongoose as the ORM. Soon to include SQL database support with Postgres.

- **Environment Variable Checker:** Includes a function that checks for all environment variables, ensuring a smooth and error-free configuration.

- **Express Middleware:**

  - **body-parser:** Parse incoming request bodies in a middleware.
  - **cookie-parser:** Parse Cookie header and populate `req.cookies` with an object keyed by cookie names.
  - **cors:** Enable Cross-Origin Resource Sharing.

- **Data Encryption:**

  - **crypto-js:** Encrypt and decrypt data securely.

- **Environment Variables:**

  - **dotenv:** Load environment variables from a `.env` file.

- **Express Framework:**

  - **express:** Fast, unopinionated, minimalist web framework for Node.js.

- **JSON Web Tokens:**

  - **jsonwebtoken:** Generate and verify JSON web tokens for secure communication between parties.

- **Database Interaction:**

  - **mongoose:** Elegant MongoDB object modeling for Node.js.

- **Email Sending:**

  - **nodemailer:** Send emails from Node.js applications.

- **Development Workflow:**
  - **nodemon:** Monitor for any changes in the application and automatically restart the server.

### Getting Started

1. Clone the repository.
2. Follow the detailed documentation to integrate SafeJWTUserExpress into your Node.js project.
3. Enhance your application's security, user management, and user experience with confidence.

### Installation

### Getting Started

1. **Clone the Repository:**

   - Clone the SafeJWTUserExpress repository to your local machine using the following command:

     ```bash
     git clone https://github.com/Toluwalope-Coast/safe-jwt-user-express.git
     ```

2. **Install Dependencies:**

   - Navigate to the project directory:

     ```bash
     cd safe-jwt-user-express
     ```

   - Install the project dependencies using npm:

     ```bash
     npm install
     ```

3. **Create .env File:**

   - Create a file named `.env` in the root folder of the project.
   - Open the `.env` file and define the following required environment variables:

     - `DB_CONNECTION`: Your MongoDB connection URL.
     - `PORT`: Your chosen port number (between 1023 - 65353).
     - `JWT`: A secret key for JSON Web Token (JWT) generation. Use a long, complex, and random alphanumeric string for enhanced security.
       Example:

     ````env
         DB_CONNECTION=your-mongodb-url
         PORT=your-chosen-port-number
         JWT=your-secret-key ```
     ````

   Optional Environment Variables:

   - The following environment variables are optional but can be configured based on your needs:
     - `DOMAINS`: Specify allowed domains.
     - `NODE_ENV`: Set the Node.js environment (e.g., 'development', 'production').
     - `NODEMAILER_SERVICES`: Specify the email service provider.
     - `NODEMAILER_HOST`, `NODEMAILER_PORT`: Set the SMTP host and port for nodemailer.
     - `NODEMAILER_USER`, `NODEMAILER_PASS`: Provide credentials for nodemailer.
     - `NODEMAILER_SUBJECT`: Define a default email subject for nodemailer.
       Example:

   ````env
       DOMAINS=your-allowed-domains
       NODE_ENV=development
       NODEMAILER_SERVICES=your-email-service
       NODEMAILER_HOST=your-smtp-host
       NODEMAILER_PORT=your-smtp-port
       NODEMAILER_USER=your-smtp-username
       NODEMAILER_PASS=your-smtp-password
       NODEMAILER_SUBJECT=your-default-email-subject```

   ````

4. Run the Application:
   After configuring the environment variables, run the application using:
   `npm run dev`

### Documentation

Comprehensive documentation is available to guide you through the setup process, usage, and customization. Visit the[Coast Craft Blog](https://www.coastcraft.com.ng/safe-jwt-user-express) for detailed information.

### Contributions

Contributions are welcome! Feel free to open issues, submit pull requests, or provide feedback to help improve and expand the functionality of SafeJWTUserExpress.

### License

This project is licensed under the [MIT License](https://licences.coastresearchtechnology.com.ng/safe-jwt-user-express). Feel free to use, modify, and distribute it for your applications.

Secure your Node.js application with SafeJWTUserExpress today!

### Contact

If you have any questions or need assistance, feel free to [contact us](mailto:coast@coastresearchtechnology.com.ng).
