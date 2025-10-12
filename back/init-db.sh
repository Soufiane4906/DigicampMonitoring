#!/bin/bash

# Wait for SQL Server to start
sleep 30s

# Create the database
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourPassword123!" -C -Q "
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'digicampdb')
BEGIN
    CREATE DATABASE digicampdb;
END
GO
"

echo "Database digicampdb created or already exists"
