/*
 * Create and export configuration variables
 *
 */

 // Containter for all the environments
 const environments = {};

 // Staging (default) environment
 environments.staging = {
   'port': 3008,
   'envName': 'staging'
 };

 // Production environment
 environments.production = {
   'port': 5008,
   'envName': 'production'
 };

 // Determine which environment was passed as a command-line argument
 const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

 // Check that current environment is one of the environments above; if not, default to staging
 const environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

 // Export the module
 module.exports = environmentToExport;
