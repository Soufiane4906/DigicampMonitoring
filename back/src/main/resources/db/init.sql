-- Script d'initialisation de la base de données DigicampMonitoring

-- Création de la base de données
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'digicampdb')
BEGIN
    CREATE DATABASE digicampdb;
END
GO

USE digicampdb;
GO

-- Table des rôles
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'roles')
BEGIN
    CREATE TABLE roles (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(50) NOT NULL UNIQUE,
        description NVARCHAR(255)
    );
END
GO

-- Table des utilisateurs
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
BEGIN
    CREATE TABLE users (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(100) NOT NULL UNIQUE,
        email NVARCHAR(100) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        first_name NVARCHAR(100),
        last_name NVARCHAR(100),
        active BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2
    );
END
GO

-- Table de liaison users-roles
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'user_roles')
BEGIN
    CREATE TABLE user_roles (
        user_id BIGINT NOT NULL,
        role_id BIGINT NOT NULL,
        PRIMARY KEY (user_id, role_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
    );
END
GO

-- Table des statuts de projets
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'project_statuses')
BEGIN
    CREATE TABLE project_statuses (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        code NVARCHAR(100) NOT NULL UNIQUE,
        label NVARCHAR(100) NOT NULL,
        color NVARCHAR(7),
        display_order INT
    );
END
GO

-- Table des projets
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'projects')
BEGIN
    CREATE TABLE projects (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(200) NOT NULL,
        logo_url NVARCHAR(500),
        description NVARCHAR(MAX),
        objectives NVARCHAR(MAX),
        start_date DATE,
        end_date DATE,
        status_id BIGINT,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2,
        FOREIGN KEY (status_id) REFERENCES project_statuses(id)
    );
END
GO

-- Table des collaborateurs
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'collaborators')
BEGIN
    CREATE TABLE collaborators (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        first_name NVARCHAR(100) NOT NULL,
        last_name NVARCHAR(100) NOT NULL,
        email NVARCHAR(100) UNIQUE,
        phone NVARCHAR(20),
        grade NVARCHAR(100),
        position NVARCHAR(100),
        site NVARCHAR(100),
        skills NVARCHAR(MAX),
        available BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2
    );
END
GO

-- Table des affectations projet-collaborateur
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'project_assignments')
BEGIN
    CREATE TABLE project_assignments (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        project_id BIGINT NOT NULL,
        collaborator_id BIGINT NOT NULL,
        assignment_date DATE NOT NULL,
        end_date DATE,
        role NVARCHAR(100),
        allocation_percentage DECIMAL(5,2),
        notes NVARCHAR(MAX),
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (collaborator_id) REFERENCES collaborators(id) ON DELETE CASCADE
    );
END
GO

-- Table des besoins en ressources
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'project_needs')
BEGIN
    CREATE TABLE project_needs (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        project_id BIGINT NOT NULL,
        skill_required NVARCHAR(100) NOT NULL,
        grade_required NVARCHAR(100),
        quantity INT NOT NULL,
        description NVARCHAR(MAX),
        fulfilled BIT NOT NULL DEFAULT 0,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
END
GO

-- Insertion des données de référence

-- Rôles par défaut
IF NOT EXISTS (SELECT * FROM roles WHERE name = 'EM')
BEGIN
    INSERT INTO roles (name, description) VALUES ('EM', 'Engineering Manager');
END
GO

-- Statuts de projets par défaut
IF NOT EXISTS (SELECT * FROM project_statuses WHERE code = 'INIT')
BEGIN
    INSERT INTO project_statuses (code, label, color, display_order) VALUES
    ('INIT', 'Initialisé', '#6c757d', 1),
    ('PLAN', 'En planification', '#17a2b8', 2),
    ('PROG', 'En cours', '#ffc107', 3),
    ('REVIEW', 'En revue', '#fd7e14', 4),
    ('DONE', 'Terminé', '#28a745', 5),
    ('HOLD', 'En attente', '#dc3545', 6),
    ('CANCEL', 'Annulé', '#6c757d', 7);
END
GO

-- Création des index pour optimiser les performances
CREATE NONCLUSTERED INDEX IX_users_username ON users(username);
CREATE NONCLUSTERED INDEX IX_users_email ON users(email);
CREATE NONCLUSTERED INDEX IX_projects_status ON projects(status_id);
CREATE NONCLUSTERED INDEX IX_projects_dates ON projects(start_date, end_date);
CREATE NONCLUSTERED INDEX IX_collaborators_available ON collaborators(available);
CREATE NONCLUSTERED INDEX IX_project_assignments_project ON project_assignments(project_id);
CREATE NONCLUSTERED INDEX IX_project_assignments_collaborator ON project_assignments(collaborator_id);
GO

PRINT 'Base de données DigicampMonitoring initialisée avec succès!';
GO
